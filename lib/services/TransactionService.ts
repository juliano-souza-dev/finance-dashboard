import { TransactionFilters } from "@/types";
import { TransactionsRepository } from "../repositories/TransactionsRepository";



export class TransactionService {
  private transactionRepository: TransactionsRepository;
  constructor() {
    this.transactionRepository = new TransactionsRepository();
  }

  getAll(filters: TransactionFilters) {
    const transactions = this.transactionRepository.getAll(filters);
    return transactions;
  }
}
