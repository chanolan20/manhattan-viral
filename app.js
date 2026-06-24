/* ─── Fluid Canvas Background ─── */
class FluidField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.blobs = [];
    this.frameId = null;
    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", this.resize);
    const palette = [
      { r: 201, g: 169, b: 110 },
      { r: 120, g: 80,  b: 180 },  // purple orb for ethereal glass vibe
      { r: 180, g: 140, b: 90  },
      { r: 80,  g: 40,  b: 140 },
    ];
    for (let i = 0; i < 5; i++) {
      const col = palette[i % palette.length];
      this.blobs.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 180 + Math.random() * 320,
        color: col,
        alpha: 0.03 + Math.random() * 0.04,
      });
    }
    this.tick();
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  tick() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (const b of this.blobs) {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.radius || b.x > this.w + b.radius) b.vx *= -1;
      if (b.y < -b.radius || b.y > this.h + b.radius) b.vy *= -1;
      const grad = this.ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, `rgba(${b.color.r},${b.color.g},${b.color.b},${b.alpha})`);
      grad.addColorStop(0.5, `rgba(${b.color.r},${b.color.g},${b.color.b},${b.alpha * 0.35})`);
      grad.addColorStop(1, `rgba(${b.color.r},${b.color.g},${b.color.b},0)`);
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
    }
    this.frameId = requestAnimationFrame(this.tick);
  }

  destroy() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener("resize", this.resize);
  }
}

/* ─── Cart ─── */
const CART_KEY = "mv_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI(cart);
}

function addToCart(product, size, qty = 1) {
  const cart = getCart();
  const variant = (product.variants || []).find(v => v.size === size);
  if (variant && variant.stock !== undefined && variant.stock < qty) return false;
  const existing = cart.find(i => i.slug === product.slug && i.size === size);
  if (existing) existing.qty += qty;
  else cart.push({ slug: product.slug, name: product.name, size, price_cents: product.price_cents, qty, type: product.type });
  saveCart(cart);
  return true;
}

function removeFromCart(slug, size) {
  saveCart(getCart().filter(i => !(i.slug === slug && i.size === size)));
}

function updateQty(slug, size, qty) {
  if (qty <= 0) { removeFromCart(slug, size); return; }
  const cart = getCart();
  const item = cart.find(i => i.slug === slug && i.size === size);
  if (item) item.qty = qty;
  saveCart(cart);
}

function clearCart() { saveCart([]); }

function cartTotal(cart) {
  return cart.reduce((s, i) => s + i.price_cents * i.qty, 0);
}

function updateCartUI(cart) {
  const count = document.getElementById("cartCount");
  const total = cart.reduce((s, i) => s + i.qty, 0);
  if (count) {
    count.textContent = total;
    count.style.display = total > 0 ? "flex" : "none";
  }
  renderCartPanel();
}

function toggleCart(e) {
  e.stopPropagation();
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  if (!panel) return;
  const open = panel.classList.toggle("open");
  if (overlay) overlay.classList.toggle("open", open);
  document.body.classList.toggle("no-scroll", open);
}

function closeCart() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  if (panel) panel.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function renderCartPanel() {
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const empty = document.getElementById("cartEmpty");
  const actions = document.getElementById("cartActions");
  const cart = getCart();
  if (!list) return;
  list.innerHTML = "";
  if (!cart.length) {
    if (empty) empty.style.display = "block";
    if (actions) actions.style.display = "none";
    if (totalEl) totalEl.textContent = "";
    return;
  }
  if (empty) empty.style.display = "none";
  if (actions) actions.style.display = "flex";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-size">${item.size} &middot; ${fmt(item.price_cents)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="cart-qty-btn" data-slug="${item.slug}" data-size="${item.size}" data-delta="-1">&#x2212;</button>
        <span>${item.qty}</span>
        <button class="cart-qty-btn" data-slug="${item.slug}" data-size="${item.size}" data-delta="1">&#x2B;</button>
      </div>
    `;
    list.appendChild(div);
  });
  if (totalEl) totalEl.textContent = fmt(cartTotal(cart));
  list.querySelectorAll(".cart-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      const size = btn.dataset.size;
      const delta = parseInt(btn.dataset.delta);
      const item = cart.find(i => i.slug === slug && i.size === size);
      if (item) updateQty(slug, size, item.qty + delta);
    });
  });
}

/* ─── Countdown ─── */
function startCountdown(targetDate, key) {
  const el = document.getElementById(key);
  if (!el) return;
  function tick() {
    const diff = targetDate - Date.now();
    if (diff <= 0) { el.textContent = "LIVE NOW"; el.classList.add("live"); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
  }
  tick();
  setInterval(tick, 1000);
}

function addToCalendar(dropDate, title) {
  const d = new Date(dropDate);
  const end = new Date(d.getTime() + 3600000);
  const f = dt => dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(d)}/${f(end)}&details=${encodeURIComponent("Limited drop on Manhattan Viral")}`;
  window.open(url, "_blank");
}

window.addToCalendar = addToCalendar;

/* ─── Helpers ─── */
const APPAREL_CATS = new Set(["hoodies", "tees", "tops", "outerwear", "accessories", "bundles"]);

function loadCatalog() {
  return fetch("/catalog.json", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(`Catalog ${r.status}`); return r.json(); });
}

const fmt = (cents, cur = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 })
    .format((cents || 0) / 100);

function classify(p) {
  if (p.type === "physical" || APPAREL_CATS.has(String(p.category || "").toLowerCase())) return "streetwear";
  return "digital";
}

function labelFor(p) {
  if (p.limited_edition) return "Limited";
  if (p.type === "physical") return "Streetwear";
  return "Digital";
}

function matchesFilter(p, key) {
  if (key === "all") return true;
  if (key === "featured") return Boolean(p.featured);
  if (key === "digital") return classify(p) === "digital";
  if (key === "streetwear") return classify(p) === "streetwear";
  return true;
}

/* ─── Magnetic (delegated) ─── */
let magneticEl = null;
document.addEventListener("mouseover", e => {
  const el = e.target.closest(".magnetic");
  if (el) magneticEl = el;
}, true);
document.addEventListener("mousemove", e => {
  if (!magneticEl) return;
  const rect = magneticEl.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const dist = Math.sqrt(x * x + y * y);
  const strength = Math.max(0, 1 - dist / rect.width) * 10;
  const angle = Math.atan2(y, x);
  magneticEl.style.transform = `translate(${Math.cos(angle) * strength}px, ${Math.sin(angle) * strength}px)`;
});
document.addEventListener("mouseout", e => {
  const el = e.target.closest && e.target.closest(".magnetic");
  if (el) { el.style.transform = ""; magneticEl = null; }
}, true);

/* ─── Scroll reveals ─── */
function initReveals() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.06, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal-section").forEach(s => io.observe(s));
}

/* ─── Nav active highlight ─── */
function initNav() {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`));
      }
    }
  }, { threshold: 0.3 });
  sections.forEach(s => io.observe(s));
}

/* ─── Mobile nav ─── */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("mobileNavOverlay");
  if (!hamburger || !overlay) return;

  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
    overlay.classList.toggle("open", open);
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  });

  // Close on link click
  overlay.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    });
  });
}

/* ─── Size selector ─── */
function renderSizes(variants, selected) {
  const wrap = document.createElement("div");
  wrap.className = "sizes";
  wrap.innerHTML = variants.map(v =>
    `<button class="size-btn${v.size === selected ? " active" : ""}" data-size="${v.size}"${v.stock === 0 ? " disabled" : ""}>${v.size}${v.stock !== undefined && v.stock <= 5 && v.stock > 0 ? `<span class="size-stock-low">${v.stock}</span>` : ""}</button>`
  ).join("");
  return wrap;
}

function stockLabel(variants) {
  const total = variants.reduce((s, v) => s + (v.stock || 0), 0);
  if (total === 0) return '<span class="stock out">Sold out</span>';
  if (total <= 20) return '<span class="stock low">Low stock</span>';
  return '<span class="stock ok">In stock</span>';
}

function calcStock(variants) {
  return variants.reduce((s, v) => s + (v.stock || 0), 0);
}

function stockBar(variants) {
  const total = calcStock(variants);
  const max = Math.max(total, 100);
  return `<div class="stock-bar"><div class="stock-fill" style="width:${Math.min(100, (total / max) * 100)}%"></div></div>`;
}

/* ─── Render product (with double-bezel wrapper) ─── */
function renderProduct(p, tpl) {
  const node = tpl.content.cloneNode(true);
  const art = node.querySelector(".product");

  const tag = art.querySelector(".product-tag");
  tag.textContent = labelFor(p);
  tag.classList.toggle("limited", Boolean(p.limited_edition));
  art.querySelector("h3").textContent = p.name;
  art.querySelector(".product-summary").textContent = p.summary || "";
  art.querySelector(".product-price").textContent = fmt(p.price_cents, p.currency);
  art.querySelector(".product-delivery").textContent = p.delivery || "";
  art.dataset.featured = String(Boolean(p.featured));
  art.dataset.kind = classify(p);

  if (p.type === "physical" && p.variants && p.variants.length) {
    const stockEl = art.querySelector(".product-stock");
    if (stockEl) stockEl.innerHTML = stockBar(p.variants) + stockLabel(p.variants);
  }

  art.addEventListener("click", () => { window.location = "/product/" + p.slug; });

  // Double-bezel outer shell
  const bezel = document.createElement("div");
  bezel.className = "product-bezel";
  bezel.appendChild(art);
  return bezel;
}

function renderGrid(products, tpl, grid) {
  grid.innerHTML = "";
  products.forEach(p => grid.appendChild(renderProduct(p, tpl)));
}

const FILTERS = [
  { key: "all",       label: "All" },
  { key: "featured",  label: "Featured" },
  { key: "digital",   label: "Digital" },
  { key: "streetwear",label: "Streetwear" },
];

function buildFilters(active, onChange) {
  const c = document.querySelector("#filters");
  if (!c) return;
  c.innerHTML = "";
  FILTERS.forEach(f => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter";
    btn.textContent = f.label;
    btn.dataset.active = String(f.key === active);
    btn.addEventListener("click", () => onChange(f.key));
    c.appendChild(btn);
  });
}

/* ─── Marquee duplicate ─── */
function initMarquee() {
  const track = document.querySelector("#marqueeTrack");
  if (!track) return;
  // Already duplicated in HTML — no-op to avoid triple
}
window.initMarquee = initMarquee;

/* ─── Product card tilt (delegated) ─── */
let tiltCard = null;
document.addEventListener("mouseover", e => {
  const card = e.target.closest(".product");
  if (!card || card === tiltCard) return;
  tiltCard = card;
  const move = ev => {
    const r = card.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.005)`;
  };
  const leave = () => { card.style.transform = ""; tiltCard = null; };
  card.addEventListener("mousemove", move);
  card.addEventListener("mouseleave", leave, { once: true });
}, true);

/* ─── Product detail ─── */
function renderProductDetail(product, products) {
  const mainEl = document.querySelector("main");
  const marquee = document.querySelector(".marquee");
  if (marquee) marquee.style.display = "none";

  const related = products.filter(p => p.slug !== product.slug && classify(p) === classify(product)).slice(0, 3);
  const isPhysical = product.type === "physical";
  const catLabel = isPhysical ? "Streetwear" : "Digital";

  document.title = `${product.name} — Manhattan Viral`;
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.content = product.summary || product.name;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc  = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.content = `${product.name} — Manhattan Viral`;
  if (ogDesc)  ogDesc.content  = product.summary || product.name;

  const jsonld = document.createElement("script");
  jsonld.type = "application/ld+json";
  jsonld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.description || product.name,
    offers: {
      "@type": "Offer",
      price: ((product.price_cents || 0) / 100).toFixed(2),
      priceCurrency: product.currency || "USD",
      availability: calcStock(product.variants || []) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  });
  document.head.appendChild(jsonld);

  let countdownKey = "";
  let dropDateStr = "";
  let showCountdown = false;
  if (product.drop_date) {
    const dd = new Date(product.drop_date);
    if (dd.getTime() > Date.now()) {
      const diff = dd.getTime() - Date.now();
      dropDateStr = `Drops in ${Math.floor(diff / 86400000)}d`;
      countdownKey = `cd-${product.slug}`;
      showCountdown = true;
    }
  }

  const tpl = document.getElementById("productCard");
  let selectedSize = "";
  if (isPhysical && product.variants && product.variants.length) {
    selectedSize = product.variants.find(v => v.stock > 0)?.size || product.variants[0]?.size || "";
  }

  mainEl.innerHTML = `
    <a href="/" class="product-detail-back">&larr; Back to catalog</a>
    <div class="product-detail">
      <div class="product-detail-visual">
        <div class="product-detail-blob"></div>
        ${product.limited_edition ? '<div class="limited-badge">Limited edition</div>' : ""}
        ${showCountdown ? `<div class="countdown-block"><span class="countdown-label">Next drop</span><span class="countdown-value" id="${countdownKey}">${dropDateStr}</span></div>` : ""}
      </div>
      <div class="product-detail-info">
        <p class="product-detail-category">${catLabel}</p>
        <h1>${product.name}</h1>
        <p class="product-detail-price">${fmt(product.price_cents, product.currency)}</p>
        ${product.materials ? `<p class="product-detail-materials">${product.materials}</p>` : ""}
        <p class="product-detail-desc">${product.description || product.summary || ""}</p>
        ${isPhysical ? `<div class="product-stock-detail">${stockBar(product.variants || [])} ${stockLabel(product.variants || [])}</div>` : ""}
        <div class="product-detail-meta">
          <div><span>Delivery</span><span>${product.delivery || "Instant"}</span></div>
          <div><span>Category</span><span>${product.category || catLabel}</span></div>
          ${product.max_per_customer ? `<div><span>Max per customer</span><span>${product.max_per_customer}</span></div>` : ""}
          ${product.bonus ? `<div><span>Bonus</span><span>${product.bonus}</span></div>` : ""}
        </div>
        ${isPhysical && product.variants && product.variants.length ? `
          <div class="size-selector">
            <label class="size-label">Size</label>
            ${renderSizes(product.variants, selectedSize).outerHTML}
          </div>
          <div class="product-detail-actions">
            <button class="btn btn-gold add-to-cart-btn" data-slug="${product.slug}">Add to cart</button>
          </div>
        ` : `
          <div class="product-detail-actions">
            <a class="btn btn-gold magnetic" href="${product.stripe_payment_link || `mailto:info@manhattanviral.com?subject=Product%20interest`}" target="_blank" rel="noreferrer">
              ${product.stripe_payment_link ? "Buy now" : "Request link"}
              <span class="btn-arrow">&#x2197;</span>
            </a>
          </div>
        `}
      </div>
    </div>
    ${related.length ? `<section class="related-section"><h2>Related drops</h2><div class="product-grid" id="relatedGrid"></div></section>` : ""}
  `;

  if (showCountdown && product.drop_date) {
    startCountdown(new Date(product.drop_date).getTime(), countdownKey);
  }

  if (isPhysical) {
    mainEl.querySelectorAll(".size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        mainEl.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    const addBtn = mainEl.querySelector(".add-to-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const activeSize = mainEl.querySelector(".size-btn.active");
        if (!activeSize) { alert("Select a size"); return; }
        const slug = addBtn.dataset.slug;
        const prod = products.find(p => p.slug === slug);
        if (!prod) return;
        const size = activeSize.dataset.size;
        const variant = (prod.variants || []).find(v => v.size === size);
        if (variant && variant.stock <= 0) { alert("This size is sold out"); return; }
        if (addToCart(prod, size, 1)) {
          addBtn.textContent = "Added!";
          setTimeout(() => { addBtn.textContent = "Add to cart"; }, 1500);
        }
      });
    }
  }

  if (related.length) {
    const grid = document.getElementById("relatedGrid");
    related.forEach(p => grid.appendChild(renderProduct(p, tpl)));
  }
}

/* ─── Router ─── */
function getRoute() {
  const path = window.location.pathname;
  const m = path.match(/^\/product\/([^/]+)\/?$/);
  if (m) return { type: "product", slug: m[1] };
  if (path === "/press" || path === "/press.html") return { type: "press" };
  return { type: "home" };
}

/* ─── Cart init ─── */
function initCart() {
  const panel = document.getElementById("cartPanel");
  if (!panel) return;
  document.getElementById("cartBtn")?.addEventListener("click", toggleCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartClear")?.addEventListener("click", () => {
    if (confirm("Clear cart?")) clearCart();
  });

  const checkoutBtn = document.getElementById("cartCheckout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (!cart.length) return;
      const subject = encodeURIComponent("Order from Manhattan Viral");
      const body = encodeURIComponent(
        cart.map(i => `${i.name} (${i.size}) x${i.qty} — ${fmt(i.price_cents * i.qty)}`).join("\n") +
        `\n\nTotal: ${fmt(cartTotal(cart))}\n\nPayment instructions to follow.`
      );
      window.location.href = `mailto:info@manhattanviral.com?subject=${subject}&body=${body}`;
    });
  }

  updateCartUI(getCart());
}

/* ─── Main ─── */
async function main() {
  const route = getRoute();
  const catalog = await loadCatalog();
  const products = catalog.products || [];

  if (route.type === "product") {
    new FluidField(document.getElementById("fluidCanvas"));
    const product = products.find(p => p.slug === route.slug);
    if (!product) {
      document.querySelector("main").innerHTML =
        '<p style="text-align:center;padding:140px 0;color:var(--muted)">Product not found.</p>';
      return;
    }
    renderProductDetail(product, products);
    initCart();
    return;
  }

  if (route.type === "press") { initCart(); return; }

  new FluidField(document.getElementById("fluidCanvas"));

  const featured = products.filter(p => p.featured);
  const counts = {
    products: products.length,
    digital:  products.filter(p => classify(p) === "digital").length,
    live:     products.filter(p => !p.drop_date || new Date(p.drop_date).getTime() <= Date.now()).length,
  };

  document.getElementById("productCount").textContent = counts.products;
  document.getElementById("digitalCount").textContent = counts.digital;
  document.getElementById("liveCount").textContent    = counts.live;

  const upcoming = products
    .filter(p => p.drop_date && new Date(p.drop_date).getTime() > Date.now())
    .sort((a, b) => new Date(a.drop_date) - new Date(b.drop_date));

  if (upcoming.length) {
    startCountdown(new Date(upcoming[0].drop_date).getTime(), "heroCountdown");
  } else {
    const el = document.getElementById("heroCountdown");
    if (el) { el.textContent = "SHOP NOW"; el.classList.add("live"); }
  }

  const tpl = document.getElementById("productCard");
  const featuredGrid = document.getElementById("featuredGrid");
  const catalogGrid  = document.getElementById("catalogGrid");

  let state = { filter: "all" };
  const update = () => {
    renderGrid(featured.filter(p => matchesFilter(p, state.filter)).slice(0, 3), tpl, featuredGrid);
    renderGrid(products.filter(p => matchesFilter(p, state.filter)), tpl, catalogGrid);
    buildFilters(state.filter, next => { state.filter = next; update(); });
  };
  update();

  initReveals();
  initNav();
  initMobileNav();
  initCart();
}

main().catch(err => {
  console.error("MV init error:", err);
  const g = document.getElementById("catalogGrid");
  if (g) g.innerHTML = '<p style="color:var(--muted);padding:2rem 0">Catalog unavailable.</p>';
});
