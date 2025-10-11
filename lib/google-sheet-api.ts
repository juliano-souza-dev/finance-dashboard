import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import { env } from "@/env";

const credentials = {
  client_email: env.client_email,
  private_key: env.private_key,
  project_id: env.project_id,
};

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  const authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: "v4", auth: authClient });
  return sheets;
}
