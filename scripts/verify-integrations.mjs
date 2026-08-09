import { JWT } from "google-auth-library";

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is missing.`);
  return value;
};

const auth = new JWT({
  email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const token = (await auth.getAccessToken()).token;
if (!token) throw new Error("Google authentication failed.");

const spreadsheetId = required("GOOGLE_SPREADSHEET_ID");
const sheetName = process.env.GOOGLE_SHEET_NAME || "Consultation Requests";
const headers = { Authorization: `Bearer ${token}` };

const metadataResponse = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title,gridProperties.frozenRowCount)`,
  { headers },
);
if (!metadataResponse.ok) throw new Error(`Spreadsheet metadata check failed (${metadataResponse.status}).`);
const metadata = await metadataResponse.json();
const sheet = metadata.sheets?.find((item) => item.properties?.title === sheetName);

const range = encodeURIComponent(`'${sheetName.replaceAll("'", "''")}'!A1:J3`);
const valuesResponse = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
  { headers },
);
if (!valuesResponse.ok) throw new Error(`Spreadsheet values check failed (${valuesResponse.status}).`);
const values = await valuesResponse.json();

const testRow = values.values?.find((row) => row[0] === process.argv[2]);
console.log(JSON.stringify({
  sheetFound: Boolean(sheet),
  frozenHeader: sheet?.properties?.gridProperties?.frozenRowCount === 1,
  headerColumns: values.values?.[0]?.length || 0,
  testOrderFound: Boolean(testRow),
  testOrderStatus: testRow?.[2] || null,
}, null, 2));
