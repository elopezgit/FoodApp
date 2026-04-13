const APP_CONFIG = {
  businessName: "Food App",
  subtitle: "Tu comida favorita en minutos",
  promoTitle: "Promos, combos y delivery rápido",
  promoText: "Elegí categoría, personalizá tu pedido y envialo por WhatsApp en segundos.",
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
      <text x="70" y="180" font-size="120" font-family="Arial, sans-serif">${emoji}</text>
      <text x="70" y="300" fill="#ffffff" font-size="56" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const CATEGORY_DATA = [
  { id: "burgers", name: "Hamburguesas", icon: "🍔", copy: "Clásicas, dobles y especiales" },
  { id: "pizzas", name: "Pizzas", icon: "🍕", copy: "Mozza, napo y especiales" },
  { id: "milanesas", name: "Milanesas", icon: "🥪", copy: "Sándwiches y platos" },
  { id: "empanadas", name: "Empanadas", icon: "🥟", copy: "Docenas, medias docenas y más" },
  { id: "bebidas", name: "Bebidas", icon: "🥤", copy: "Gaseosas, aguas y cervezas" },
  { id: "promos", name: "Promos", icon: "🔥", copy: "Combos pensados para vender más" }
];

const PRODUCTS = [
  {
    id: "burger_clasica",
    category: "burgers",
    name: "Burger Clásica",
    description: "Medallón, queso, lechuga, tomate y salsa especial.",
    price: 6800,
    badge: "Top",
    image: "assets/img/burger_clasica.png",
    options: ["x1 medallon 120g", "x2 medallon 120g", "x3 medallon 120g"]
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
    id: "mila_sandwich",
    category: "milanesas",
    name: "Sándwich de Milanesa",
    description: "Milanesa, lechuga, tomate, mayonesa y pan a elección.",
    price: 8400,
    badge: "Tucumana",
    image: makeFoodSvg("#d9f99d", "#65a30d", "🥪", "Mila"),
    options: ["Pan francés", "Pan árabe", "Sin lechuga", "Sin tomate"]
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
    image: makeFoodSvg("#fde68a", "#d97706", "🥟", "Media"),
    options: ["Surtidas", "Carne", "Pollo", "Jamón y queso"]
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
    id: "bebida_agua",
    category: "bebidas",
    name: "Agua Mineral 500ml",
    description: "Sin gas o con gas.",
    price: 1800,
    badge: "Light",
    image: makeFoodSvg("#dbeafe", "#60a5fa", "💧", "Agua"),
    options: ["Sin gas", "Con gas", "Bien fría"]
  },
  {
    id: "promo_burger_x2",
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
  }
];