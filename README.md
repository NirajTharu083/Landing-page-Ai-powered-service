# Digital Niraj Landing Page

A conversion-focused Next.js landing page for a free AI Marketing Strategy Call.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production check

```bash
npm run build
npm start
```

## Flodesk form workflow

The landing page uses the native Flodesk HTML embed stored at `public/flodesk-embed.html`. Flodesk remains responsible for lead capture and email automation.

The embed's native success stage is observed in the browser. After Flodesk confirms a successful submission, the page waits briefly and redirects to `/thanks`. There is no custom form backend or iframe submission workaround.

## Deploy to Vercel

Import this repository in Vercel. The framework will be detected as Next.js automatically; no custom build settings are required. Connect `digital.nirajtharu.com.np` in the project domain settings after deployment.

The `/thanks` route displays the same confirmation experience as `/thank-you`.
