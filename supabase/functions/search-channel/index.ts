import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const handle = body.handle;
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const youtubeUrl = Deno.env.get("YOUTUBE_API_URL");
    const url = `${youtubeUrl}?part=snippet,statistics&forHandle=${handle}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Youtube API Error:", errorData);
      throw new Error(`Youtube API responded with ${res.status}`);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
    return new Response(JSON.stringify(data.items), {
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
