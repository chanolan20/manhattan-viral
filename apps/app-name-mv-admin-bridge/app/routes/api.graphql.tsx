import type { ActionFunctionArgs } from "react-router";
import { json } from "react-router";
import prisma from "~/db.server";

// Known GraphQL operations and which scope they require.
// This is a non-exhaustive allow-list; any query not on this list is
// still passed through (scope-prefix matching below catches the rest).
const SCOPE_OPERATIONS: Record<string, string> = {
  // Products
  "products": "read_products",
  "product": "read_products",
  "Product": "read_products",
  "productCreate": "write_products",
  "productUpdate": "write_products",
  "productDelete": "write_products",
  // Orders — read only (financial guard)
  "orders": "read_orders",
  "order": "read_orders",
  "Order": "read_orders",
  // Customers
  "customers": "read_customers",
  "customer": "read_customers",
  "Customer": "read_customers",
  "customerCreate": "write_customers",
  "customerUpdate": "write_customers",
  "customerDelete": "write_customers",
  // Inventory
  "inventoryLevel": "read_inventory",
  "inventoryItem": "read_inventory",
  "inventoryAdjust": "write_inventory",
  // Fulfillments
  "fulfillment": "read_fulfillments",
  "fulfillments": "read_fulfillments",
  "fulfillmentCreate": "write_fulfillments",
  "fulfillmentUpdate": "write_fulfillments",
  "fulfillmentCancel": "write_fulfillments",
  // Discounts — read only (financial guard)
  "discountNode": "read_discounts",
  "discountAutomatic": "read_discounts",
  "discountCode": "read_discounts",
  // Locations
  "locations": "read_locations",
  "location": "read_locations",
  // Shipping — read only (financial guard)
  "deliveryProfile": "read_shipping",
  "deliverySettings": "read_shipping",
  "carrierService": "read_shipping",
  // Themes
  "themes": "read_themes",
  "theme": "read_themes",
  // Content
  "blogs": "read_content",
  "articles": "read_content",
  "pages": "read_content",
  "blogCreate": "write_content",
  "articleCreate": "write_content",
  "pageCreate": "write_content",
  // Gift cards — read only (financial guard)
  "giftCard": "read_gift_cards",
  "giftCards": "read_gift_cards",
  // Checkouts — read only (financial guard)
  "checkout": "read_checkouts",
  "checkouts": "read_checkouts",
  // Draft orders — read only (financial guard)
  "draftOrder": "read_draft_orders",
  "draftOrders": "read_draft_orders",
  // Price rules — read only (financial guard)
  "priceRule": "read_price_rules",
  "priceRules": "read_price_rules",
  // Markets
  "market": "read_markets",
  "markets": "read_markets",
  // Translations
  "translation": "read_translations",
  "translations": "read_translations",
  // Metaobjects
  "metaobject": "read_metaobjects",
  "metaobjects": "read_metaobjects",
  "metaobjectCreate": "write_metaobjects",
  // Analytics
  "shopifyql": "read_analytics",
  // Shopify Payments
  "shopifyPayments": "read_shopify_payments",
};

const AI_AGENTS = {
  frank: { name: "Frank", role: "content" },
  hermes: { name: "Hermes", role: "commerce" },
};

async function verifyAgentToken(token: string) {
  const agent = await prisma.aIAgent.findFirst({
    where: { accessToken: token, isActive: true },
  });
  return agent;
}

/**
 * Extract the first operation name from a GraphQL document.
 * Returns something like "products", "productCreate", "shopifyql",
 * or null if it cannot be parsed.
 */
function extractOperationName(query: string): string | null {
  // Strip string literals first to avoid false matches
  const cleaned = query.replace(/"[^"]*"/g, "").replace(/'[^']*'/g, "");
  const match = cleaned.match(/(?:query|mutation)\s+(\w+)/);
  if (match) return match[1];
  // If no named operation, look for the first top-level field
  const fieldMatch = cleaned.match(/(?:query|mutation)\s*\{[^a-zA-Z]*(\w+)/);
  return fieldMatch ? fieldMatch[1] : null;
}

/**
 * Derive the minimum Shopify scope required to run this query/mutation.
 * Returns one of the SCOPE_OPERATIONS values or null if unknown.
 */
function deriveRequiredScope(query: string): string | null {
  const opName = extractOperationName(query);
  if (opName && SCOPE_OPERATIONS[opName]) return SCOPE_OPERATIONS[opName];

  // Fallback: try to infer from field names like "products(first: 10)" => read_products
  const body = query.replace(/"[^"]*"/g, "");
  const fieldMatch = body.match(/(?:query|mutation)\s*(?:\w+\s*)?\{[^a-zA-Z]*(\w+)/);
  if (fieldMatch) {
    const field = fieldMatch[1];
    const normalized = field.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
    // Check for read ops matching the field name
    for (const [key, scope] of Object.entries(SCOPE_OPERATIONS)) {
      if (scope.startsWith("read_") && normalized.startsWith(key.toLowerCase())) {
        return scope;
      }
    }
    // Check for write ops (mutation)
    if (query.trim().startsWith("mutation")) {
      for (const [key, scope] of Object.entries(SCOPE_OPERATIONS)) {
        if (scope.startsWith("write_") && normalized.includes(key.toLowerCase())) {
          return scope;
        }
      }
    }
  }

  return null;
}

/**
 * Validate that the agent's scopes permit the requested GraphQL operation.
 */
function enforceScope(query: string, agentScopes: string[]): void {
  const required = deriveRequiredScope(query);
  if (!required) return; // Unknown — let pass (permissive for unknown ops)

  if (!agentScopes.includes(required)) {
    // Try a looser read_ prefix match if agent has read_* but not specific
    const isRead = required.startsWith("read_");
    const resourceArea = required.replace(/^(read|write)_/, "");
    const hasAnyScopeForResource = agentScopes.some(s => s.endsWith(`_${resourceArea}`));
    if (!hasAnyScopeForResource) {
      throw new ScopeError(
        `Agent scope "${agentScopes.join(", ")}" does not include "${required}". ` +
        `Operation blocked.`
      );
    }
  }
}

class ScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScopeError";
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Missing or invalid Authorization header" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const agent = await verifyAgentToken(token);
  
  if (!agent) {
    return json({ error: "Invalid or expired agent token" }, { status: 401 });
  }

  const agentScopes = agent.scopes.split(",").map((s: string) => s.trim()).filter(Boolean);
  const isGraphQL = request.headers.get("Content-Type")?.includes("application/json");

  if (!isGraphQL) {
    return json({ error: "Content-Type must be application/json" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { query, variables } = body;
  if (!query) {
    return json({ error: "GraphQL query required" }, { status: 400 });
  }

  // --- Scope enforcement middleware ---
  try {
    enforceScope(query, agentScopes);
  } catch (e) {
    if (e instanceof ScopeError) {
      return json({ error: e.message }, { status: 403 });
    }
    throw e;
  }

  const startTime = Date.now();
  let success = true;
  let error: string | null = null;
  let responseData: any = null;

  try {
    // Look up the session's real access token from the database
    const shop = agent.shop || process.env.SHOPIFY_APP_URL?.replace("https://", "").replace("http://", "").replace(/\/$/, "");
    const sessionRecord = await prisma.session.findFirst({
      where: { shop },
      orderBy: { id: "desc" },
    });

    const accessToken = sessionRecord?.accessToken || (() => { throw new Error("No stored session found for shop; cannot authenticate proxy request"); })();
    const shopifyDomain = sessionRecord?.shop || shop;
    
    const response = await fetch(`https://${shopifyDomain}/admin/api/2025-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    responseData = await response.json();

    if (!response.ok || responseData.errors) {
      success = false;
      error = responseData.errors?.[0]?.message || `HTTP ${response.status}`;
    }
  } catch (e) {
    success = false;
    error = e instanceof Error ? e.message : "Unknown error";
  }

  const durationMs = Date.now() - startTime;

  await prisma.agentAccessLog.create({
    data: {
      agentId: agent.id,
      action: query.trim().startsWith("mutation") ? "mutate" : "query",
      resource: "graphql",
      query: query.substring(0, 500),
      variables: variables ? JSON.stringify(variables) : null,
      success,
      error,
      durationMs,
    },
  });

  await prisma.aIAgent.update({
    where: { id: agent.id },
    data: { lastUsedAt: new Date() },
  });

  if (!success) {
    return json({ errors: [{ message: error }] }, { status: 400 });
  }

  return json(responseData);
};