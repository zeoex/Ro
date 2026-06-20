/* ============================================================
   RO · Lógica de tienda — render, carrito, checkout
   Persistencia con localStorage.
   ============================================================ */

(function () {
  "use strict";

  const FREE_SHIPPING = 150000;
  const STORE_KEY = "ro_cart_v1";
  const fmt = (n) => "$" + n.toLocaleString("es-CO");

  /* ---------- Estado ---------- */
  let cart = loadCart();

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCart() {
    localStorage.setItem(STORE_KEY, JSON.stringify(cart));
  }
  function getProduct(id) { return PRODUCTS.find((p) => p.id === id); }

  function cartCount() {
    return Object.values(cart).reduce((s, q) => s + q, 0);
  }
  function cartSubtotal() {
    return Object.entries(cart).reduce((s, [id, q]) => {
      const p = getProduct(id);
      return p ? s + p.price * q : s;
    }, 0);
  }

  /* ---------- Render del catálogo ---------- */
  const grid = document.getElementById("productGrid");

  function renderProducts(filter = "todos") {
    const list = filter === "todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

    grid.innerHTML = list.map((p) => `
      <article class="card" data-category="${p.category}">
        <div class="card__media">
          ${productImageSVG(p)}
          ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
        </div>
        <div class="card__body">
          <span class="card__brand">${p.brand}</span>
          <h3 class="card__name">${p.name}</h3>
          <p class="card__desc">${p.desc}</p>
          <div class="card__foot">
            <span class="card__price">${fmt(p.price)}</span>
            <button class="card__add" data-add="${p.id}" aria-label="Añadir ${p.name} al carrito">+</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  /* ---------- Filtros ---------- */
  const filters = document.getElementById("filters");
  filters.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    renderProducts(chip.dataset.filter);
  });

  /* ---------- Añadir al carrito ---------- */
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    addToCart(btn.dataset.add);
  });

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    updateUI();
    const p = getProduct(id);
    showToast(`${p.name} añadido al carrito`);
  }

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    saveCart();
    updateUI();
  }

  /* ---------- Render del carrito ---------- */
  const cartBody = document.getElementById("cartBody");
  const cartBadge = document.getElementById("cartBadge");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const shippingNote = document.getElementById("shippingNote");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function renderCart() {
    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartBody.innerHTML = `
        <div class="cart__empty">
          <span>🛍️</span>
          <p>Tu carrito está vacío.</p>
          <p>¡Descubre nuestra selección!</p>
        </div>`;
      checkoutBtn.disabled = true;
      return;
    }
    checkoutBtn.disabled = false;
    cartBody.innerHTML = ids.map((id) => {
      const p = getProduct(id);
      if (!p) return "";
      const qty = cart[id];
      return `
        <div class="cart-item">
          <div class="cart-item__media">${productImageSVG(p)}</div>
          <div class="cart-item__info">
            <span class="cart-item__brand">${p.brand}</span>
            <p class="cart-item__name">${p.name}</p>
            <p class="cart-item__price">${fmt(p.price)}</p>
            <div class="cart-item__bottom">
              <div class="qty">
                <button data-dec="${id}" aria-label="Quitar uno">−</button>
                <span>${qty}</span>
                <button data-inc="${id}" aria-label="Añadir uno">+</button>
              </div>
              <button class="cart-item__remove" data-remove="${id}">Eliminar</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  cartBody.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc) setQty(inc.dataset.inc, cart[inc.dataset.inc] + 1);
    if (dec) setQty(dec.dataset.dec, cart[dec.dataset.dec] - 1);
    if (rem) setQty(rem.dataset.remove, 0);
  });

  /* ---------- Actualizar toda la UI dependiente del carrito ---------- */
  function updateUI() {
    const count = cartCount();
    const subtotal = cartSubtotal();

    cartBadge.textContent = count;
    cartBadge.hidden = count === 0;

    cartSubtotalEl.textContent = fmt(subtotal);

    if (subtotal >= FREE_SHIPPING || subtotal === 0) {
      shippingNote.textContent = subtotal === 0
        ? "Agrega productos para comenzar."
        : "🎉 ¡Tienes envío gratis!";
      shippingNote.classList.toggle("is-free", subtotal >= FREE_SHIPPING && subtotal > 0);
    } else {
      const falta = FREE_SHIPPING - subtotal;
      shippingNote.textContent = `Te faltan ${fmt(falta)} para el envío gratis.`;
      shippingNote.classList.remove("is-free");
    }
    renderCart();
  }

  /* ---------- Drawer del carrito ---------- */
  const cartEl = document.getElementById("cart");
  const cartOverlay = document.getElementById("cartOverlay");

  function openCart() {
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    cartOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  /* ---------- Menú móvil ---------- */
  const nav = document.getElementById("nav");
  document.getElementById("menuToggle").addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") nav.classList.remove("is-open");
  });

  /* ---------- Checkout ---------- */
  const modal = document.getElementById("checkoutModal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutContent = document.getElementById("checkoutContent");

  function openCheckout() {
    if (cartCount() === 0) return;
    checkoutTotal.textContent = fmt(cartSubtotal());
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCheckout() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  checkoutBtn.addEventListener("click", () => { closeCart(); openCheckout(); });
  document.getElementById("checkoutClose").addEventListener("click", closeCheckout);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeCheckout(); });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const name = form.name.value.trim().split(" ")[0] || "";
    const total = fmt(cartSubtotal());
    // Limpiar carrito tras confirmar
    cart = {};
    saveCart();
    updateUI();
    checkoutContent.innerHTML = `
      <div class="modal__success">
        <span>✅</span>
        <h2>¡Gracias${name ? ", " + name : ""}!</h2>
        <p class="modal__sub">Tu pedido por <strong>${total}</strong> fue recibido.
        Te contactaremos pronto para confirmar el envío y el pago.</p>
        <button class="btn btn--primary" id="successClose">Seguir comprando</button>
      </div>`;
    document.getElementById("successClose").addEventListener("click", closeCheckout);
  });

  /* ---------- Newsletter ---------- */
  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.reset();
    showToast("¡Listo! Revisa tu correo 💌");
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  const toastEl = document.getElementById("toast");
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2400);
  }

  /* ---------- Escape global ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeCheckout();
    else if (cartEl.classList.contains("is-open")) closeCart();
    else if (nav.classList.contains("is-open")) nav.classList.remove("is-open");
  });

  /* ---------- Init ---------- */
  renderProducts();
  updateUI();
})();
