import { Transaction, TransactionFilters } from "@/types";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { GoogleSheetService } from "./GoogleSheetService";

import { v4 as uuid } from "uuid";
type TransactionInput = Omit<Transaction, 'id'>;


export class TransactionService {
  private transactionRepository: TransactionsRepository;
  private googleSheetService: GoogleSheetService;
  constructor() {
    this.transactionRepository = new TransactionsRepository();
    this.googleSheetService = new GoogleSheetService();
  }

  getAll(filters: TransactionFilters) {
    const transactions = this.transactionRepository.getAll(filters);
    return transactions;
  }

  async saveToSheets(data: TransactionInput) {
    const transactionData = {
      id: uuid(),
      ...data
    }
    this.googleSheetService.appendTransaction(transactionData)
    
  }
  async updateRegister(id: string) {
     await this.googleSheetService.updateData(id)
 }

 async delete(id: string) {
     await this.googleSheetService.deleteTransactionById(id)

 }
}
