/* ============================================================
   RO · Catálogo de productos
   Datos editables. Reemplaza `image` por una URL real
   (jpg/png/webp) cuando tengas las fotos de cada producto.
   ============================================================ */

const PRODUCTS = [
  { id: "ro-led", brand: "Fototerapia", name: "Máscara LED Facial · 7 Colores", category: "spa", price: 30000, tag: "Estrella ⭐", desc: "Luz LED para rejuvenecer, unificar el tono y combatir el acné desde casa.", image: "assets/img/mascara-led.jpg" },
];

/* Corrige categoría con typo (defensa por si se edita a mano) */
PRODUCTS.forEach(p => { if (p.category === "skincale") p.category = "skincare"; });

/* Paleta de gradientes por categoría para las imágenes generadas */
const CATEGORY_GRADIENT = {
  skincare:     ["#dff0ec", "#a9d3c8"],
  fragancias:   ["#efe2d2", "#c8a36a"],
  cabello:      ["#e6e2dc", "#9b8f7d"],
  maquillaje:   ["#f3dfe4", "#d99cae"],
  cuerpo:       ["#eae4d6", "#cbb98e"],
  dispositivos: ["#e9e4f2", "#b7a9d6"],
};

/* Devuelve la imagen del producto: foto real si tiene `image`,
   o el placeholder SVG generado si no. */
function productMedia(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />`;
  }
  return productImageSVG(product);
}

/* Genera una imagen SVG elegante tipo "botella/frasco" como placeholder.
   Se ve premium sin necesidad de fotos externas. */
function productImageSVG(product) {
  const [c1, c2] = CATEGORY_GRADIENT[product.category] || ["#eee", "#ccc"];
  const initials = product.brand.slice(0, 2).toUpperCase();
  const gid = "g-" + product.id;
  return `
  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#${gid})"/>
    <circle cx="150" cy="135" r="92" fill="rgba(255,255,255,.28)"/>
    <g transform="translate(150 150)">
      <rect x="-34" y="-58" width="68" height="116" rx="16" fill="rgba(255,255,255,.92)"/>
      <rect x="-16" y="-78" width="32" height="26" rx="6" fill="rgba(26,23,20,.85)"/>
      <rect x="-22" y="-6" width="44" height="44" rx="8" fill="${c2}" opacity=".55"/>
      <text x="0" y="22" text-anchor="middle" font-family="Jost, sans-serif" font-size="15" font-weight="600" fill="#1a1714">${initials}</text>
    </g>
  </svg>`;
}

const CATEGORY_LABEL = {
  skincare: "Skincare", fragancias: "Fragancias",
  cabello: "Cabello & Barba", maquillaje: "Maquillaje", cuerpo: "Cuerpo",
  dispositivos: "Dispositivos",
  fitness: "Fitness", "home-deco": "Home & Deco", pets: "Mascotas",
  spa: "Spa y Cuidado Personal", juguetes: "Juguetes",
  lamparas: "Lámparas e Iluminación", tecnologia: "Tecnología",
  bebes: "Accesorios para Bebés", "aire-libre": "Aire Libre",
  moldes: "Moldes de Silicona", escolar: "Escolar",
};
