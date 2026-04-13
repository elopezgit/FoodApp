const APP_CONFIG = {
  businessName: "Food App",
  subtitle: "Tu comida favorita en minutos",
  promoTitle: "Combos, promos y delivery rápido",
  promoText: "Elegí categoría, personalizá tu pedido y envialo por WhatsApp en un toque.",
  whatsappNumber: "5493813159106",
  currency: "$",
  deliveryFee: 1500
};

function makeFoodSvg(bg1, bg2, emoji, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${bg1}" offset="0%"/>
          <stop stop-color="${bg2}" offset="100%"/>
        </linearGradient>
      </defs>
      <rect width="800" height="520" rx="36" fill="url(#g)"/>
      <circle cx="680" cy="110" r="92" fill="rgba(255,255,255,0.18)"/>
      <circle cx="120" cy="420" r="110" fill="rgba(255,255,255,0.12)"/>
      <text x="70" y="180" font-size="120" font-family="Arial, sans-serif">${emoji}</text>
      <text x="70" y="300" fill="#ffffff" font-size="56" font-family="Arial, sans-serif" font-weight="700">${label}</text>
      <text x="70" y="350" fill="rgba(255,255,255,0.82)" font-size="28" font-family="Arial, sans-serif">Food App • Pedido rápido</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const CATEGORY_DATA = [
  {
    id: "burgers",
    name: "Hamburguesas",
    icon: "🍔",
    copy: "Clásicas, dobles y especiales",
    image: makeFoodSvg("#ff8a65", "#ff5a1f", "🍔", "Burgers")
  },
  {
    id: "pizzas",
    name: "Pizzas",
    icon: "🍕",
    copy: "Mozza, napo, fugazza y más",
    image: makeFoodSvg("#f7b267", "#f4845f", "🍕", "Pizzas")
  },
  {
    id: "milanesas",
    name: "Milanesas",
    icon: "🥪",
    copy: "Al plato, sándwiches y especiales",
    image: makeFoodSvg("#84cc16", "#22c55e", "🥪", "Milanesas")
  },
  {
    id: "empanadas",
    name: "Empanadas",
    icon: "🥟",
    copy: "Docenas, medias docenas y sabores",
    image: makeFoodSvg("#fbbf24", "#f59e0b", "🥟", "Empanadas")
  },
  {
    id: "bebidas",
    name: "Bebidas",
    icon: "🥤",
    copy: "Gaseosas, aguas y cervezas",
    image: makeFoodSvg("#60a5fa", "#2563eb", "🥤", "Bebidas")
  },
  {
    id: "promos",
    name: "Promos",
    icon: "🔥",
    copy: "Combos pensados para vender más",
    image: makeFoodSvg("#fb7185", "#e11d48", "🔥", "Promos")
  }
];

const PRODUCTS = [
  {
    id: "burger_clasica",
    category: "burgers",
    name: "Burger Clásica",
    description: "Medallón, queso, lechuga, tomate y salsa especial.",
    price: 6800,
    badge: "Top",
    image: makeFoodSvg("#ffd2c2", "#ff9a76", "🍔", "Clásica"),
    options: ["Normal", "Sin lechuga", "Sin tomate", "Extra cheddar"]
  },
  {
    id: "burger_bacon",
    category: "burgers",
    name: "Burger Bacon",
    description: "Doble cheddar, bacon crocante y mayonesa ahumada.",
    price: 7900,
    badge: "Bacon",
    image: makeFoodSvg("#ffcfb8", "#ff8452", "🥓", "Bacon"),
    options: ["Normal", "Sin cebolla", "Sin bacon", "Extra cheddar"]
  },
  {
    id: "burger_doble",
    category: "burgers",
    name: "Burger Doble Smash",
    description: "Dos medallones smash, cheddar y pepinillos.",
    price: 8600,
    badge: "Doble",
    image: makeFoodSvg("#ffd5c9", "#ff8c69", "🍔", "Doble"),
    options: ["Normal", "Sin pepino", "Sin cebolla", "Extra salsa"]
  },
  {
    id: "pizza_mozza",
    category: "pizzas",
    name: "Pizza Muzzarella",
    description: "Salsa, muzzarella y aceitunas verdes.",
    price: 9200,
    badge: "Clásica",
    image: makeFoodSvg("#ffe3b2", "#ffb84d", "🍕", "Mozza"),
    options: ["Grande", "Muzzarella extra", "Sin aceitunas", "Mitad y mitad"]
  },
  {
    id: "pizza_napo",
    category: "pizzas",
    name: "Pizza Napolitana",
    description: "Muzzarella, tomate fresco, ajo y orégano.",
    price: 9800,
    badge: "Napo",
    image: makeFoodSvg("#ffe0b6", "#ff9d57", "🍅", "Napolitana"),
    options: ["Grande", "Sin ajo", "Extra queso", "Mitad y mitad"]
  },
  {
    id: "pizza_especial",
    category: "pizzas",
    name: "Pizza Especial",
    description: "Jamón, morrones, muzzarella y aceitunas.",
    price: 10600,
    badge: "Especial",
    image: makeFoodSvg("#ffe8bd", "#ffb55f", "🍕", "Especial"),
    options: ["Grande", "Sin morrón", "Extra jamón", "Mitad y mitad"]
  },
  {
    id: "mila_sandwich",
    category: "milanesas",
    name: "Sándwich de Milanesa",
    description: "Milanesa, lechuga, tomate, mayonesa y pan a elección.",
    price: 8400,
    badge: "Tucumana",
    image: makeFoodSvg("#d9f99d", "#65a30d", "🥪", "Mila Sándwich"),
    options: ["Pan francés", "Pan árabe", "Sin lechuga", "Sin tomate"]
  },
  {
    id: "mila_completa",
    category: "milanesas",
    name: "Milanesa Completa",
    description: "Con jamón, queso, huevo frito y papas.",
    price: 9900,
    badge: "Completa",
    image: makeFoodSvg("#dcfce7", "#22c55e", "🍽️", "Completa"),
    options: ["Al plato", "Con puré", "Con papas", "Sin huevo"]
  },
  {
    id: "mila_napo",
    category: "milanesas",
    name: "Milanesa Napolitana",
    description: "Salsa, jamón, queso gratinado y papas.",
    price: 10400,
    badge: "Napo",
    image: makeFoodSvg("#d7f9d1", "#4ade80", "🧀", "Napolitana"),
    options: ["Con papas", "Con puré", "Sin jamón", "Extra queso"]
  },
  {
    id: "empa_docena",
    category: "empanadas",
    name: "Docena de Empanadas",
    description: "Armá la combinación de sabores que quieras.",
    price: 10800,
    badge: "Docena",
    image: makeFoodSvg("#fde68a", "#f59e0b", "🥟", "Docena"),
    options: ["Surtidas", "Carne", "Pollo", "Jamón y queso"]
  },
  {
    id: "empa_media",
    category: "empanadas",
    name: "Media Docena",
    description: "Ideal para combinar sabores a gusto.",
    price: 6200,
    badge: "6u",
    image: makeFoodSvg("#fde68a", "#d97706", "🥟", "Media Docena"),
    options: ["Surtidas", "Carne", "Pollo", "Jamón y queso"]
  },
  {
    id: "empa_arabes",
    category: "empanadas",
    name: "Empanadas Árabes x6",
    description: "Masa abierta con carne especiada y limón.",
    price: 6800,
    badge: "Árabes",
    image: makeFoodSvg("#fef3c7", "#f59e0b", "🍋", "Árabes"),
    options: ["Normales", "Picantes", "Sin cebolla", "Extra limón"]
  },
  {
    id: "bebida_cola",
    category: "bebidas",
    name: "Gaseosa Cola 1.5L",
    description: "Ideal para compartir.",
    price: 3200,
    badge: "Fría",
    image: makeFoodSvg("#bfdbfe", "#3b82f6", "🥤", "Cola"),
    options: ["Regular", "Sin azúcar", "Bien fría"]
  },
  {
    id: "bebida_limon",
    category: "bebidas",
    name: "Gaseosa Lima 1.5L",
    description: "Refrescante, perfecta para combos.",
    price: 3100,
    badge: "Fría",
    image: makeFoodSvg("#bfdbfe", "#2563eb", "🥤", "Lima"),
    options: ["Regular", "Bien fría"]
  },
  {
    id: "bebida_agua",
    category: "bebidas",
    name: "Agua Mineral 500ml",
    description: "Sin gas o con gas, según prefieras.",
    price: 1800,
    badge: "Light",
    image: makeFoodSvg("#dbeafe", "#60a5fa", "💧", "Agua"),
    options: ["Sin gas", "Con gas", "Bien fría"]
  },
  {
    id: "promo_burger",
    category: "promos",
    name: "Combo Burger x2",
    description: "2 burgers clásicas + papas + gaseosa 1.5L.",
    price: 16400,
    badge: "Promo",
    image: makeFoodSvg("#fecdd3", "#fb7185", "🍔", "Combo x2"),
    options: ["Normal", "Sin lechuga", "Sin tomate", "Con cheddar extra"]
  },
  {
    id: "promo_pizza",
    category: "promos",
    name: "Promo Pizza + Gaseosa",
    description: "Pizza grande de muzza + gaseosa 1.5L.",
    price: 11800,
    badge: "Ahorro",
    image: makeFoodSvg("#fecdd3", "#f43f5e", "🍕", "Pizza Combo"),
    options: ["Muzzarella", "Napolitana (+$600)", "Sin aceitunas"]
  },
  {
    id: "promo_mila",
    category: "promos",
    name: "Promo Mila para 2",
    description: "2 sándwiches de milanesa + papas medianas.",
    price: 15300,
    badge: "2 personas",
    image: makeFoodSvg("#fecaca", "#ef4444", "🥪", "Mila x2"),
    options: ["Pan francés", "Pan árabe", "Sin lechuga", "Sin tomate"]
  }
];