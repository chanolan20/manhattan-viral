import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { json } from "react-router";
import crypto from "node:crypto";

const AI_AGENTS = {
  frank: {
    name: "Frank",
    displayName: "Frank",
    avatar: "🤖",
    color: "#6C5CE7",
    role: "content",
    description: "Content creation, social posting, brand voice, marketing copy",
  },
  hermes: {
    name: "Hermes",
    displayName: "Hermes",
    avatar: "⚡",
    color: "#00B894",
    role: "commerce",
    description: "Commerce operations, orders, inventory, fulfillment, analytics",
  },
};

const VALID_SCOPES = [
  // Read-only for financial resources — never write
  "read_orders",
  "read_discounts",
  "read_draft_orders",
  "read_price_rules",
  "read_shipping",
  "read_gift_cards",
  "read_checkouts",
  "read_returns",
  "read_shopify_payments",
  "read_analytics",
  "read_locales",
  // Read-write for safe resources
  "read_products", "write_products",
  "read_customers", "write_customers",
  "read_fulfillments", "write_fulfillments",
  "read_inventory", "write_inventory",
  "read_locations", "write_locations",
  "read_markets", "write_markets",
  "read_themes", "write_themes",
  "read_content", "write_content",
  "read_assigned_fulfillment_orders", "write_assigned_fulfillment_orders",
  "read_merchant_managed_fulfillment_orders", "write_merchant_managed_fulfillment_orders",
  "read_third_party_fulfillment_orders", "write_third_party_fulfillment_orders",
  "read_translations", "write_translations",
  "read_metaobjects", "write_metaobjects",
  "read_metaobject_definitions", "write_metaobject_definitions",
];

function generateAgentToken(agentName: string): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(32).toString("hex");
  return `mv_${agentName}_${timestamp}_${random}`;
}

function validateScopes(scopes: string): boolean {
  const requested = scopes.split(",").map(s => s.trim()).filter(Boolean);
  return requested.every(s => VALID_SCOPES.includes(s));
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  
  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const agents = await prisma.aIAgent.findMany({
    where: { isActive: true },
    include: { accessLogs: { take: 5, orderBy: { createdAt: "desc" } } },
  });

  return json({ agents });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  
  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const actionType = formData.get("action") as string;

  switch (actionType) {
    case "register": {
      const agentKey = formData.get("agent") as "frank" | "hermes";
      if (!agentKey || !AI_AGENTS[agentKey]) {
        return json({ error: "Invalid agent" }, { status: 400 });
      }

      const agentInfo = AI_AGENTS[agentKey];
      const scopes = formData.get("scopes") as string || VALID_SCOPES.join(",");
      
      if (!validateScopes(scopes)) {
        return json({ error: "Invalid scopes requested" }, { status: 400 });
      }

      const accessToken = generateAgentToken(agentKey);

      const shop = session.shop;

      const agent = await prisma.aIAgent.upsert({
        where: { name: agentKey },
        update: {
          accessToken,
          scopes,
          shop,
          isActive: true,
          displayName: agentInfo.displayName,
          avatar: agentInfo.avatar,
          color: agentInfo.color,
        },
        create: {
          name: agentKey,
          displayName: agentInfo.displayName,
          avatar: agentInfo.avatar,
          color: agentInfo.color,
          accessToken,
          scopes,
          shop,
        },
      });

      await prisma.agentAccessLog.create({
        data: {
          agentId: agent.id,
          action: "register",
          resource: "agent",
          success: true,
        },
      });

      return json({ 
        agent: { 
          name: agent.name, 
          displayName: agent.displayName, 
          avatar: agent.avatar, 
          color: agent.color,
          accessToken: agent.accessToken,
          scopes: agent.scopes,
        } 
      });
    }

    case "revoke": {
      const agentKey = formData.get("agent") as "frank" | "hermes";
      if (!agentKey) {
        return json({ error: "Agent required" }, { status: 400 });
      }

      await prisma.aIAgent.update({
        where: { name: agentKey },
        data: { isActive: false, accessToken: "" },
      });

      await prisma.agentAccessLog.create({
        data: {
          agentId: agentKey,
          action: "revoke",
          resource: "agent",
          success: true,
        },
      });

      return json({ success: true });
    }

    case "grant_resource_access": {
      const agentKey = formData.get("agent") as "frank" | "hermes";
      const resourceId = formData.get("resourceId") as string;
      const resourceType = formData.get("resourceType") as string;
      
      const agent = await prisma.aIAgent.findUnique({ where: { name: agentKey } });
      if (!agent) {
        return json({ error: "Agent not found" }, { status: 404 });
      }

      const accessData = {
        agent: agent.displayName,
        access_level: "full",
        granted_at: new Date().toISOString(),
        scopes: "all",
        status: "active",
      };

      await admin.graphql(
        `#graphql
        mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id key value }
            userErrors { field message }
          }
        }`,
        {
          variables: {
            metafields: [{
              ownerId: resourceId,
              namespace: "mv_admin_bridge",
              key: `${agentKey}_access`,
              type: "json",
              value: JSON.stringify(accessData),
            }],
          },
        }
      );

      await prisma.agentAccessLog.create({
        data: {
          agentId: agent.id,
          action: "grant",
          resource: `${resourceType}/${resourceId}`,
          success: true,
        },
      });

      return json({ success: true });
    }

    case "revoke_resource_access": {
      const agentKey = formData.get("agent") as "frank" | "hermes";
      const resourceId = formData.get("resourceId") as string;
      
      const agent = await prisma.aIAgent.findUnique({ where: { name: agentKey } });
      if (!agent) {
        return json({ error: "Agent not found" }, { status: 404 });
      }

      await admin.graphql(
        `#graphql
        mutation DeleteMetafield($input: MetafieldDeleteInput!) {
          metafieldDelete(input: $input) { deletedId userErrors { field message } }
        }`,
        {
          variables: {
            input: {
              ownerId: resourceId,
              namespace: "mv_admin_bridge",
              key: `${agentKey}_access`,
            },
          },
        }
      );

      await prisma.agentAccessLog.create({
        data: {
          agentId: agent.id,
          action: "revoke",
          resource: resourceId,
          success: true,
        },
      });

      return json({ success: true });
    }

    default:
      return json({ error: "Unknown action" }, { status: 400 });
  }
};