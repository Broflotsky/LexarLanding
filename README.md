# Landing Abogados Medellín — LEXAR Legal Consultants S.A.S.

Landing page de captación de leads para LEXAR Legal Consultants S.A.S., firma de abogados en Medellín, con dos variantes verticales:

- **`index.html`** — Variante Laboral y general (servicios integrales)
- **`comercial.html`** — Variante Comercial (B2B, estructura corporativa, contratación estatal)

Sitio estático sin build step. Listo para deploy en Vercel, Netlify, Cloudflare Pages, GitHub Pages o cualquier hosting tradicional.

---

## Estructura del proyecto

```
pruebas/
├── index.html              # Landing principal (Laboral)
├── comercial.html          # Variante Comercial
├── css/
│   └── styles.css          # Sistema de diseño completo
├── js/
│   └── main.js             # Forms, FAQ, smooth scroll, tracking
├── assets/
│   ├── favicon.svg
│   ├── lawyer-portrait.svg # Placeholder del retrato — reemplazar
│   └── og-image.svg        # Open Graph preview
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Cómo ejecutar localmente

Cualquier servidor estático sirve. Las opciones más rápidas:

```bash
# Opción 1 — Python (preinstalado en la mayoría de Linux/Mac)
python3 -m http.server 8000

# Opción 2 — Node (si tienes npx)
npx serve .

# Opción 3 — Sólo abrir el archivo
xdg-open index.html   # Linux
open index.html       # Mac
```

Luego abre `http://localhost:8000` en tu navegador.

---

## Personalización antes de salir a producción

Buscar y reemplazar en los HTML los siguientes valores ficticios:

| Token actual | Valor configurado |
|---|---|
| Nombre de la firma | LEXAR Legal Consultants S.A.S. |
| Teléfono / WhatsApp | +57 324 577 7090 |
| Correo | lexar.legalc@gmail.com |
| Dominio | lexarlegal.co |
| Dirección | Carrera 46 # 52-140 Of. 401, Ed. Banco Caja Social, Medellín |
| Equipo | Milton Rodrigo Acosta, Ovidio Rendón González, Alfonso Oviedo Guerra |
| `assets/lawyer-portrait.svg` | Pendiente: reemplazar con fotos reales del equipo |
| `assets/og-image.svg` | Pendiente: reemplazar con imagen 1200×630 PNG/JPG de LEXAR |

**Crítico:** la copy debe ser revisada por un abogado de LEXAR Legal Consultants antes del lanzamiento para garantizar cumplimiento de las normas de publicidad jurídica del Consejo Superior de la Judicatura.

---

## Conectar formularios a un backend real

El JS (`js/main.js`) tiene un mock submit. Reemplaza el bloque marcado con `MOCK SUBMIT`:

```js
await fetch("/api/lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

Opciones recomendadas (sin código backend):

- **Formspree** — `<form action="https://formspree.io/f/TU_ID" method="POST">`
- **Netlify Forms** — añadir `data-netlify="true"` al `<form>`
- **Web3Forms** — gratis para uso ligero, sin cuenta
- **HubSpot Forms** — si vas a integrarlo con CRM
- **Tally / Typeform** — embed con webhook a Slack/email

Recomendación: cualquier formulario debe disparar un webhook que notifique al equipo por **Slack/Telegram + correo**, para que un humano responda en menos de 1 minuto.

---

## Tracking (GA4 + Meta Pixel)

Añade al `<head>` de los dos HTML, antes del cierre:

```html
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
```

El JS ya emite eventos automáticamente:

- `lead_form_submit` (con `form` = `hero` | `hero_comercial` | `exit_intent`)
- `whatsapp_click`
- `call_click`
- `faq_open`
- `scroll_depth` (25 / 50 / 75 / 100 %)
- `exit_intent_show`

Configura las **conversiones** en GA4: `lead_form_submit`, `whatsapp_click`, `call_click`.

---

## Despliegue

### Opción A — Vercel (recomendada)

```bash
npm i -g vercel
vercel
```

Vercel detecta el sitio estático automáticamente. Añade un dominio personalizado y certificado HTTPS gratis.

### Opción B — Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

### Opción C — GitHub Pages

1. Sube el repo a GitHub
2. Settings → Pages → Source: `main` branch / root
3. La URL será `https://<usuario>.github.io/<repo>/`

### Opción D — Cloudflare Pages

Conectar el repo en `dash.cloudflare.com/?to=/:account/pages` y elegir "Build command: ninguno" + "Output: /".

---

## Optimización antes del lanzamiento

- [ ] Reemplazar `lawyer-portrait.svg` por foto profesional real (JPG 800×1000, &lt;120 KB).
- [ ] Reemplazar `og-image.svg` por imagen 1200×630 PNG/JPG.
- [ ] Conectar formularios a un backend real (ver sección anterior).
- [ ] Añadir Google Tag Manager + Meta Pixel.
- [ ] Crear el Google Business Profile de LEXAR Legal Consultants con categoría "Abogado" y "Abogado comercial".
- [ ] Dar de alta en directorios: Páginas Amarillas Colombia, Cylex, Lawzana, Doctoralia legal.
- [ ] Conseguir las primeras 20 reseñas en Google para LEXAR.
- [ ] Escribir las páginas legales completas: Política de tratamiento de datos, Política de cookies, Aviso legal.
- [ ] Validar el schema.org en https://validator.schema.org.
- [ ] Probar móvil: iPhone SE (320 px) y iPhone 14 Pro Max.
- [ ] Probar Lighthouse: objetivo ≥ 90 en Performance, Accessibility, Best Practices, SEO.
- [ ] Configurar redirección de `www` → no-`www` (o viceversa) y forzar HTTPS.

---

## Roadmap sugerido (90 días)

- **Semanas 1-2** — Reemplazar contenido placeholder, sesión de fotos, copy revisada por abogado, deploy.
- **Semanas 3-4** — GA4, GTM, GBP optimizado, primeras reseñas.
- **Semanas 5-8** — Blog informacional (3 artículos / semana), calculadora de liquidación, primeros backlinks.
- **Semanas 9-12** — A/B testing del hero, refinar copy según heatmaps, expandir a páginas geo (`/abogado-laboral-envigado`, `/abogado-laboral-itagui`).

---

## Stack y decisiones de diseño

- **HTML/CSS/JS vanilla** — cero dependencias, máxima velocidad, fácil mantener.
- **Fuentes** — Playfair Display (serif, encabezados — confianza y tradición) + Inter (sans, UI).
- **Paleta** — navy `#0e2a47` (autoridad) + dorado `#b5853a` (acción y prestigio).
- **Mobile-first** — todo el CSS está pensado para 320px+ y escala progresivamente.
- **Sin gradientes ni sombras decorativas** — diseño plano, profesional, alineado con firmas legales premium.
- **Schema.org completo** — `LegalService`, `Attorney`, `FAQPage`, `BreadcrumbList`.

---

## Licencia y notas

Plantilla creada como blueprint funcional. Reemplaza todo el contenido placeholder antes de uso comercial.
La copy contiene afirmaciones que deben ser **verificadas y validadas** por el abogado titular antes del lanzamiento (cifras de éxito, tarjeta profesional, etc.).

Cumplimiento mínimo en producción:
- Política de tratamiento de datos visible (Ley 1581 de 2012).
- Sin afirmaciones absolutas de éxito ("100% efectividad", "garantizamos ganar").
- Testimonios con consentimiento expreso por escrito.
- Honorarios transparentes si se publican.
