# Delytel Music AI — tu manager digital (app instalable, gratis)

Es una PWA: una app que se instala en el celular desde el navegador, sin Play Store ni App Store.
La IA usa Google Gemini (plan gratuito). La memoria se guarda en tu celular. Los Word, PDF y Excel se generan en el propio teléfono.

## Archivos
- `index.html`  → toda la app (diseño, swipe, chat, archivos, memoria)
- `api/chat.js` → mini servidor que guarda tu clave en secreto y habla con Gemini
- `manifest.webmanifest`, `sw.js`, `icon-*.png` → lo que permite instalarla como app
- `vercel.json` → configuración del hosting

## Paso 1 · Clave gratis de la IA (2 min)
1. Entra a https://aistudio.google.com e inicia sesión con tu cuenta Google.
2. Pulsa **Get API key** → **Create API key**. Copia la clave. No necesita tarjeta.

## Paso 2 · Subir el código a GitHub (5 min)
1. Crea una cuenta gratis en https://github.com
2. Botón **New repository** → nombre `delytel` → **Create repository**.
3. Pulsa **uploading an existing file**, arrastra TODO el contenido de esta carpeta (incluida la carpeta `api`) y pulsa **Commit changes**.
   Importante: `api/chat.js` debe quedar dentro de la carpeta `api`.

## Paso 3 · Publicarla gratis en Vercel (5 min)
1. Entra a https://vercel.com → **Sign Up** → **Continue with GitHub**.
2. **Add New → Project** → elige el repositorio `delytel` → **Import**.
3. Abre **Environment Variables** y agrega:
   - Name: `GEMINI_API_KEY`   Value: (tu clave del paso 1)
4. Pulsa **Deploy**. En un minuto tendrás un enlace tipo `https://delytel.vercel.app`.

## Paso 4 · Instalarla en el celular
- **Android (Chrome):** abre tu enlace → menú ⋮ → **Instalar app** / **Agregar a pantalla de inicio**.
- **iPhone (Safari):** abre tu enlace → botón Compartir → **Agregar a inicio**.
Queda con su ícono y se abre a pantalla completa como cualquier app.

## Cosas que debes saber
- **Límites:** la capa gratuita de Gemini tiene límites por minuto y por día. Si se llena, la app avisa "muchos mensajes seguidos". Para más uso hay que activar facturación en Google.
- **Privacidad:** en el plan gratuito Google puede usar lo que se envía para mejorar sus productos. No escribas datos sensibles (RUT, contratos firmados, claves).
- **Memoria:** se guarda en cada celular (no se sincroniza entre dispositivos). Si borras los datos del navegador, se pierde.
- **Modelo:** por defecto `gemini-2.5-flash`. Si Google lo cambia y deja de responder, agrega en Vercel la variable `GEMINI_MODEL` con el nombre vigente (por ejemplo `gemini-2.5-flash-lite`) y redeploya.
- **Uso comercial:** el plan gratuito de Vercel (Hobby) es para uso personal/no comercial. Si vas a cobrar suscripciones, migra a un plan de pago o a otro hosting.
- **Actualizar la app:** edita un archivo en GitHub y Vercel republica solo.
- **Publicar en Play Store / App Store (opcional, no es gratis):** Google cobra US$25 una sola vez y Apple US$99 al año. La versión instalable desde el navegador no los necesita.
