import { GoogleSheetService } from "@/lib/services/GoogleSheetService";
import { NextRequest, NextResponse } from "next/server";

const googleSheetService: GoogleSheetService = new GoogleSheetService()
export async function GET(request: NextRequest) {

    const result = await googleSheetService.fetchAll();
    return NextResponse.json({result})

}