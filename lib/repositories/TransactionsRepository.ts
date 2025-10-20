import db, { DatabaseType } from "../Database";
import { ExpenseStatus, Transaction, TransactionFilters } from "@/types";
import { ExecOptionsWithBufferEncoding } from "child_process";
import { STATUS_DB_TO_CODE, TYPE_DB_TO_CODE } from "@/constants/db-mapping";

export class TransactionsRepository {
  private database: DatabaseType;
  private tableName: String = "transactions";

  constructor() {
    this.database = db;
  }

  getAll(filters: TransactionFilters): Transaction[] {
  let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
  const params: (string | number)[] = [];


  

  if (filters.month) {
    sql += ` AND STRFTIME('%m', date) = ?`;
    params.push(filters.month.toString().padStart(2, '0')); // garante formato 01, 02, etc.
  } else {
    const currentMonth = new Date().getMonth() + 1;
    sql += ` AND STRFTIME('%m', date) = ?`;
    params.push(currentMonth.toString().padStart(2, '0'));
  }

  if (filters.year) {
    sql += ` AND STRFTIME('%Y', date) = ?`;
    params.push(filters.year.toString());
  } else {
    const currentYear = new Date().getFullYear();
    sql += ` AND STRFTIME('%Y', date) = ?`;
    params.push(currentYear.toString());
  }

  if (filters.type) {
    const types = { expense: 'Saída', income: 'Entrada' };
    const type = types[filters.type];
    if (type) {
      sql += ` AND type = ?`;
      params.push(type);
    }
  }
  if(filters.category) {
    sql += ` AND category = ? COLLATE NOCASE`;
    params.push(filters.category);
  }
 
  if (filters.status) {
    const statusMap: Record<ExpenseStatus, 'Pendente'|'Pago'> = {
      pending: 'Pendente',
      paid: 'Pago',
  } 
   const status = statusMap[filters.status]
    sql += ` AND status = ?`;
    params.push(status);
  }


  const stmt = this.database.prepare(sql);
  const rows = stmt.all(params) as Transaction[];

  const mappedRows = rows.map((row) => ({
      ...row,
      type: TYPE_DB_TO_CODE[row.type as keyof typeof TYPE_DB_TO_CODE] ,
      status: STATUS_DB_TO_CODE[row.status as keyof typeof STATUS_DB_TO_CODE],
    }));

    return mappedRows;
}

}
