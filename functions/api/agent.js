/**
 * Cloudflare Pages Function — Frank Agent
 * No auth walls, no Vercel limits. Edge-executed.
 */
const FRANK_URL = "https://frank.manhattanviral.com"; // Cloudflare Tunnel URL

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequest(context) {
  const { request, env } = context;
  const frankBase = env.FRANK_BACKEND_URL || FRANK_URL;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, agent: "frank", site: "manhattanviral.com", powered_by: "frank-ai" }),
      { headers: CORS }
    );
  }

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: CORS }); }

  const { message, user_id, context: ctx } = body;
  if (!message) return new Response(JSON.stringify({ error: "message required" }), { status: 400, headers: CORS });

  try {
    const res = await fetch(`${frankBase}/inbound/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, source: "manhattanviral.com", user_id: user_id || "mv_visitor", context: ctx || {} }),
      signal: AbortSignal.timeout(12000),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.ok ? 200 : 502, headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Frank unreachable", reply: "Hey! Our AI is warming up. Hit us at info@manhattanviral.com in the meantime." }), { status: 503, headers: CORS });
  }
}
