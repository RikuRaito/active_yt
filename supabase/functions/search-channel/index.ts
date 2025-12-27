import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  //認証ヘッダーの取得
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "認証が必要です" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  //トークン検証
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
