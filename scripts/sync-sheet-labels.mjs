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
const metadataResponse = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`,
  { headers: { Authorization: `Bearer ${token}` } },
);
if (!metadataResponse.ok) throw new Error(`Sheet metadata check failed (${metadataResponse.status}).`);
const metadata = await metadataResponse.json();
const currentSheet = metadata.sheets?.find((item) => item.properties?.title === sheetName);
const legacySheet = metadata.sheets?.find((item) => item.properties?.title === "Consultation Orders");

if (!currentSheet && legacySheet?.properties?.sheetId !== undefined) {
  const renameResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [{
          updateSheetProperties: {
            properties: { sheetId: legacySheet.properties.sheetId, title: sheetName },
            fields: "title",
          },
        }],
      }),
    },
  );
  if (!renameResponse.ok) throw new Error(`Sheet rename failed (${renameResponse.status}).`);
}
const range = encodeURIComponent(`'${sheetName.replaceAll("'", "''")}'!A1`);
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
  {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [["Appointment Reference"]] }),
  },
);
if (!response.ok) throw new Error(`Sheet label update failed (${response.status}).`);
console.log("Updated the spreadsheet tab and appointment reference label.");
