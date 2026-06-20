/* ============================================================
   RO · Catálogo de productos
   Datos editables. Reemplaza `image` por una URL real
   (jpg/png/webp) cuando tengas las fotos de cada producto.
   ============================================================ */

const PRODUCTS = [
  { id: "ro-01", brand: "The Ordinary", name: "Sérum Vitamina C Suspension 23%", category: "skincare", price: 24900, tag: "Best seller", desc: "Ilumina y unifica el tono de la piel." },
  { id: "ro-02", brand: "CeraVe", name: "Crema Hidratante Facial", category: "skincare", price: 32500, tag: null, desc: "Hidratación 24h con ácido hialurónico." },
  { id: "ro-03", brand: "La Roche-Posay", name: "Anthelios Protector SPF 50+", category: "skincare", price: 45000, tag: "Top", desc: "Protección solar de alta resistencia." },
  { id: "ro-04", brand: "Dior", name: "Sauvage Eau de Parfum 100ml", category: "fragancias", price: 189000, tag: "Premium", desc: "Frescura amaderada, presencia magnética." },
  { id: "ro-05", brand: "Laneige", name: "Lip Sleeping Mask", category: "skincare", price: 18900, tag: null, desc: "Bálsamo nocturno de reparación labial." },
  { id: "ro-06", brand: "Innisfree", name: "Mascarilla de Arcilla Volcánica", category: "skincare", price: 21000, tag: null, desc: "Purifica poros y controla el brillo." },
  { id: "ro-07", brand: "Kiehl's", name: "Aceite Nutritivo Barba & Cabello", category: "cabello", price: 54000, tag: null, desc: "Suaviza, hidrata y da brillo natural." },
  { id: "ro-08", brand: "Bioderma", name: "Sensibio Agua Micelar 500ml", category: "skincare", price: 29900, tag: "Best seller", desc: "Desmaquilla y calma pieles sensibles." },
  { id: "ro-09", brand: "Clinique", name: "All About Eyes Contorno", category: "skincare", price: 48500, tag: null, desc: "Reduce ojeras y bolsas visiblemente." },
  { id: "ro-10", brand: "Frank Body", name: "Exfoliante Corporal de Café", category: "cuerpo", price: 26000, tag: null, desc: "Piel suave y renovada con cafeína." },
  { id: "ro-11", brand: "The Ordinary", name: "Niacinamida 10% + Zinc 1%", category: "skincale", price: 19900, tag: "Best seller", desc: "Controla grasa y minimiza poros." },
  { id: "ro-12", brand: "Real Techniques", name: "Set de Brochas Everyday", category: "maquillaje", price: 39900, tag: null, desc: "5 brochas esenciales para tu rutina." },
  { id: "ro-13", brand: "Maybelline", name: "Máscara de Pestañas Sky High", category: "maquillaje", price: 22500, tag: "Top", desc: "Volumen y longitud extrema." },
  { id: "ro-14", brand: "Nivea", name: "Bálsamo Hidratante Corporal", category: "cuerpo", price: 17500, tag: null, desc: "Nutrición profunda para todo el cuerpo." },
  { id: "ro-15", brand: "Versace", name: "Eros Eau de Toilette 100ml", category: "fragancias", price: 165000, tag: "Premium", desc: "Fragancia intensa, fresca y seductora." },
  { id: "ro-16", brand: "American Crew", name: "Pomada Fijación Fuerte", category: "cabello", price: 31000, tag: null, desc: "Peinado con control y acabado mate." },
];

/* Corrige categoría con typo (defensa por si se edita a mano) */
PRODUCTS.forEach(p => { if (p.category === "skincale") p.category = "skincare"; });

/* Paleta de gradientes por categoría para las imágenes generadas */
const CATEGORY_GRADIENT = {
  skincare:   ["#dff0ec", "#a9d3c8"],
  fragancias: ["#efe2d2", "#c8a36a"],
  cabello:    ["#e6e2dc", "#9b8f7d"],
  maquillaje: ["#f3dfe4", "#d99cae"],
  cuerpo:     ["#eae4d6", "#cbb98e"],
};

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
};
