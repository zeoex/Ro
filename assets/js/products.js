/* ============================================================
   RO · Catálogo de productos
   Datos editables. Reemplaza `image` por una URL real
   (jpg/png/webp) cuando tengas las fotos de cada producto.
   ============================================================ */

const PRODUCTS = [
  { id: "ro-led", brand: "Fototerapia", name: "Máscara LED Facial · 7 Colores", category: "spa", price: 30000, tag: "Estrella ⭐", desc: "Luz LED para rejuvenecer, unificar el tono y combatir el acné desde casa.", image: "assets/img/mascara-led.jpg" },
  { id: "spa-ems", brand: "", name: "Electrodos EMS", category: "spa", price: 0, tag: "Nuevo", desc: "Electroestimulador muscular EMS para tonificar y reafirmar abdomen, brazos y piernas desde casa. Beneficios: estimula y ejercita el músculo, ayuda a la tonificación y activa la circulación. Modo de uso: colocá el módulo sobre la almohadilla de gel y fijála firme en la zona a trabajar; encendé, elegí modo e intensidad y hacé sesiones de unos 20 minutos, 1-2 veces al día. Importante: no reemplaza el ejercicio ni la dieta; no usar con marcapasos, embarazo ni epilepsia.", image: "assets/img/electrodos-ems.jpg" },
  { id: "spa-rizador", brand: "", name: "Rizador de pestañas térmico", category: "spa", price: 0, tag: "Nuevo", desc: "Arqueador/rizador de pestañas térmico. Beneficios: curva las pestañas con calor para un resultado más duradero y natural que el rizador tradicional, sin pellizcar. Modo de uso: encendé y esperá alrededor de 1 minuto a que caliente; apoyá en la raíz de la pestaña llevando hacia arriba y mantené 3 a 10 segundos; repetí con movimientos ascendentes. Mejor usarlo después de la máscara de pestañas y frente al espejo. En el primer uso, empezá por la temperatura más baja.", image: "assets/img/rizador-pestanas.jpg" },
  { id: "spa-ems-gluteos", brand: "", name: "Electrodos EMS para glúteos", category: "spa", price: 0, tag: "Nuevo", desc: "Electroestimulador EMS para glúteos y caderas (Hips Trainer). Beneficios: envía pulsos eléctricos que contraen y relajan el músculo para ejercitar y tonificar la zona en casa. Modo de uso: limpiá y secá la piel, colocá el cinturón sobre los glúteos, encendé y empezá con baja intensidad aumentando de a poco; sesiones de 15 a 20 minutos, hasta 2 veces por día. Importante: no reemplaza el ejercicio ni la dieta; ante marcapasos, embarazo o condiciones médicas, consultá a un profesional de salud.", image: "assets/img/electrodos-ems-gluteos.jpg" },
  { id: "spa-extractor", brand: "", name: "Extractor de puntos negros (succión de poros)", category: "spa", price: 0, tag: "Nuevo", desc: "Extractor facial de puntos negros por succión. Beneficios: limpia los poros, elimina puntos negros, exceso de grasa y células muertas; incluye varias sondas y niveles de succión para distintos tipos de piel. Modo de uso: limpiá el rostro y abrí los poros con una toalla tibia o vapor 3-5 min; probá primero la succión en la mano, empezá por el nivel más bajo y deslizá el cabezal por la zona sin detenerte en un punto; al terminar, cerrá los poros con agua fría. No lo uses sobre piel irritada o acné inflamado y limpiá el cabezal después de cada uso.", image: "assets/img/extractor-puntos.jpg" },
  { id: "spa-masajeador-cuello", brand: "", name: "Masajeador de papada y cuello", category: "spa", price: 0, tag: "Nuevo", desc: "Masajeador facial y de cuello con luz LED por colores, calor y vibración (modelo ES-1081). Beneficios: ayuda a reafirmar la piel del cuello y la papada, suavizar líneas finas y arrugas y dar un efecto de piel más tensa; la luz roja se asocia a estimular el colágeno, la azul al cuidado antiarrugas y el calor abre los poros para una mejor absorción de las cremas. Modo de uso: aplicá crema o gel sobre el cuello, encendé y elegí el modo de luz; deslizá el cabezal desde la base del cuello hacia arriba, hasta el mentón, durante 10 a 15 minutos por sesión. No lo uses sobre piel irritada ni con heridas abiertas.", image: "assets/img/masajeador-papada-cuello.jpg" },
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
