(() => {
  "use strict";

  const state = {
    selectedCategory: null,
    search: "",
    cart: [],
    customer: {
      name: "",
      phone: "",
      address: "",
      deliveryType: "delivery",
      paymentMethod: "Efectivo",
      generalNotes: ""
    }
  };

  const els = {
    brandName: document.getElementById("brandName"),
    brandSubtitle: document.getElementById("brandSubtitle"),
    promoTitle: document.getElementById("promoTitle"),
    promoText: document.getElementById("promoText"),
    searchInput: document.getElementById("searchInput"),
    categoriesGrid: document.getElementById("categoriesGrid"),
    productsGrid: document.getElementById("productsGrid"),
    productsTitle: document.getElementById("productsTitle"),
    productsSubtitle: document.getElementById("productsSubtitle"),
    resetCategoryBtn: document.getElementById("resetCategoryBtn"),
    bottomCartBar: document.getElementById("bottomCartBar"),
    openCartTopBtn: document.getElementById("openCartTopBtn"),
    cartCountTop: document.getElementById("cartCountTop"),
    cartCountBottom: document.getElementById("cartCountBottom"),
    overlay: document.getElementById("overlay"),
    cartDrawer: document.getElementById("cartDrawer"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),
    cartItems: document.getElementById("cartItems"),
    subtotalAmount: document.getElementById("subtotalAmount"),
    deliveryAmount: document.getElementById("deliveryAmount"),
    totalAmount: document.getElementById("totalAmount"),
    customerName: document.getElementById("customerName"),
    customerPhone: document.getElementById("customerPhone"),
    customerAddress: document.getElementById("customerAddress"),
    deliveryType: document.getElementById("deliveryType"),
    paymentMethod: document.getElementById("paymentMethod"),
    generalNotes: document.getElementById("generalNotes"),
    messagePreview: document.getElementById("messagePreview"),
    copyBtn: document.getElementById("copyBtn"),
    clearBtn: document.getElementById("clearBtn"),
    sendBtn: document.getElementById("sendBtn")
  };

  function init() {
    loadFromStorage();
    applyConfig();
    bindEvents();
    renderCategories();
    renderProducts();
    renderCart();
    updatePreview();
    updateCounts();
    toggleAddress();
  }

  function applyConfig() {
    els.brandName.textContent = APP_CONFIG.businessName;
    els.brandSubtitle.textContent = APP_CONFIG.subtitle;
    els.promoTitle.textContent = APP_CONFIG.promoTitle;
    els.promoText.textContent = APP_CONFIG.promoText;

    els.customerName.value = state.customer.name;
    els.customerPhone.value = state.customer.phone;
    els.customerAddress.value = state.customer.address;
    els.deliveryType.value = state.customer.deliveryType;
    els.paymentMethod.value = state.customer.paymentMethod;
    els.generalNotes.value = state.customer.generalNotes;
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderProducts();
    });

    els.resetCategoryBtn.addEventListener("click", () => {
      state.selectedCategory = null;
      renderCategories();
      renderProducts();
    });

    els.bottomCartBar.addEventListener("click", openDrawer);
    els.openCartTopBtn.addEventListener("click", openDrawer);
    els.closeDrawerBtn.addEventListener("click", closeDrawer);
    els.overlay.addEventListener("click", closeDrawer);

    els.customerName.addEventListener("input", syncCustomer);
    els.customerPhone.addEventListener("input", syncCustomer);
    els.customerAddress.addEventListener("input", syncCustomer);
    els.deliveryType.addEventListener("change", () => {
      syncCustomer();
      toggleAddress();
      renderCart();
      updatePreview();
    });
    els.paymentMethod.addEventListener("change", () => {
      syncCustomer();
      updatePreview();
    });
    els.generalNotes.addEventListener("input", () => {
      syncCustomer();
      updatePreview();
    });

    els.copyBtn.addEventListener("click", copyMessage);
    els.clearBtn.addEventListener("click", clearOrder);
    els.sendBtn.addEventListener("click", sendWhatsApp);

    els.cartItems.addEventListener("click", handleCartActions);
  }

  function syncCustomer() {
    state.customer.name = els.customerName.value.trim();
    state.customer.phone = els.customerPhone.value.trim();
    state.customer.address = els.customerAddress.value.trim();
    state.customer.deliveryType = els.deliveryType.value;
    state.customer.paymentMethod = els.paymentMethod.value;
    state.customer.generalNotes = els.generalNotes.value.trim();
    saveToStorage();
  }

  function toggleAddress() {
    const delivery = els.deliveryType.value === "delivery";
    els.customerAddress.closest(".field").style.display = delivery ? "flex" : "none";
  }

  function renderCategories() {
    els.categoriesGrid.innerHTML = CATEGORY_DATA.map((cat) => {
      const active = state.selectedCategory === cat.id ? "active" : "";
      return `
        <button class="category-card ${active}" type="button" data-category="${cat.id}">
          <div class="category-icon">${cat.icon}</div>
          <h3 class="category-title">${escapeHtml(cat.name)}</h3>
          <p class="category-copy">${escapeHtml(cat.copy)}</p>
        </button>
      `;
    }).join("");

    [...els.categoriesGrid.querySelectorAll("[data-category]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedCategory = btn.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  function getFilteredProducts() {
    return PRODUCTS.filter((product) => {
      const matchCategory = !state.selectedCategory || product.category === state.selectedCategory;

      const search = state.search;
      const matchSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.badge.toLowerCase().includes(search) ||
        CATEGORY_DATA.find((c) => c.id === product.category)?.name.toLowerCase().includes(search);

      return matchCategory && matchSearch;
    });
  }

  function renderProducts() {
    const filtered = getFilteredProducts();

    const currentCategory = CATEGORY_DATA.find((c) => c.id === state.selectedCategory);
    els.productsTitle.textContent = currentCategory ? currentCategory.name : "Destacados";
    els.productsSubtitle.textContent = currentCategory
      ? `Opciones disponibles en ${currentCategory.name.toLowerCase()}`
      : "Productos listos para personalizar";

    els.resetCategoryBtn.classList.toggle("hidden", !state.selectedCategory);

    if (!filtered.length) {
      els.productsGrid.innerHTML = `
        <div class="empty-products">
          No encontramos productos para esa búsqueda.
        </div>
      `;
      return;
    }

    els.productsGrid.innerHTML = filtered.map((product) => {
      const categoryName = CATEGORY_DATA.find((c) => c.id === product.category)?.name || "";
      const optionList = product.options.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join("");

      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" />
            <span class="product-tag">${escapeHtml(product.badge)}</span>
          </div>

          <div class="product-body">
            <div class="product-top">
              <div>
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-desc">${escapeHtml(product.description)}</p>
              </div>
              <div class="product-price">${formatMoney(product.price)}</div>
            </div>

            <div class="product-meta">
              <span class="meta-chip">${escapeHtml(categoryName)}</span>
              <span class="meta-chip">Personalizable</span>
            </div>

            <div class="option-row">
              <div class="field-inline">
                <label>Elegí una opción</label>
                <select class="product-select" data-product-option="${product.id}">
                  ${optionList}
                </select>
              </div>

              <div class="field-inline">
                <label>Nota del producto</label>
                <input
                  class="product-note"
                  type="text"
                  data-product-note="${product.id}"
                  placeholder="${getPlaceholderByCategory(product.category)}"
                />
              </div>
            </div>

            <div class="product-actions">
              <button class="add-btn" type="button" data-add-product="${product.id}">
                + Agregar al pedido
              </button>
              <div class="product-hint">Editable después</div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    [...els.productsGrid.querySelectorAll("[data-add-product]")].forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.addProduct));
    });
  }

  function getPlaceholderByCategory(category) {
    const map = {
      burgers: "Ej: sin lechuga, extra cheddar",
      pizzas: "Ej: mitad napo, sin aceitunas",
      milanesas: "Ej: pan árabe, sin tomate",
      empanadas: "Ej: 4 carne y 8 jamón y queso",
      bebidas: "Ej: bien fría",
      promos: "Ej: cambiar bebida por sin azúcar"
    };

    return map[category] || "Aclaración opcional";
  }

  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const optionEl = els.productsGrid.querySelector(`[data-product-option="${productId}"]`);
    const noteEl = els.productsGrid.querySelector(`[data-product-note="${productId}"]`);

    const option = optionEl ? optionEl.value : "";
    const note = noteEl ? noteEl.value.trim() : "";

    const existing = state.cart.find(
      (item) => item.productId === productId && item.option === option && item.note === note
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        uid: cryptoLikeId(),
        productId: product.id,
        name: product.name,
        category: product.category,
        option,
        note,
        price: product.price,
        quantity: 1
      });
    }

    if (noteEl) noteEl.value = "";

    saveToStorage();
    renderCart();
    updatePreview();
    updateCounts();
  }

  function handleCartActions(event) {
    const minus = event.target.closest("[data-minus]");
    const plus = event.target.closest("[data-plus]");
    const remove = event.target.closest("[data-remove]");

    if (minus) {
      changeQuantity(minus.dataset.minus, -1);
      return;
    }

    if (plus) {
      changeQuantity(plus.dataset.plus, 1);
      return;
    }

    if (remove) {
      removeItem(remove.dataset.remove);
    }
  }

  function changeQuantity(uid, delta) {
    const item = state.cart.find((x) => x.uid === uid);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
      state.cart = state.cart.filter((x) => x.uid !== uid);
    }

    saveToStorage();
    renderCart();
    updatePreview();
    updateCounts();
  }

  function removeItem(uid) {
    state.cart = state.cart.filter((x) => x.uid !== uid);
    saveToStorage();
    renderCart();
    updatePreview();
    updateCounts();
  }

  function renderCart() {
    if (!state.cart.length) {
      els.cartItems.innerHTML = `
        <div class="empty-cart">
          Todavía no agregaste productos.<br />
          Elegí una categoría y sumá algo rico al pedido.
        </div>
      `;
    } else {
      els.cartItems.innerHTML = state.cart.map((item) => {
        const total = item.price * item.quantity;

        return `
          <div class="cart-item">
            <div class="cart-item-top">
              <div>
                <p class="cart-item-name">${escapeHtml(item.name)}</p>
                <p class="cart-item-variant">${escapeHtml(item.option)}</p>
              </div>
              <div class="cart-item-price">${formatMoney(total)}</div>
            </div>

            ${item.note ? `<p class="cart-item-note">📝 ${escapeHtml(item.note)}</p>` : ""}

            <div class="cart-item-actions">
              <div class="qty-group">
                <button class="qty-btn" type="button" data-minus="${item.uid}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" type="button" data-plus="${item.uid}">+</button>
              </div>

              <button class="remove-btn" type="button" data-remove="${item.uid}">
                Quitar
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    const subtotal = getSubtotal();
    const delivery = getDeliveryCost();
    const total = subtotal + delivery;

    els.subtotalAmount.textContent = formatMoney(subtotal);
    els.deliveryAmount.textContent = formatMoney(delivery);
    els.totalAmount.textContent = formatMoney(total);
  }

  function getSubtotal() {
    return state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  function getDeliveryCost() {
    return state.customer.deliveryType === "delivery" && state.cart.length
      ? APP_CONFIG.deliveryFee
      : 0;
  }

  function updateCounts() {
    const count = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    els.cartCountTop.textContent = count;
    els.cartCountBottom.textContent = count;
  }

  function updatePreview() {
    els.messagePreview.value = buildMessage();
  }

  function buildMessage() {
    const subtotal = getSubtotal();
    const delivery = getDeliveryCost();
    const total = subtotal + delivery;

    let text = `🍔 *Pedido - ${APP_CONFIG.businessName}*\n\n`;

    if (!state.cart.length) {
      text += `Todavía no agregué productos.\n`;
    } else {
      text += `📋 *Detalle del pedido:*\n`;

      state.cart.forEach((item) => {
        const lineTotal = item.price * item.quantity;
        text += `\n• *${item.quantity}x ${item.name}* - ${formatMoney(lineTotal)}`;
        if (item.option) text += `\n  ▸ Opción: ${item.option}`;
        if (item.note) text += `\n  ▸ Nota: ${item.note}`;
        text += `\n`;
      });

      text += `\n💰 *Resumen:*\n`;
      text += `Subtotal: ${formatMoney(subtotal)}\n`;
      text += `Envío: ${formatMoney(delivery)}\n`;
      text += `Total: ${formatMoney(total)}\n`;
    }

    text += `\n🚚 *Entrega:* ${state.customer.deliveryType === "delivery" ? "Delivery" : "Retiro en local"}\n`;
    text += `💳 *Pago:* ${state.customer.paymentMethod || "-"}\n`;
    text += `👤 *Nombre:* ${state.customer.name || "-"}\n`;

    if (state.customer.phone) {
      text += `📱 *Teléfono:* ${state.customer.phone}\n`;
    }

    if (state.customer.deliveryType === "delivery") {
      text += `📍 *Dirección:* ${state.customer.address || "-"}\n`;
    }

    if (state.customer.generalNotes) {
      text += `📝 *Notas generales:* ${state.customer.generalNotes}\n`;
    }

    return text.trim();
  }

  async function copyMessage() {
    if (!state.cart.length) {
      alert("Agregá al menos un producto antes de copiar el pedido.");
      return;
    }

    try {
      await navigator.clipboard.writeText(buildMessage());
      alert("Pedido copiado.");
    } catch {
      els.messagePreview.select();
      document.execCommand("copy");
      alert("Pedido copiado.");
    }
  }

  function clearOrder() {
    state.cart = [];
    state.customer = {
      name: "",
      phone: "",
      address: "",
      deliveryType: "delivery",
      paymentMethod: "Efectivo",
      generalNotes: ""
    };

    els.customerName.value = "";
    els.customerPhone.value = "";
    els.customerAddress.value = "";
    els.deliveryType.value = "delivery";
    els.paymentMethod.value = "Efectivo";
    els.generalNotes.value = "";

    saveToStorage();
    toggleAddress();
    renderCart();
    updatePreview();
    updateCounts();
  }

  function sendWhatsApp() {
    if (!state.cart.length) {
      alert("Agregá al menos un producto.");
      return;
    }

    if (!state.customer.name) {
      alert("Completá tu nombre.");
      return;
    }

    if (state.customer.deliveryType === "delivery" && !state.customer.address) {
      alert("Completá la dirección para el delivery.");
      return;
    }

    const url = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank");
  }

  function openDrawer() {
    els.cartDrawer.classList.add("open");
    els.overlay.classList.add("show");
  }

  function closeDrawer() {
    els.cartDrawer.classList.remove("open");
    els.overlay.classList.remove("show");
  }

  function saveToStorage() {
    localStorage.setItem("food_app_state_v1", JSON.stringify(state));
  }

  function loadFromStorage() {
    const raw = localStorage.getItem("food_app_state_v1");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.selectedCategory = parsed.selectedCategory ?? null;
        state.search = parsed.search ?? "";
        state.cart = Array.isArray(parsed.cart) ? parsed.cart : [];
        state.customer = { ...state.customer, ...(parsed.customer || {}) };
      }
    } catch {
      // ignore
    }
  }

  function formatMoney(value) {
    return `${APP_CONFIG.currency}${Number(value).toLocaleString("es-AR")}`;
  }

  function cryptoLikeId() {
    return `id_${Math.random().toString(36).slice(2, 11)}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  init();
})();