import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { json } from "react-router";

const AGENT_WEBHOOK_TOPICS = {
  frank: [
    "products/create", "products/update", "products/delete",
    "collections/create", "collections/update", "collections/delete",
    "pages/create", "pages/update", "pages/delete",
    "blogs/create", "blogs/update", "blogs/delete",
    "articles/create", "articles/update", "articles/delete",
    "themes/create", "themes/update", "themes/delete",
    "assets/create", "assets/update", "assets/delete",
  ],
  hermes: [
    "orders/create", "orders/update", "orders/paid", "orders/fulfilled", "orders/cancelled", "orders/delete",
    "order_transactions/create",
    "fulfillments/create", "fulfillments/update",
    "refunds/create",
    "customers/create", "customers/update", "customers/delete",
    "inventory_levels/update",
    "inventory_items/create", "inventory_items/update", "inventory_items/delete",
    "locations/create", "locations/update", "locations/delete",
    "discounts/create", "discounts/update", "discounts/delete",
    "price_rules/create", "price_rules/update", "price_rules/delete",
    "shop/update",
    "app_subscriptions/create", "app_subscriptions/update",
  ],
};

async function routeWebhookToAgents(topic: string, payload: any, shop: string) {
  const agents = await prisma.aIAgent.findMany({ where: { isActive: true } });
  
  for (const agent of agents) {
    const topics = AGENT_WEBHOOK_TOPICS[agent.name as keyof typeof AGENT_WEBHOOK_TOPICS] || [];
    if (topics.includes(topic)) {
      await prisma.webhookEvent.create({
        data: {
          agentId: agent.id,
          topic,
          payload: JSON.stringify({ shop, topic, payload, timestamp: new Date().toISOString() }),
        },
      });
    }
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`[Agent Webhook] Received ${topic} for ${shop}`);

  await routeWebhookToAgents(topic, payload, shop);

  return new Response(null, { status: 200 });
};