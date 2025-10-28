
export const revalidate = 0;          // 🚫 nunca revalida
export const dynamic = 'force-dynamic'; // 🚫 força execução a cada request
export const fetchCache = 'force-no-store'; // 🚫 desativa cache global de fetch

import { ensureCacheReady } from "@/lib/cache-init";

import { getAuthenticatedUser } from "@/lib/auth-helper";
import { GoogleSheetService } from "@/lib/services/GoogleSheetService";
import { TransactionService } from "@/lib/services/TransactionService";
import { TransactionSchema } from "@/schemas/transactions-schema";
import { TransactionFilters } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const TransactionFiltersSchema = z.object({
   month: z.string().length(2, "Mês deve ter 2 dígitos (MM)").optional(), 
    
    year: z.string().length(4, "Ano deve ter 4 dígitos (YYYY)").optional(), 
    category: z.string().optional(),
    type: z.enum(['income', 'expense']).optional(),
  
    status: z.enum(['paid', 'pending']).optional(),
})

export async function GET(request: NextRequest) {

  await ensureCacheReady();

const params = Object.fromEntries(
  Array.from(request.nextUrl.searchParams.entries()).map(([key, value]) => [
    key.toLowerCase(),
    value.toLowerCase(),
  ])
);

const validation = TransactionFiltersSchema.safeParse(params)
if (!validation.success) {
            console.error('Erro de validação de query params:', validation.error);
         return NextResponse.json(
                { 
                    message: 'Parâmetros de filtro inválidos.',
                    errors: validation.error.format() 
                }, 
                { status: 400 }
            );
}
const filters = validation.data as TransactionFilters



  try {
    const session = await getAuthenticatedUser()

        
    const transactionService: TransactionService = new TransactionService();


    const transactions = transactionService.getAll(filters)



    return NextResponse.json({ transactions },{
        headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
    });
    
  } catch (error: unknown) {
    if(error instanceof Error) {
         return NextResponse.json({ message: error.message || 'Não Autorizado.' }, { status: 401 });
    }
    console.error('Erro no Route Handler /api/transactions:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });

  }

}

export async function POST(request: NextRequest) {

  const transactionServiceets:TransactionService = new TransactionService();

try {
  
  const body = await request.json() 

  const transactionData = TransactionSchema.parse(body)

  await transactionServiceets.saveToSheets(transactionData)
   


  return NextResponse.json({ok: true})
} catch(error: any) {
 if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Erro de validação", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao salvar transação:", error);
     return NextResponse.json(
      { error: "Erro interno ao salvar a transação" },
      { status: 500 }
    );
}
}
export async function DELETE(request: NextRequest) {
 try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const google = new GoogleSheetService();
    await google.deleteTransactionById(id);

    return NextResponse.json({
      success: true,
      message: `Transação ${id} excluída com sucesso!`,
    });
  } catch (err: any) {
    console.error("Erro ao excluir transação:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno ao excluir transação." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
   const transactionService:TransactionService = new TransactionService();

try {
  const id = request.nextUrl.searchParams.get("id");

  await transactionService.updateRegister(id!)

  return NextResponse.json({ok: true})
} catch(error: any) {
 if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Erro de validação", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao salvar transação:", error);
     return NextResponse.json(
      { error: "Erro interno ao salvar a transação" },
      { status: 500 }
    );
}
}