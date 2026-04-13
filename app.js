(() => {
  "use strict";

  const state = {
    selectedCategory: null,
    search: "",
    cart: [],
    currentProduct: null,
    modalQty: 1,
    heroSlideIndex: 0,
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
    openCartHeroBtn: document.getElementById("openCartHeroBtn"),

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
    modalAddBtn: document.getElementById("modalAddBtn"),

    heroVideo: document.getElementById("heroVideo"),
    promoSlides: document.querySelectorAll(".promo-slide"),
    heroDots: document.querySelectorAll(".hero-dot")
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
    initHeroSlider();
    initHeroVideo();
  }

  function applyConfig() {
    if (els.brandName) els.brandName.textContent = APP_CONFIG.businessName;
    if (els.brandSubtitle) els.brandSubtitle.textContent = APP_CONFIG.subtitle;
    if (els.promoTitle) els.promoTitle.textContent = APP_CONFIG.promoTitle;
    if (els.promoText) els.promoText.textContent = APP_CONFIG.promoText;
  }

  function bindEvents() {
    if (els.searchInput) {
      els.searchInput.addEventListener("input", (e) => {
        state.search = e.target.value.trim().toLowerCase();
        renderProducts();
      });
    }

    if (els.resetCategoryBtn) {
      els.resetCategoryBtn.addEventListener("click", () => {
        state.selectedCategory = null;
        renderCategories();
        renderProducts();
      });
    }

    if (els.bottomCartBar) els.bottomCartBar.addEventListener("click", openDrawer);
    if (els.openCartTopBtn) els.openCartTopBtn.addEventListener("click", openDrawer);
    if (els.openCartHeroBtn) els.openCartHeroBtn.addEventListener("click", openDrawer);
    if (els.closeDrawerBtn) els.closeDrawerBtn.addEventListener("click", closeDrawer);
    if (els.overlay) els.overlay.addEventListener("click", closeDrawer);

    if (els.customerName) els.customerName.addEventListener("input", handleCustomerChange);
    if (els.customerPhone) els.customerPhone.addEventListener("input", handleCustomerChange);
    if (els.customerAddress) els.customerAddress.addEventListener("input", handleCustomerChange);

    if (els.deliveryType) {
      els.deliveryType.addEventListener("change", () => {
        syncCustomer();
        toggleAddress();
        renderCart();
        updatePreview();
      });
    }

    if (els.paymentMethod) {
      els.paymentMethod.addEventListener("change", () => {
        syncCustomer();
        updatePreview();
      });
    }

    if (els.generalNotes) {
      els.generalNotes.addEventListener("input", () => {
        syncCustomer();
        updatePreview();
      });
    }

    if (els.copyBtn) els.copyBtn.addEventListener("click", copyMessage);
    if (els.clearBtn) els.clearBtn.addEventListener("click", clearOrder);
    if (els.sendBtn) els.sendBtn.addEventListener("click", sendWhatsApp);

    if (els.cartItems) {
      els.cartItems.addEventListener("click", handleCartActions);
    }

    if (els.closeModalBtn) els.closeModalBtn.addEventListener("click", closeModal);

    if (els.modalMinusBtn) {
      els.modalMinusBtn.addEventListener("click", () => {
        state.modalQty = Math.max(1, state.modalQty - 1);
        updateModalQty();
      });
    }

    if (els.modalPlusBtn) {
      els.modalPlusBtn.addEventListener("click", () => {
        state.modalQty += 1;
        updateModalQty();
      });
    }

    if (els.modalAddBtn) {
      els.modalAddBtn.addEventListener("click", confirmModalAdd);
    }

    if (els.productModal) {
      els.productModal.addEventListener("click", (event) => {
        if (event.target === els.productModal) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (els.productModal && !els.productModal.classList.contains("hidden")) {
          closeModal();
          return;
        }

        if (els.cartDrawer && els.cartDrawer.classList.contains("open")) {
          closeDrawer();
        }
      }
    });
  }

  function handleCustomerChange() {
    syncCustomer();
    updatePreview();
  }

  function syncCustomer() {
    state.customer.name = els.customerName ? els.customerName.value.trim() : "";
    state.customer.phone = els.customerPhone ? els.customerPhone.value.trim() : "";
    state.customer.address = els.customerAddress ? els.customerAddress.value.trim() : "";
    state.customer.deliveryType = els.deliveryType ? els.deliveryType.value : "delivery";
    state.customer.paymentMethod = els.paymentMethod ? els.paymentMethod.value : "Efectivo";
    state.customer.generalNotes = els.generalNotes ? els.generalNotes.value.trim() : "";
  }

  function toggleAddress() {
    if (!els.customerAddress || !els.deliveryType) return;
    const field = els.customerAddress.closest(".field");
    if (!field) return;
    field.style.display = els.deliveryType.value === "delivery" ? "flex" : "none";
  }

  function renderCategories() {
    if (!els.categoriesGrid) return;

    els.categoriesGrid.innerHTML = CATEGORY_DATA.map((cat) => {
      const active = state.selectedCategory === cat.id ? "active" : "";
      return `
        <button class="category-card ${active}" type="button" data-category="${escapeHtml(cat.id)}">
          <div class="category-icon">${escapeHtml(cat.icon)}</div>
          <h3 class="category-title">${escapeHtml(cat.name)}</h3>
          <p class="category-copy">${escapeHtml(cat.copy)}</p>
        </button>
      `;
    }).join("");

    els.categoriesGrid.querySelectorAll("[data-category]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedCategory = btn.dataset.category;
        renderCategories();
        renderProducts();
        scrollProductsIntoView();
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
        product.badge.toLowerCase().includes(s) ||
        product.options.some((opt) => opt.toLowerCase().includes(s));

      return matchCategory && matchSearch;
    });
  }

  function renderProducts() {
    if (!els.productsGrid) return;

    const filtered = getFilteredProducts();
    const currentCategory = CATEGORY_DATA.find((c) => c.id === state.selectedCategory);

    if (els.productsTitle) {
      els.productsTitle.textContent = currentCategory ? currentCategory.name : "Destacados";
    }

    if (els.productsSubtitle) {
      els.productsSubtitle.textContent = currentCategory
        ? `Opciones disponibles en ${currentCategory.name.toLowerCase()}`
        : "Productos listos para personalizar";
    }

    if (els.resetCategoryBtn) {
      els.resetCategoryBtn.classList.toggle("hidden", !state.selectedCategory);
    }

    if (!filtered.length) {
      els.productsGrid.innerHTML = `
        <div class="empty-products">
          No encontramos productos para esa categoría o búsqueda.
        </div>
      `;
      return;
    }

    els.productsGrid.innerHTML = filtered.map((product) => {
      const categoryName = CATEGORY_DATA.find((c) => c.id === product.category)?.name || "";

      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${escapeHtml(product.name)}">
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

            <div class="product-actions">
              <button class="add-btn" type="button" data-open-product="${escapeHtml(product.id)}">
                Personalizar y agregar
              </button>
              <div class="product-hint">Elegí opción, nota y cantidad</div>
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
    if (!product || !els.productModal) return;

    state.currentProduct = product;
    state.modalQty = 1;

    if (els.modalImage) {
      els.modalImage.src = product.image;
      els.modalImage.alt = product.name;
    }

    if (els.modalBadge) els.modalBadge.textContent = product.badge;
    if (els.modalTitle) els.modalTitle.textContent = product.name;
    if (els.modalDescription) els.modalDescription.textContent = product.description;
    if (els.modalPrice) els.modalPrice.textContent = formatMoney(product.price);

    if (els.modalOption) {
      els.modalOption.innerHTML = product.options
        .map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`)
        .join("");
    }

    if (els.modalNote) {
      els.modalNote.value = "";
      els.modalNote.placeholder = getPlaceholderByCategory(product.category);
    }

    updateModalQty();
    els.productModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!els.productModal) return;
    els.productModal.classList.add("hidden");
    state.currentProduct = null;
    state.modalQty = 1;
    document.body.style.overflow = "";
  }

  function updateModalQty() {
    if (els.modalQtyValue) {
      els.modalQtyValue.textContent = String(state.modalQty);
    }
  }

  function confirmModalAdd() {
    const product = state.currentProduct;
    if (!product) return;

    state.cart.push({
      uid: createId(),
      productId: product.id,
      name: product.name,
      category: product.category,
      option: els.modalOption ? els.modalOption.value : "",
      note: els.modalNote ? els.modalNote.value.trim() : "",
      price: product.price,
      quantity: state.modalQty
    });

    closeModal();
    renderCart();
    updateCounts();
    updatePreview();
    openDrawer();
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
    if (!els.cartItems) return;

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
                <p class="cart-item-name">${escapeHtml(item.name)}</p>
                <p class="cart-item-variant">${escapeHtml(item.option)}</p>
              </div>
              <div class="cart-item-price">${formatMoney(total)}</div>
            </div>

            ${item.note ? `<p class="cart-item-note">📝 ${escapeHtml(item.note)}</p>` : ""}

            <div class="cart-item-actions">
              <div class="qty-group">
                <button class="qty-btn" type="button" data-minus="${escapeHtml(item.uid)}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" type="button" data-plus="${escapeHtml(item.uid)}">+</button>
              </div>
              <button class="remove-btn" type="button" data-remove="${escapeHtml(item.uid)}">Quitar</button>
            </div>
          </div>
        `;
      }).join("");
    }

    const subtotal = getSubtotal();
    const delivery = getDeliveryCost();
    const total = subtotal + delivery;

    if (els.subtotalAmount) els.subtotalAmount.textContent = formatMoney(subtotal);
    if (els.deliveryAmount) els.deliveryAmount.textContent = formatMoney(delivery);
    if (els.totalAmount) els.totalAmount.textContent = formatMoney(total);
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
    if (els.cartCountTop) els.cartCountTop.textContent = count;
    if (els.cartCountBottom) els.cartCountBottom.textContent = count;
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
    if (state.customer.deliveryType === "delivery") {
      text += `📍 *Dirección:* ${state.customer.address || "-"}\n`;
    }
    if (state.customer.generalNotes) {
      text += `📝 *Notas generales:* ${state.customer.generalNotes}\n`;
    }

    return text.trim();
  }

  function updatePreview() {
    if (els.messagePreview) {
      els.messagePreview.value = buildMessage();
    }
  }

  async function copyMessage() {
    if (!state.cart.length) {
      alert("Agregá al menos un producto.");
      return;
    }

    try {
      await navigator.clipboard.writeText(buildMessage());
      alert("Pedido copiado.");
    } catch (error) {
      if (els.messagePreview) {
        els.messagePreview.select();
        document.execCommand("copy");
      }
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

    if (els.customerName) els.customerName.value = "";
    if (els.customerPhone) els.customerPhone.value = "";
    if (els.customerAddress) els.customerAddress.value = "";
    if (els.generalNotes) els.generalNotes.value = "";
    if (els.deliveryType) els.deliveryType.value = "delivery";
    if (els.paymentMethod) els.paymentMethod.value = "Efectivo";

    toggleAddress();
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
    if (els.cartDrawer) els.cartDrawer.classList.add("open");
    if (els.overlay) els.overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (els.cartDrawer) els.cartDrawer.classList.remove("open");
    if (els.overlay) els.overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  function initHeroSlider() {
    if (!els.promoSlides.length) return;

    function showSlide(index) {
      els.promoSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });

      els.heroDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    showSlide(state.heroSlideIndex);

    setInterval(() => {
      state.heroSlideIndex = (state.heroSlideIndex + 1) % els.promoSlides.length;
      showSlide(state.heroSlideIndex);
    }, 3500);
  }

  function initHeroVideo() {
    if (!els.heroVideo) return;

    const tryPlay = () => {
      const promise = els.heroVideo.play();
      if (promise && typeof promise.then === "function") {
        promise.catch(() => {
          // silencio intencional
        });
      }
    };

    els.heroVideo.addEventListener("loadeddata", tryPlay);
    tryPlay();
  }

  function scrollProductsIntoView() {
    if (!els.productsGrid) return;
    els.productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getPlaceholderByCategory(category) {
    const placeholders = {
      burgers: "Ej: sin lechuga, extra cheddar",
      pizzas: "Ej: mitad napo, sin aceitunas",
      milanesas: "Ej: pan árabe, sin tomate",
      empanadas: "Ej: 4 carne, 4 pollo, 4 jamón y queso",
      bebidas: "Ej: bien fría",
      promos: "Ej: cambiar bebida por sin azúcar"
    };

    return placeholders[category] || "Aclaración opcional";
  }

  function formatMoney(value) {
    return `${APP_CONFIG.currency}${Number(value).toLocaleString("es-AR")}`;
  }

  function createId() {
    return `id_${Math.random().toString(36).slice(2, 10)}`;
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