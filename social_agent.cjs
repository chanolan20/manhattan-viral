#!/usr/bin/env node
/* Social Agent for Manhattan Viral
   Generates social media posts for drops.
   Run: node site/social_agent.js
   Frank triggers this when a new product is added or drop goes live.
*/

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.join(__dirname, "catalog.json");

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) return { products: [] };
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
}

const fmt = (cents) => `$${(cents / 100).toFixed(0)}`;

function generatePosts(products) {
  const posts = [];
  const now = Date.now();

  for (const p of products) {
    if (p.type !== "physical" && p.type !== "bundle") continue;

    const name = p.name;
    const price = fmt(p.price_cents);
    const isLimited = p.limited_edition;
    const isUpcoming = p.drop_date && new Date(p.drop_date).getTime() > now;

    if (isUpcoming) {
      const d = new Date(p.drop_date);
      const dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      posts.push({
        platform: "x",
        text: `DROPPING ${dateStr}: ${name} ${price}\n${isLimited ? "Limited to limited units." : ""}\n${p.summary?.slice(0, 100)}\n\nSet reminder: ${p.slug}`,
        product_slug: p.slug,
        type: "announcement",
      });
      posts.push({
        platform: "x",
        text: `${name} ${price} — ${p.summary?.slice(0, 80)}\n\nPreview incoming. Frank + Jules automated drop.`,
        product_slug: p.slug,
        type: "teaser",
        media: "/site/og-image.png",
      });
    } else {
      posts.push({
        platform: "x",
        text: `LIVE NOW: ${name} ${price}\n${isLimited ? "Limited stock remaining." : "In stock."}\n\nShop: ${p.slug}`,
        product_slug: p.slug,
        type: "live",
      });
    }
  }

  return posts;
}

function main() {
  const catalog = loadCatalog();
  const products = catalog.products || [];
  const posts = generatePosts(products);

  const outPath = path.join(__dirname, "..", "memory", "social", "generated_posts.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(posts, null, 2));
  console.log(`Social agent: ${posts.length} posts generated -> ${outPath}`);
}

main();
