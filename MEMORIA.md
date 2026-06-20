# MEMORIA.md

Memoria persistente del proyecto. Aquí se registran decisiones, preferencias y
contexto que deben recordarse entre sesiones.

## Perfil

- **Especialidad**: landing pages y diseño web para carritos de compras (e-commerce).
- **Idioma de trabajo**: español.

## Estado del proyecto

- **Repositorio**: `Ro` (zeoex/ro).
- **Marca**: **RO** — belleza importada multimarca, estilo unisex.
- **Rubro**: productos importados de belleza (skincare, fragancias, cabello & barba, maquillaje, cuerpo).
- **Rama activa**: `claude/landing-pages-ecommerce-design-ybva1e`.
- **Estado actual**: landing + tienda con carrito y checkout funcionales.

## Decisiones de diseño

| Fecha       | Decisión | Motivo |
|-------------|----------|--------|
| 2026-06-20  | Crear `CLAUDE.md` y `MEMORIA.md` con perfil de especialista e-commerce | Establecer contexto |
| 2026-06-20  | Stack **HTML + CSS + JS vanilla** (sin build) | Carga rápida, hosting simple, carrito con localStorage |
| 2026-06-20  | Paleta **crema/negro + dorado champagne**, tipografías Cormorant Garamond + Jost | Look premium y unisex |
| 2026-06-20  | Imágenes de producto en **SVG generado** | Verse bien sin depender de fotos externas; fáciles de reemplazar |

## Preferencias del usuario

- Rubro: belleza importada. Estilo: multimarca, unisex.
- Quiere que "se vea sensacional" → priorizar estética premium y pulida.

## Arquitectura

- `index.html` — estructura de la landing y la tienda.
- `assets/css/styles.css` — tokens de diseño en `:root` + componentes.
- `assets/js/products.js` — catálogo (`PRODUCTS`) + generador de imágenes SVG.
- `assets/js/cart.js` — render, filtros, carrito (localStorage), checkout, toasts.
- Constante `FREE_SHIPPING` = 150.000 (umbral de envío gratis).

## Pendientes / próximos pasos

- [x] Definir tienda y productos.
- [x] Elegir paleta, tipografías y stack.
- [x] Construir landing principal.
- [x] Implementar carrito de compras.
- [x] Implementar flujo de checkout (formulario + WhatsApp + volver al inicio).
- [x] Configurar `WHATSAPP_NUMBER` = `5493624009892` (Argentina).
- [x] Reforzar responsive 100% (breakpoints tablet/móvil/móvil pequeño).
- [x] Desplegar en producción (GitHub Pages + GitHub Actions).
- [ ] Reemplazar imágenes SVG por fotos reales de cada producto.
- [ ] Página de detalle de producto (PDP) individual.
- [ ] Definir precios y stock reales.

## Despliegue (ACTUAL)

- **Producción**: https://zeoex.github.io/Ro/ (GitHub Pages).
- Deploy automático vía GitHub Actions (`.github/workflows/deploy-pages.yml`)
  en cada push a `main`. Verificable desde la sesión por la API de GitHub.
- Pages se activó manualmente una vez (Settings → Pages → Source: GitHub Actions).
- Vercel (`rocio-sable.vercel.app`) quedó descartado: el sandbox bloquea
  `api.vercel.com` y `*.vercel.app`, así que no se podía desplegar/verificar desde aquí.
- Cache-busting: los assets usan `?v=N` en index.html (subir N en cada cambio).
  GitHub Pages cachea el HTML ~10 min → para ver cambios al instante usar incógnito.

## Checkout WhatsApp

- Constante `WHATSAPP_NUMBER` al inicio de `assets/js/cart.js`.
- Flujo: "Finalizar compra" abre modal con datos del cliente → "Enviar pedido por
  WhatsApp" arma el mensaje (productos, total, datos) y abre wa.me → vacía carrito
  → vista de éxito → "Seguir comprando" cierra y sube al inicio.

## Bugs resueltos (importante)

- **Modal no cerraba**: `.modal { display: grid }` anulaba el atributo `hidden`.
  Solución: regla `.modal[hidden] { display: none }` + cierre forzado con
  `modal.style.display = "none"` en JS (estilo en línea, gana sobre todo).

## Notas

- Mantener este archivo actualizado al final de cada cambio relevante.
