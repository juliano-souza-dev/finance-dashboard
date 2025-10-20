import  bcrypt  from 'bcrypt'

import { UsersRepository } from "@/lib/repositories/UsersRepository";
import db from "../lib/Database";
import { TransactionSchema, Transaction } from "../schemas/transactions-schema"; // Ajuste o caminho conforme necessário
import { randomUUID } from 'crypto';
import { User } from '@/types';
const database = db;
const transactionsSeedData: Transaction[] = [
  {
    id: "1",
    date: "2025-10-10",
    description: "Salário Mensal",
    category: "Trabalho",
    value: 3500.0, // Use .00 para clareza
    type: "Entrada",
    status: "Pago",
  },
  {
    id: "2",
    date: "2025-10-10",
    description: "Conta de Luz",
    category: "Moradia",
    value: 220.5,
    type: "Saída",
    status: "Pago",
  },
  {
    id: "3",
    date: "2025-10-10",
    description: "Jantar com a família",
    category: "Alimentação",
    value: 180.0,
    type: "Saída",
    status: "Pendente",
  },
  {
  id: "4",
  date: "2025-10-11",
  description: "Almoço no restaurante",
  category: "Alimentação",
  value: 95.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "5",
  date: "2025-10-12",
  description: "Compras no supermercado",
  category: "Alimentação",
  value: 310.4,
  type: "Saída",
  status: "Pago",
},
{
  id: "6",
  date: "2025-10-13",
  description: "Lanche com as crianças",
  category: "Alimentação",
  value: 47.5,
  type: "Saída",
  status: "Pendente",
},
{
  id: "7",
  date: "2025-10-14",
  description: "Padaria",
  category: "Alimentação",
  value: 26.8,
  type: "Saída",
  status: "Pago",
},
{
  id: "8",
  date: "2025-10-15",
  description: "Jantar delivery de pizza",
  category: "Alimentação",
  value: 92.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "9",
  date: "2025-10-16",
  description: "Compra de carnes para churrasco",
  category: "Alimentação",
  value: 186.9,
  type: "Saída",
  status: "Pendente",
},
{
  id: "10",
  date: "2025-10-17",
  description: "Café da manhã fora",
  category: "Alimentação",
  value: 38.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "11",
  date: "2025-10-18",
  description: "Açaí com amigos",
  category: "Alimentação",
  value: 27.9,
  type: "Saída",
  status: "Pago",
},
{
  id: "12",
  date: "2025-10-19",
  description: "Hambúrguer artesanal",
  category: "Alimentação",
  value: 58.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "13",
  date: "2025-10-20",
  description: "Almoço por quilo",
  category: "Alimentação",
  value: 42.5,
  type: "Saída",
  status: "Pago",
},
{
  id: "14",
  date: "2025-10-21",
  description: "Jantar em família",
  category: "Alimentação",
  value: 165.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "15",
  date: "2025-10-22",
  description: "Compras de frutas e verduras",
  category: "Alimentação",
  value: 98.3,
  type: "Saída",
  status: "Pago",
},
{
  id: "16",
  date: "2025-10-23",
  description: "Lanche rápido",
  category: "Alimentação",
  value: 23.0,
  type: "Saída",
  status: "Pendente",
},
{
  id: "17",
  date: "2025-10-24",
  description: "Refeição no shopping",
  category: "Alimentação",
  value: 79.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "18",
  date: "2025-10-25",
  description: "Sushi em casal",
  category: "Alimentação",
  value: 134.5,
  type: "Saída",
  status: "Pago",
},
{
  id: "19",
  date: "2025-10-26",
  description: "Compras na feira livre",
  category: "Alimentação",
  value: 75.7,
  type: "Saída",
  status: "Pago",
},
{
  id: "20",
  date: "2025-10-27",
  description: "Padaria e leite",
  category: "Alimentação",
  value: 32.0,
  type: "Saída",
  status: "Pago",
},
{
  id: "21",
  date: "2025-10-28",
  description: "Pizza delivery",
  category: "Alimentação",
  value: 89.9,
  type: "Saída",
  status: "Pendente",
},
{
  id: "22",
  date: "2025-10-29",
  description: "Compras do mês",
  category: "Alimentação",
  value: 482.3,
  type: "Saída",
  status: "Pago",
},
{
  id: "23",
  date: "2025-10-30",
  description: "Pagode",
  category: "Alimentação",
  value: 35.5,
  type: "Entrada",
  status: "Pago",
},


];

const testUser: User = {
        id: randomUUID(), 
        name: "Usuário Teste",
        email:   "user@test.com",
        password:  await bcrypt.hash('password123', 10)
    };
/**
 * Executa a inserção dos dados de teste na tabela 'transactions'.
 * Garante que os dados são válidos usando o Zod Schema.
 * @param database A instância do banco de dados.
 */
function seedTransactions() {
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

async function seedTestUser() {
   console.log("--- Iniciando Seed de Usuários ---");

const stmt = database.prepare(`
        INSERT OR REPLACE INTO users (
            id, name, email, password
        ) VALUES (
            @id, @name, @email, @password
        );
    `)
    stmt.run(testUser)

  
}
// 6. Função de execução principal para o script
function runSeedScript() {
  try {
    seedTransactions();
    seedTestUser()
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
