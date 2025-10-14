import { z } from "zod";

const GoogleServiceAccountSchema = z.object({
  type: z.literal("service_account"),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string(),
  client_email: z.string(),
  spreadsheetId: z.string(),
  NEXTAUTH_SECRET: z.string()
});

const _env = GoogleServiceAccountSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("⚠️ Invalid environment variables", _env.error.format());
  throw new Error("Invalid enviroment variables!");
}
export const env = _env.data;

