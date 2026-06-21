/**
 * Manhattan Viral — Frank Agent Endpoint
 * Proxies inbound messages to the Frank backend (FRANK_BACKEND_URL env var).
 * Deploy on Vercel. Set FRANK_BACKEND_URL to your ngrok/tunnel URL.
 */
export const config = { runtime: "edge" };

/* global process */
const FRANK_URL = process.env.FRANK_BACKEND_URL || "http://127.0.0.1:8001";
const ALLOWED_ORIGINS = [
  "https://www.manhattanviral.com",
  "https://manhattanviral.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Frank-Key",
    "Content-Type": "application/json",
  };
}

export default async function handler(req) {
  const origin = req.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, agent: "frank", site: "manhattanviral.com" }),
      { status: 200, headers }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers,
    });
  }

  const { message, user_id, context } = body;
  if (!message) {
    return new Response(JSON.stringify({ error: "message required" }), {
      status: 400,
      headers,
    });
  }

  try {
    const frankRes = await fetch(`${FRANK_URL}/inbound/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message,
        source: "manhattanviral.com",
        user_id: user_id || "mv_visitor",
        context: context || {},
      }),
      signal: AbortSignal.timeout(12000),
    });

    const data = await frankRes.json();
    return new Response(JSON.stringify(data), {
      status: frankRes.ok ? 200 : 502,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "Frank unreachable", detail: String(err) }),
      { status: 503, headers }
    );
  }
}
