import { Transaction } from "better-sqlite3";
import db, { DatabaseType } from "../Database";

export class TransactionsRepository {
  private database: DatabaseType;
  private tableName: String = "transactions";

  constructor() {
    this.database = db;
  }

  getAll(): Transaction[] {
    const stmt = this.database.prepare(
      `SELECT * FROM ${this.tableName} ORDER BY date DESC`
    );

    const rows = stmt.all() as Transaction[];

    return rows;
  }
}
