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

## Consultation request workflow configuration

Each valid form submission is saved in the configured Google spreadsheet, sends an owner notification email, sends the customer a confirmation email, and then redirects to `/thank-you`.

1. Copy `.env.example` to `.env.local` and add the Google service-account, spreadsheet, and Gmail app-password values.
2. Share the Google spreadsheet with the configured service-account email as an **Editor**.
3. Enable the Google Sheets API in the service account's Google Cloud project.
4. Keep `.env.local` private and add the same variables to Vercel before deployment.

The application creates and formats a dedicated `Consultation Requests` sheet tab automatically. Existing spreadsheet tabs and data are preserved.

## Deploy to Vercel

Import this repository in Vercel. The framework will be detected as Next.js automatically; no custom build settings are required. Connect `digital.nirajtharu.com.np` in the project domain settings after deployment.

The form redirects to `/thank-you` only after the spreadsheet row and both emails are successfully processed.
