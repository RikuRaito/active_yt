import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateUser, corsHeaders } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const authResult = await authenticateUser(req);

  if (authResult instanceof Response) {
    return authResult;
  }
  const { user } = authResult;
  //管理者権限でのDB操作
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.json();
    const channelId = body.id;
    const userUuid = user.id;

    //Yotube Data APIからチャンネルのプレイリストID等のデータを取得
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const youtubeUrl = Deno.env.get("YOUTUBE_API_URL");
    const ytRes = await fetch(
      `${youtubeUrl}?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`
    );
    const ytData = await ytRes.json();
    const ytChannel = ytData.items[0];

    if (!ytChannel) throw new Error("Channel not found on Youtube");

    //channelsテーブルにデータ保存
    const { error: chError } = await adminClient.from("channels").upsert(
      {
        channel_id: channelId,
        title: ytChannel.snippet.title,
        handle: ytChannel.snippet.customUrl,
        thumbnail_url: ytChannel.snippet.thumbnails.high?.url,
        uploads_playlist_id: ytChannel.contentDetails.relatedPlaylists.uploads,
        subscriber_count: ytChannel.statistics?.subscriberCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "channel_id" }
    );
    if (chError) throw chError;

    //subscriptionsテーブルにデータ保存
    const { data, error: subError } = await adminClient
      .from("subscriptions")
      .upsert(
        {
          uuid: userUuid,
          channel_id: channelId,
        },
        { onConflict: "uuid,channel_id" }
      )

      .select()
      .single();
    if (subError) {
      console.error("Database Error:", subError);
      throw new Error(`DB Error: ${subError.message}`);
    }
    return new Response(JSON.stringify({ message: "チャンネルの登録に成功" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Internal Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
