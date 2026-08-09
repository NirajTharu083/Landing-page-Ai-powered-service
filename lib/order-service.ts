import { JWT } from "google-auth-library";
import nodemailer from "nodemailer";

export type OrderSubmission = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  website: string;
  message: string;
};

const HEADERS = [
  "Appointment Reference",
  "Received At (Nepal Time)",
  "Status",
  "Full Name",
  "Active Email",
  "WhatsApp Number",
  "Business Name",
  "Website / Facebook",
  "Customer Message",
  "Source",
];

const SHEET_TITLE = process.env.GOOGLE_SHEET_NAME || "Consultation Requests";

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[character] || character);

const quotedSheetTitle = () => `'${SHEET_TITLE.replace(/'/g, "''")}'`;

type SpreadsheetMetadata = {
  sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
};

type BatchUpdateResponse = {
  replies?: Array<{ addSheet?: { properties?: { sheetId?: number } } }>;
};

type ValuesResponse = { values?: string[][] };
type AppendResponse = { updates?: { updatedRange?: string } };

async function googleAccessToken() {
  const auth = new JWT({
    email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const result = await auth.getAccessToken();
  if (!result.token) throw new Error("Unable to authenticate with Google Sheets.");
  return result.token;
}

async function sheetsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const spreadsheetId = requiredEnv("GOOGLE_SPREADSHEET_ID");
  const token = await googleAccessToken();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Google Sheets API request failed (${response.status}): ${details.slice(0, 500)}`);
  }
  return response.json() as Promise<T>;
}

async function sheetMetadata() {
  return sheetsRequest<SpreadsheetMetadata>("?fields=sheets.properties(sheetId,title)");
}

async function batchUpdate(requests: unknown[]) {
  return sheetsRequest<BatchUpdateResponse>(":batchUpdate", {
    method: "POST",
    body: JSON.stringify({ requests }),
  });
}

async function formatOrdersSheet(sheetId: number) {
  const widths = [150, 190, 110, 180, 230, 170, 210, 250, 360, 140];
  await batchUpdate([
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: { frozenRowCount: 1 },
          tabColor: { red: 0.145, green: 0.388, blue: 0.922 },
        },
        fields: "gridProperties.frozenRowCount,tabColor",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.059, green: 0.09, blue: 0.165 },
            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 44 },
        fields: "pixelSize",
      },
    },
    ...widths.map((pixelSize, index) => ({
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
        properties: { pixelSize },
        fields: "pixelSize",
      },
    })),
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
        cell: { userEnteredFormat: { verticalAlignment: "MIDDLE", wrapStrategy: "WRAP", padding: { top: 8, bottom: 8, left: 8, right: 8 } } },
        fields: "userEnteredFormat(verticalAlignment,wrapStrategy,padding)",
      },
    },
    {
      addBanding: {
        bandedRange: {
          range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: HEADERS.length },
          rowProperties: {
            firstBandColor: { red: 1, green: 1, blue: 1 },
            secondBandColor: { red: 0.965, green: 0.976, blue: 0.996 },
          },
        },
      },
    },
    { setBasicFilter: { filter: { range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: HEADERS.length } } } },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 2, endColumnIndex: 3 },
        rule: {
          condition: { type: "ONE_OF_LIST", values: ["New", "Contacted", "Booked", "Closed", "Email Error"].map((userEnteredValue) => ({ userEnteredValue })) },
          strict: true,
          showCustomUi: true,
        },
      },
    },
    {
      addConditionalFormatRule: {
        index: 0,
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 2, endColumnIndex: 3 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "New" }] },
            format: {
              backgroundColor: { red: 0.859, green: 0.918, blue: 0.996 },
              textFormat: { foregroundColor: { red: 0.118, green: 0.227, blue: 0.541 }, bold: true },
            },
          },
        },
      },
    },
  ]);
}

let sheetInitialization: Promise<number> | null = null;

async function initializeOrdersSheet() {
  let metadata = await sheetMetadata();
  let sheet = metadata.sheets?.find((item) => item.properties?.title === SHEET_TITLE);
  let sheetId = sheet?.properties?.sheetId;

  if (sheetId === undefined) {
    try {
      const created = await batchUpdate([{
        addSheet: {
          properties: {
            title: SHEET_TITLE,
            gridProperties: { rowCount: 1000, columnCount: HEADERS.length, frozenRowCount: 1 },
          },
        },
      }]);
      sheetId = created.replies?.[0]?.addSheet?.properties?.sheetId;
    } catch {
      metadata = await sheetMetadata();
      sheet = metadata.sheets?.find((item) => item.properties?.title === SHEET_TITLE);
      sheetId = sheet?.properties?.sheetId;
    }
  }

  if (sheetId === undefined) throw new Error("Unable to create the orders sheet.");

  const range = `${quotedSheetTitle()}!A1:J1`;
  const current = await sheetsRequest<ValuesResponse>(`/values/${encodeURIComponent(range)}`);
  const currentHeaders = current.values?.[0] || [];
  const needsSetup = HEADERS.some((header, index) => currentHeaders[index] !== header);
  const isUnformattedSheet = currentHeaders.length === 0;

  if (needsSetup) {
    await sheetsRequest(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [HEADERS] }),
    });
    if (isUnformattedSheet) await formatOrdersSheet(sheetId);
  }

  return sheetId;
}

async function getOrdersSheetId() {
  if (!sheetInitialization) {
    sheetInitialization = initializeOrdersSheet().catch((error) => {
      sheetInitialization = null;
      throw error;
    });
  }
  return sheetInitialization;
}

const nepalTimestamp = () => new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kathmandu",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
}).format(new Date());

const createOrderId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `DN-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
};

function detailRows(submission: OrderSubmission, orderId: string, receivedAt: string) {
  return [
    ["Appointment Reference", orderId],
    ["Received At", receivedAt],
    ["Full Name", submission.fullName],
    ["Email", submission.email],
    ["WhatsApp", submission.whatsapp],
    ["Business Name", submission.businessName],
    ["Website / Facebook", submission.website || "Not provided"],
    ["Message", submission.message || "Not provided"],
  ].map(([label, value]) => `<tr><td style="padding:11px 14px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:11px 14px;border-bottom:1px solid #e2e8f0;color:#475569;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`).join("");
}

async function sendOrderEmails(submission: OrderSubmission, orderId: string, receivedAt: string) {
  const gmailUser = requiredEnv("GMAIL_USER");
  const ownerEmail = requiredEnv("OWNER_EMAIL");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: requiredEnv("GMAIL_APP_PASSWORD").replace(/\s/g, "") },
  });
  const shell = (content: string) => `<div style="margin:0;background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;"><div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 14px 40px rgba(15,23,42,.08);"><div style="padding:24px 28px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;"><p style="margin:0;font-size:20px;font-weight:800;">Digital Niraj</p></div><div style="padding:28px;">${content}</div></div></div>`;

  const ownerHtml = shell(`<p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">New consultation request</p><h1 style="margin:0 0 20px;font-size:26px;">A new customer submitted the form</h1><table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">${detailRows(submission, orderId, receivedAt)}</table><p style="margin:20px 0 0;color:#64748b;font-size:13px;">The consultation request has also been saved in your Google spreadsheet.</p>`);
  const customerHtml = shell(`<p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Request confirmed</p><h1 style="margin:0 0 16px;font-size:26px;">Thank you, ${escapeHtml(submission.fullName)}!</h1><p style="margin:0 0 14px;color:#475569;font-size:16px;line-height:1.7;">Your free AI Marketing Strategy Call request has been received successfully.</p><div style="margin:20px 0;padding:16px 18px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;"><p style="margin:0;color:#1e3a8a;font-size:14px;"><strong>Appointment reference:</strong> ${escapeHtml(orderId)}</p></div><p style="margin:0;color:#475569;font-size:16px;line-height:1.7;">I will review your business details and contact you about the next steps.</p><p style="margin:22px 0 0;color:#0f172a;font-weight:700;">Digital Niraj</p>`);

  await Promise.all([
    transporter.sendMail({ from: `Digital Niraj <${gmailUser}>`, to: ownerEmail, replyTo: submission.email, subject: `New consultation request — ${submission.businessName} (${orderId})`, html: ownerHtml }),
    transporter.sendMail({ from: `Digital Niraj <${gmailUser}>`, to: submission.email, replyTo: ownerEmail, subject: `Your AI Marketing Consultation Request is Confirmed — ${orderId}`, html: customerHtml }),
  ]);
}

export async function createOrder(submission: OrderSubmission) {
  await getOrdersSheetId();
  const spreadsheetId = requiredEnv("GOOGLE_SPREADSHEET_ID");
  const orderId = createOrderId();
  const receivedAt = nepalTimestamp();
  const range = `${quotedSheetTitle()}!A:J`;
  const appended = await sheetsRequest<AppendResponse>(`/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ values: [[orderId, receivedAt, "New", submission.fullName, submission.email, submission.whatsapp, submission.businessName, submission.website || "Not provided", submission.message || "Not provided", "Website Form"]] }),
  });

  try {
    await sendOrderEmails(submission, orderId, receivedAt);
  } catch (error) {
    const row = appended.updates?.updatedRange?.match(/![A-Z]+(\d+):/)?.[1];
    if (row) {
      const statusRange = `${quotedSheetTitle()}!C${row}`;
      await sheetsRequest(`/values/${encodeURIComponent(statusRange)}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [["Email Error"]] }),
      }).catch(() => undefined);
    }
    throw error;
  }

  return { orderId, spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` };
}
