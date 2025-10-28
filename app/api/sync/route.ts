export const revalidate = 0; // 🚫 nunca revalida
export const dynamic = "force-dynamic"; // 🚫 desativa cache em rotas serverless

import { GoogleSheetService } from "@/lib/services/GoogleSheetService";
import { NextRequest, NextResponse } from "next/server";

const googleSheetService: GoogleSheetService = new GoogleSheetService()
export async function GET(request: NextRequest) {

    const result = await googleSheetService.fetchAll();
    return NextResponse.json({result},{
        headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
    })

}