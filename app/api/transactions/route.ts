import { getAuthenticatedUser } from "@/lib/auth-helper";
import { TransactionService } from "@/lib/services/TransactionService";
import { NextResponse } from "next/server";

export async function GET() {


  try {
    const session = await getAuthenticatedUser()

    console.log('Usuário autenticado!')
    
    const transactionService: TransactionService = new TransactionService();

    const transactions = transactionService.getAll()

    return NextResponse.json({ transactions });
  } catch (error: unknown) {
    if(error instanceof Error) {
         return NextResponse.json({ message: error.message || 'Não Autorizado.' }, { status: 401 });
    }
    console.error('Erro no Route Handler /api/transactions:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });

  }

}
