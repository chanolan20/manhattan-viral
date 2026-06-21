/**
 * Manhattan Viral — Frank Webhook Receiver
 * Frank posts content/events here; site can display or react.
 */
export const config = { runtime: "edge" };

/* global process */
const FRANK_URL = process.env.FRANK_BACKEND_URL || "http://127.0.0.1:8001";

export default async function handler(req) {
  const headers = { "Content-Type": "application/json" };

  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, endpoint: "mv-webhook" }), {
      status: 200,
      headers,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
  }

  // Log event to Frank
  try {
    await fetch(`${FRANK_URL}/inbound/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[webhook] ${payload.event || "unknown"}: ${JSON.stringify(payload.data || {})}`,
        source: "mv-webhook",
        user_id: "system",
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // non-blocking
  }

  return new Response(JSON.stringify({ ok: true, received: true }), {
    status: 200,
    headers,
  });
}
