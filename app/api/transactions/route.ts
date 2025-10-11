import { TransactionService } from "@/lib/services/TransactionService";
import { NextResponse } from "next/server";

export async function GET() {
  const transactionService: TransactionService = new TransactionService();

  return NextResponse.json({ ok: true });
}
