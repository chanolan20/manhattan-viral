/**
 * Cloudflare Pages Function — Webhook receiver for Frank events
 */
const CORS = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method === "GET") return new Response(JSON.stringify({ ok: true, endpoint: "mv-webhook" }), { headers: CORS });

  let payload;
  try { payload = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers: CORS }); }

  // Log to Frank non-blocking
  const frankBase = env.FRANK_BACKEND_URL || "https://frank.manhattanviral.com";
  context.waitUntil(
    fetch(`${frankBase}/inbound/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `[webhook] ${payload.event || "event"}: ${JSON.stringify(payload)}`, source: "mv-webhook", user_id: "system" }),
    }).catch(() => {})
  );

  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
}
