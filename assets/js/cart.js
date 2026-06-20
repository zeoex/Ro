/* ============================================================
   RO · Lógica de tienda — render, carrito, checkout
   Persistencia con localStorage.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     ⚙️  CONFIGURA AQUÍ TU WHATSAPP
     Pon tu número con código de país, SIN "+", espacios ni guiones.
     Ejemplos:  Argentina → "549351XXXXXXX"
                Colombia  → "57300XXXXXXX"
                México    → "521XXXXXXXXXX"
     Déjalo vacío ("") y el botón solo avisará que falta configurarlo.
     ============================================================ */
  const WHATSAPP_NUMBER = "5493624009892";

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

  /* ---------- Checkout (formulario + WhatsApp + volver) ---------- */
  function buildWhatsAppMessage(customer) {
    const lines = ["¡Hola RO! 🛍️ Quiero hacer este pedido:", ""];
    Object.entries(cart).forEach(([id, qty]) => {
      const p = getProduct(id);
      if (!p) return;
      lines.push(`• ${qty}x ${p.brand} — ${p.name}  (${fmt(p.price * qty)})`);
    });
    const subtotal = cartSubtotal();
    lines.push("");
    lines.push(`*Total: ${fmt(subtotal)}*`);
    if (subtotal >= FREE_SHIPPING) lines.push("Incluye envío gratis 🎉");
    lines.push("");
    lines.push("*Mis datos:*");
    lines.push(`Nombre: ${customer.name}`);
    lines.push(`Correo: ${customer.email}`);
    lines.push(`Teléfono: ${customer.phone}`);
    lines.push(`Dirección: ${customer.address}`);
    lines.push("");
    lines.push("¿Me confirman disponibilidad y forma de pago? ¡Gracias!");
    return lines.join("\n");
  }

  const modal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const formView = document.getElementById("checkoutFormView");
  const successView = document.getElementById("checkoutSuccessView");

  function openCheckout() {
    if (cartCount() === 0) return;
    checkoutTotal.textContent = fmt(cartSubtotal());
    formView.hidden = false;
    successView.hidden = true;
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

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkoutForm.checkValidity()) { checkoutForm.reportValidity(); return; }

    const customer = {
      name: checkoutForm.name.value.trim(),
      email: checkoutForm.email.value.trim(),
      phone: checkoutForm.phone.value.trim(),
      address: checkoutForm.address.value.trim(),
    };
    const total = fmt(cartSubtotal());

    // Enviar el pedido por WhatsApp (si hay número configurado)
    if (WHATSAPP_NUMBER) {
      const text = encodeURIComponent(buildWhatsAppMessage(customer));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
    }

    // Vaciar carrito y mostrar la vista de éxito
    cart = {};
    saveCart();
    updateUI();
    checkoutForm.reset();

    const firstName = customer.name.split(" ")[0] || "";
    document.getElementById("successTitle").textContent = `¡Gracias${firstName ? ", " + firstName : ""}!`;
    document.getElementById("successMsg").innerHTML =
      `Tu pedido por <strong>${total}</strong> fue enviado. ` +
      (WHATSAPP_NUMBER ? "Revisa WhatsApp para confirmarlo." : "Te contactaremos para confirmarlo.");
    formView.hidden = true;
    successView.hidden = false;
  });

  // "Seguir comprando": cierra y vuelve a la tienda
  document.getElementById("successClose").addEventListener("click", () => {
    closeCheckout();
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
    showToast("¡Gracias por tu compra! 🛍️ Sigue explorando.");
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
