#!/usr/bin/env node
/* SEO Agent for Manhattan Viral
   Generates: sitemap.xml, robots.txt, JSON-LD for every product, meta descriptions
   Run: node site/seo_agent.js
   Or Frank triggers this before deployments.
*/

const fs = require("fs");
const path = require("path");

const SITE = "https://www.manhattanviral.com";
const CATALOG_PATH = path.join(__dirname, "catalog.json");
const SITEMAP_PATH = path.join(__dirname, "sitemap.xml");
const ROBOTS_PATH = path.join(__dirname, "robots.txt");

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) return { products: [] };
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
}

function generateSitemap(products) {
  const now = new Date().toISOString().split("T")[0];
  const urls = [
    { loc: `${SITE}/`, priority: 1.0, changefreq: "weekly" },
    { loc: `${SITE}/press`, priority: 0.5, changefreq: "monthly" },
    { loc: `${SITE}/rss.xml`, priority: 0.3, changefreq: "daily" },
    ...products.map(p => ({
      loc: `${SITE}/product/${p.slug}`,
      priority: p.featured ? 0.8 : 0.6,
      changefreq: "weekly",
      lastmod: p.updated_at || now,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>`;
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`Sitemap: ${urls.length} URLs -> ${SITEMAP_PATH}`);
}

function generateRobots() {
  const txt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;
  fs.writeFileSync(ROBOTS_PATH, txt);
  console.log(`Robots -> ${ROBOTS_PATH}`);
}

function generateMeta(products) {
  const metaPath = path.join(__dirname, "meta.json");
  const meta = {
    site_name: "Manhattan Viral",
    tagline: "Streetwear by Frank + Jules. Limited drops. Zero hype.",
    description: "Premium streetwear apparel and digital tools, automated by AI agents. Limited drops, physical fulfillment, and autonomous code deployment.",
    keywords: ["streetwear", "limited drops", "AI agents", "Frank", "Jules", "premium apparel", "automation tools"],
    products: products.map(p => ({
      slug: p.slug,
      title: `${p.name} — Manhattan Viral`,
      description: p.summary || p.name,
      keywords: [p.category, p.type, "manhattan viral", "limited drop"].filter(Boolean),
    })),
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`Meta: ${products.length} product entries -> ${metaPath}`);
}

function main() {
  const catalog = loadCatalog();
  const products = catalog.products || [];
  console.log(`SEO Agent: ${products.length} products`);
  generateSitemap(products);
  generateRobots();
  generateMeta(products);
  console.log("SEO agent done.");
}

main();
