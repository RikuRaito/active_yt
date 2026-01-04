import { authenticateUser, corsHeaders } from "../_shared/auth.ts";

interface VideoCardData {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface ChannelVideoCardData {
  channelId: string;
  channelTitle: string;
  videos: VideoCardData[];
}

Deno.serve(async (req) => {
  const authResult = await authenticateUser(req);

  if (authResult instanceof Response) {
    return authResult;
  }
  const { client, user } = authResult;
  try {
    const body = await req.json();
    const playlist_id: string = body.playlistId;
    if (!playlist_id) {
      return new Response(JSON.stringify({ error: "playlistId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const youtubeUrl = Deno.env.get("YOUTUBE_API_URL");

    const url = `${youtubeUrl}/playlistItems?part=snippet&playlistId=${playlist_id}&maxResults=50&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Youtube API Error for ${playlist_id}: ${res.status}`);
      return;
    }
    const data = await res.json();
    const mappedData: ChannelVideoCardData = {
      channelId: data.items[0].snippet.channelId,
      channelTitle: data.items[0].snippet.channelTitle,
      videos: data.items.map((item: any) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
      })),
    };
    return new Response(JSON.stringify(mappedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Internal Error: ", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
