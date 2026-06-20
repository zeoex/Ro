# RO · Belleza importada unisex 🛍️

Landing page + tienda e-commerce para **productos importados de belleza, multimarca y estilo unisex**.
Skincare, fragancias, cabello & barba, maquillaje y cuidado corporal.

## ✨ Características

- **Landing de alta conversión**: hero animado, marcas, beneficios y newsletter.
- **Catálogo con filtros** por categoría (Skincare, Fragancias, Cabello & Barba, Maquillaje, Cuerpo).
- **Carrito funcional** (drawer lateral) con cantidades, subtotal y barra de envío gratis.
- **Checkout** con formulario, validación y confirmación de pedido.
- **Persistencia**: el carrito se guarda en `localStorage`.
- **Responsive** mobile-first y accesible (teclado, foco, `prefers-reduced-motion`).
- **Sin build ni dependencias**: HTML + CSS + JS vanilla. Se hostea en cualquier lado.

## 🎨 Diseño

- Estilo **premium unisex**: crema, negro y acento dorado champagne.
- Tipografía: *Cormorant Garamond* (titulares) + *Jost* (texto).
- Imágenes de producto generadas en SVG (placeholders elegantes,
  fáciles de reemplazar por fotos reales).

## 🚀 Cómo verlo

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## 📁 Estructura

```
index.html
assets/
├── css/styles.css      → sistema de diseño + componentes
├── js/products.js      → catálogo (datos editables) + imágenes SVG
├── js/cart.js          → render, carrito, checkout
└── favicon.svg
```

## 🛠️ Personalización

- **Productos**: edita el array `PRODUCTS` en `assets/js/products.js`.
  Para usar fotos reales, reemplaza la imagen SVG por una etiqueta `<img>`
  apuntando a tu archivo (jpg/png/webp).
- **Colores y tipografía**: variables CSS en `:root` dentro de `styles.css`.
- **Envío gratis**: constante `FREE_SHIPPING` en `cart.js`.

---
Hecho con 🤍 para la belleza sin fronteras.
