import { authenticateUser, corsHeaders } from "../_shared/auth.ts";

interface VideoCardData {
  channelId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

// ISO 8601形式のdurationを秒数に変換
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
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
        },
      );
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const youtubeUrl = Deno.env.get("YOUTUBE_API_URL");
    //各IDに対して並列でfetchを実行
    const videoPromises = playlist_ids.map(async (id) => {
      const url = `${youtubeUrl}/playlistItems?part=snippet&playlistId=${id}&maxResults=5&key=${apiKey}`;
      //動画の取得処理
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Youtube API Error for ${id}: ${res.statusText}`);
        return [];
      }
      const data = await res.json();
      //durationでのショート動画判別(Youtube Data APIを使って５件の動画の長さを取得する)
      const videoIds = data.items.map((d: any) => d.snippet.resourceId.videoId).join(',');
      const videoUrl = `${youtubeUrl}/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
      const videosRes = await fetch(videoUrl);
      const videoData = await videosRes.json();
      const shortVideoIds = new Set(
        videoData.items
          .filter((v: any) => {
            const duration = v.contentDetails.duration;
            const seconds = parseDuration(duration);
            return seconds <= 60;
          })
          .map((v: any) => v.id)
      );
      const filtered = data.items.filter(
        (d: any) => !shortVideoIds.has(d.snippet.resourceId.videoId)
      );

      const mappedData: VideoCardData[] = filtered.slice(0, 1).map((d: any) => ({
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
