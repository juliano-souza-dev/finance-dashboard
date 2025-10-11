import { TransactionsRepository } from "../repositories/TransactionsRepository";

export class TransactionService {
  private transactionRepository: TransactionsRepository;
  constructor() {
    this.transactionRepository = new TransactionsRepository();
  }
}
