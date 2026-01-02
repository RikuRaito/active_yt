import { authenticateUser, corsHeaders } from "../_shared/auth.ts";

interface VideoCardData {
  channelId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

Deno.serve(async (req) => {
  const authResult = await authenticateUser(req);

  if (authResult instanceof Response) {
    return authResult;
  }
  const { client, user } = authResult;
  try {
    const body = await req.json();
    const playlist_ids: string[] = body.uploadsPlaylistIds;
    //12.30　この配列チェック処理を追加
    if (!playlist_ids || !Array.isArray(playlist_ids)) {
      return new Response(
        JSON.stringify({ error: "playlistIds array is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const youtubeUrl = Deno.env.get("YOUTUBE_API_URL");
    //各IDに対して並列でfetchを実行
    const videoPromises = playlist_ids.map(async (id) => {
      const url = `${youtubeUrl}/playlistItems?part=snippet&playlistId=${id}&maxResults=1&key=${apiKey}`;
      //動画の取得処理
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Youtube API Error for ${id}: ${res.statusText}`);
        return [];
      }
      const data = await res.json();
      const mappedData: VideoCardData[] = data.items.map((d: any) => ({
        channelId: d.snippet.channelId,
        videoId: d.snippet.resourceId.videoId,
        title: d.snippet.title,
        thumbnail: d.snippet.thumbnails.high.url,
        channelTitle: d.snippet.channelTitle,
        publishedAt: d.snippet.publishedAt,
      }));
      return mappedData;
    });

    const results = await Promise.all(videoPromises);
    const allVideos = results.flat();

    return new Response(JSON.stringify({ items: allVideos ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Internal Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
