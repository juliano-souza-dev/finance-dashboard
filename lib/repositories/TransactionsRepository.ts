import db, { DatabaseType } from "../Database";
import { ExpenseStatus, Transaction, TransactionFilters } from "@/types";
import { STATUS_DB_TO_CODE, TYPE_DB_TO_CODE } from "@/constants/db-mapping";

export class TransactionsRepository {
  private database: DatabaseType;
  private tableName = "transactions";

  constructor() {
    this.database = db;
  }

  getAll(filters: TransactionFilters): Transaction[] {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params: (string | number)[] = [];

    // 🔹 Filtrar por ID
    if (filters.id) {
      sql += ` AND id = ?`;
      params.push(filters.id);
    }

    // 🔹 Filtrar por mês
    if (filters.month) {
      sql += ` AND STRFTIME('%m', date) = ?`;
      params.push(filters.month.toString().padStart(2, "0")); // garante formato 01, 02, etc.
    }

    // 🔹 Filtrar por ano
    if (filters.year) {
      sql += ` AND STRFTIME('%Y', date) = ?`;
      params.push(filters.year.toString());
    }

    // 🔹 Filtrar por tipo
    if (filters.type && ["expense", "income"].includes(filters.type)) {
      const typeMap = {
        expense: "Saída",
        income: "Entrada",
      } as const;

      const mappedType = typeMap[filters.type as keyof typeof typeMap];
      if (mappedType) {
        sql += ` AND type = ?`;
        params.push(mappedType);
      }
    }

    // 🔹 Filtrar por categoria
    if (filters.category) {
      sql += ` AND category = ? COLLATE NOCASE`;
      params.push(filters.category);
    }

    // 🔹 Filtrar por status (Pago / Pendente)
if (filters.status && ['pending', 'paid'].includes(filters.status)) {
  const statusMap = {
    pending: 'Pendente',
    paid: 'Pago',
  } as const;

  const mappedStatus = statusMap[filters.status as keyof typeof statusMap];
  if (mappedStatus) {
    sql += ` AND status = ?`;
    params.push(mappedStatus);
  }
}
    // 🔹 Executa a query
    const stmt = this.database.prepare(sql);
    const rows = stmt.all(params) as Transaction[];

    // 🔹 Normaliza os dados retornados
    const mappedRows = rows.map((row) => ({
      ...row,
      type: TYPE_DB_TO_CODE[row.type as keyof typeof TYPE_DB_TO_CODE],
      status: STATUS_DB_TO_CODE[row.status as keyof typeof STATUS_DB_TO_CODE],
    }));

    return mappedRows;
  }

  async saveToCache(transactions: Transaction[]) {
    this.clearAll();

    const stmt = this.database.prepare(`
      INSERT INTO ${this.tableName}
      (id, date, description, category, value, type, status)
      VALUES
      (@id, @date, @description, @category, @value, @type, @status)
    `);

    const insertMany = this.database.transaction((rows: Transaction[]) => {
      for (const row of rows) {
        stmt.run(row);
      }
    });

    insertMany(transactions);
  }

  private clearAll() {
    const stmt = db.prepare(`DELETE FROM ${this.tableName}`);
    stmt.run();
  }
}
