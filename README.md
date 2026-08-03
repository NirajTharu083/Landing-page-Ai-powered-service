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

## Email delivery setup

Form submissions are sent to `nirajtharu083@gmail.com` through Resend.

1. Create a free account at [Resend](https://resend.com) using `nirajtharu083@gmail.com`.
2. Create an API key in the Resend dashboard.
3. Copy `.env.example` to `.env.local` and replace `re_your_api_key` with the key.
4. For production, verify `digital.nirajtharu.com.np` in Resend and keep the configured `RESEND_FROM_EMAIL` value.
5. Add both environment variables to the Vercel project settings before deploying.

Until the API key is configured, the form displays a delivery error and does not show a false success page.

## Deploy to Vercel

Import this repository in Vercel. The framework will be detected as Next.js automatically; no custom build settings are required. Connect `digital.nirajtharu.com.np` in the project domain settings after deployment.

After Resend confirms delivery, the form redirects to `/thank-you`.
