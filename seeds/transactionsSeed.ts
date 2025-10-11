// src/seeds/transactionsSeed.ts

import db, { DatabaseType } from "../lib/Database";
import { TransactionSchema, Transaction } from "../schemas/transactions-schema"; // Ajuste o caminho conforme necessário

const transactionsSeedData: Transaction[] = [
  {
    id: "1",
    date: "2025-10-11",
    description: "Salário Mensal",
    category: "Trabalho",
    value: 3500.0, // Use .00 para clareza
    type: "Entrada",
    status: "Pago",
  },
  {
    id: "2",
    date: "2025-10-05",
    description: "Conta de Luz",
    category: "Moradia",
    value: 220.5,
    type: "Saída",
    status: "Pago",
  },
  {
    id: "3",
    date: "2025-10-07",
    description: "Jantar com a família",
    category: "Alimentação",
    value: 180.0,
    type: "Saída",
    status: "Pendente",
  },
];

/**
 * Executa a inserção dos dados de teste na tabela 'transactions'.
 * Garante que os dados são válidos usando o Zod Schema.
 * @param database A instância do banco de dados.
 */
function seedTransactions(database: DatabaseType) {
  console.log("--- Iniciando Seed de Transações ---");
  let insertedCount = 0;

  // 1. Preparar a query de inserção
  // Usamos INSERT OR REPLACE INTO para que o script possa ser rodado várias vezes sem erro
  const insertStmt = database.prepare(`
        INSERT OR REPLACE INTO transactions (
            id, date, description, category, value, type, status
        ) VALUES (
            @id, @date, @description, @category, @value, @type, @status
        );
    `);

  // 2. Iniciar uma transação para garantir que todas as inserções sejam atômicas (sucesso ou falha total)
  const insertMany = database.transaction((transactions: Transaction[]) => {
    for (const transaction of transactions) {
      try {
        // 3. Validação do Zod
        TransactionSchema.parse(transaction);

        // 4. Executar a inserção
        insertStmt.run(transaction);
        insertedCount++;
      } catch (e) {
        console.error(
          `❌ Erro ao validar/inserir transação com ID ${transaction.id}:`,
          e
        );
        // Continua para o próximo item, mas idealmente uma transação falharia aqui
      }
    }
  });

  // 5. Executar a transação com os dados de seed
  insertMany(transactionsSeedData);

  console.log(
    `✅ Seed concluído. Total de ${insertedCount} transações inseridas/atualizadas.`
  );
}

// 6. Função de execução principal para o script
function runSeedScript() {
  try {
    seedTransactions(db);
  } catch (error) {
    console.error("❌ Falha crítica ao executar o script de seed:", error);
    process.exit(1);
  } finally {
    db.close();
    console.log("Conexão com o DB fechada.");
  }
}

// Executa o script
runSeedScript();
