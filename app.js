(() => {
  "use strict";

  const state = {
    selectedCategory: null,
    search: "",
    cart: [],
    currentProduct: null,
    modalQty: 1,
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
    sendBtn: document.getElementById("sendBtn"),
    productModal: document.getElementById("productModal"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    modalImage: document.getElementById("modalImage"),
    modalBadge: document.getElementById("modalBadge"),
    modalTitle: document.getElementById("modalTitle"),
    modalDescription: document.getElementById("modalDescription"),
    modalPrice: document.getElementById("modalPrice"),
    modalOption: document.getElementById("modalOption"),
    modalNote: document.getElementById("modalNote"),
    modalMinusBtn: document.getElementById("modalMinusBtn"),
    modalPlusBtn: document.getElementById("modalPlusBtn"),
    modalQtyValue: document.getElementById("modalQtyValue"),
    modalAddBtn: document.getElementById("modalAddBtn")
  };

  function init() {
    applyConfig();
    bindEvents();
    renderCategories();
    renderProducts();
    renderCart();
    updateCounts();
    updatePreview();
    toggleAddress();
  }

  function applyConfig() {
    els.brandName.textContent = APP_CONFIG.businessName;
    els.brandSubtitle.textContent = APP_CONFIG.subtitle;
    els.promoTitle.textContent = APP_CONFIG.promoTitle;
    els.promoText.textContent = APP_CONFIG.promoText;
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

    els.closeModalBtn.addEventListener("click", closeModal);
    els.modalMinusBtn.addEventListener("click", () => {
      state.modalQty = Math.max(1, state.modalQty - 1);
      updateModalQty();
    });
    els.modalPlusBtn.addEventListener("click", () => {
      state.modalQty += 1;
      updateModalQty();
    });
    els.modalAddBtn.addEventListener("click", confirmModalAdd);
  }

  function syncCustomer() {
    state.customer.name = els.customerName.value.trim();
    state.customer.phone = els.customerPhone.value.trim();
    state.customer.address = els.customerAddress.value.trim();
    state.customer.deliveryType = els.deliveryType.value;
    state.customer.paymentMethod = els.paymentMethod.value;
    state.customer.generalNotes = els.generalNotes.value.trim();
  }

  function toggleAddress() {
    const show = els.deliveryType.value === "delivery";
    els.customerAddress.closest(".field").style.display = show ? "flex" : "none";
  }

  function renderCategories() {
    els.categoriesGrid.innerHTML = CATEGORY_DATA.map((cat) => {
      const active = state.selectedCategory === cat.id ? "active" : "";
      return `
        <button class="category-card ${active}" type="button" data-category="${cat.id}">
          <div class="category-icon">${cat.icon}</div>
          <h3 class="category-title">${cat.name}</h3>
          <p class="category-copy">${cat.copy}</p>
        </button>
      `;
    }).join("");

    els.categoriesGrid.querySelectorAll("[data-category]").forEach((btn) => {
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
      const s = state.search;

      const matchSearch =
        !s ||
        product.name.toLowerCase().includes(s) ||
        product.description.toLowerCase().includes(s) ||
        product.badge.toLowerCase().includes(s);

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
      els.productsGrid.innerHTML = `<div class="empty-products">No encontramos productos para esa categoría.</div>`;
      return;
    }

    els.productsGrid.innerHTML = filtered.map((product) => {
      const categoryName = CATEGORY_DATA.find((c) => c.id === product.category)?.name || "";
      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}">
            <span class="product-tag">${product.badge}</span>
          </div>
          <div class="product-body">
            <div class="product-top">
              <div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
              </div>
              <div class="product-price">${formatMoney(product.price)}</div>
            </div>

            <div class="product-meta">
              <span class="meta-chip">${categoryName}</span>
              <span class="meta-chip">Personalizable</span>
            </div>

            <div class="product-actions">
              <button class="add-btn" type="button" data-open-product="${product.id}">
                Personalizar y agregar
              </button>
              <div class="product-hint">Abrí el producto para elegir opción y nota</div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    els.productsGrid.querySelectorAll("[data-open-product]").forEach((btn) => {
      btn.addEventListener("click", () => openProductModal(btn.dataset.openProduct));
    });
  }

  function openProductModal(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    state.currentProduct = product;
    state.modalQty = 1;

    els.modalImage.src = product.image;
    els.modalImage.alt = product.name;
    els.modalBadge.textContent = product.badge;
    els.modalTitle.textContent = product.name;
    els.modalDescription.textContent = product.description;
    els.modalPrice.textContent = formatMoney(product.price);

    els.modalOption.innerHTML = product.options
      .map((opt) => `<option value="${opt}">${opt}</option>`)
      .join("");

    els.modalNote.value = "";
    updateModalQty();

    els.productModal.classList.remove("hidden");
  }

  function closeModal() {
    els.productModal.classList.add("hidden");
    state.currentProduct = null;
    state.modalQty = 1;
  }

  function updateModalQty() {
    els.modalQtyValue.textContent = String(state.modalQty);
  }

  function confirmModalAdd() {
    const product = state.currentProduct;
    if (!product) return;

    state.cart.push({
      uid: createId(),
      productId: product.id,
      name: product.name,
      category: product.category,
      option: els.modalOption.value,
      note: els.modalNote.value.trim(),
      price: product.price,
      quantity: state.modalQty
    });

    closeModal();
    renderCart();
    updateCounts();
    updatePreview();
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
      state.cart = state.cart.filter((x) => x.uid !== remove.dataset.remove);
      renderCart();
      updateCounts();
      updatePreview();
    }
  }

  function changeQuantity(uid, delta) {
    const item = state.cart.find((x) => x.uid === uid);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
      state.cart = state.cart.filter((x) => x.uid !== uid);
    }

    renderCart();
    updateCounts();
    updatePreview();
  }

  function renderCart() {
    if (!state.cart.length) {
      els.cartItems.innerHTML = `
        <div class="empty-cart">
          Todavía no agregaste productos.<br>
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
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-variant">${item.option}</p>
              </div>
              <div class="cart-item-price">${formatMoney(total)}</div>
            </div>

            ${item.note ? `<p class="cart-item-note">📝 ${item.note}</p>` : ""}

            <div class="cart-item-actions">
              <div class="qty-group">
                <button class="qty-btn" type="button" data-minus="${item.uid}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" type="button" data-plus="${item.uid}">+</button>
              </div>
              <button class="remove-btn" type="button" data-remove="${item.uid}">Quitar</button>
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
        text += `\n• *${item.quantity}x ${item.name}* - ${formatMoney(item.price * item.quantity)}\n`;
        text += `  ▸ Opción: ${item.option}\n`;
        if (item.note) text += `  ▸ Nota: ${item.note}\n`;
      });

      text += `\n💰 *Resumen:*\n`;
      text += `Subtotal: ${formatMoney(subtotal)}\n`;
      text += `Envío: ${formatMoney(delivery)}\n`;
      text += `Total: ${formatMoney(total)}\n`;
    }

    text += `\n🚚 *Entrega:* ${state.customer.deliveryType === "delivery" ? "Delivery" : "Retiro en local"}\n`;
    text += `💳 *Pago:* ${state.customer.paymentMethod}\n`;
    text += `👤 *Nombre:* ${state.customer.name || "-"}\n`;

    if (state.customer.phone) text += `📱 *Teléfono:* ${state.customer.phone}\n`;
    if (state.customer.deliveryType === "delivery") text += `📍 *Dirección:* ${state.customer.address || "-"}\n`;
    if (state.customer.generalNotes) text += `📝 *Notas generales:* ${state.customer.generalNotes}\n`;

    return text.trim();
  }

  function updatePreview() {
    els.messagePreview.value = buildMessage();
  }

  async function copyMessage() {
    if (!state.cart.length) {
      alert("Agregá al menos un producto.");
      return;
    }

    await navigator.clipboard.writeText(buildMessage());
    alert("Pedido copiado.");
  }

  function clearOrder() {
    state.cart = [];
    els.customerName.value = "";
    els.customerPhone.value = "";
    els.customerAddress.value = "";
    els.generalNotes.value = "";
    els.deliveryType.value = "delivery";
    els.paymentMethod.value = "Efectivo";
    syncCustomer();
    renderCart();
    updateCounts();
    updatePreview();
  }

  function sendWhatsApp() {
    syncCustomer();

    if (!state.cart.length) {
      alert("Agregá al menos un producto.");
      return;
    }

    if (!state.customer.name) {
      alert("Completá tu nombre.");
      return;
    }

    if (state.customer.deliveryType === "delivery" && !state.customer.address) {
      alert("Completá la dirección.");
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

  function formatMoney(value) {
    return `${APP_CONFIG.currency}${Number(value).toLocaleString("es-AR")}`;
  }

  function createId() {
    return `id_${Math.random().toString(36).slice(2, 10)}`;
  }

  init();
})();