## 🧩 Milestone 1 – Configurações e configuração do primeiro repository (Transactions)

**Objetivo:** Instalar as dependências essencias para o desenvolvimento do projeto, configurar o banco de dados e criar o primeiro repositório e configurar o google sheets (Apenas configuração inicial)

### Tarefas

- [x] Instalar dependências:
- `better-sqlite3`
- `googleapis`
- `dotenv`
- `zod` (validação)
- `date-fns`
- `recharts` (gráficos)
- [x] Criar `.env.local` e configurar variáveis do Google Sheets.
- [x] iniciar repositório do github
- [] Configurar env para validação com ZOD
- [x] Criar lib `google-sheet-api.ts` para autenticação e acesso.
- [x] Configurar banco de dados e criar as primeiras tabelas.

## 🧩 Milestone 2 – Seeds e rota GET transactions

**Objetivo:** Popular o banco de dados com dados iniciais (seeds) e disponibilizar uma rota pública GET /transactions que retorne todas as transações financeiras cadastradas, permitindo testes e visualização dos dados diretamente via API.

### Tarefas

- [x] Criar a pasta seeds/
- [x] Criar o arquivo transactionsSeed.ts
- [x] Garantir que exista um banco de dados SQLite (ex: data/database.db)
- [x] Criar service Transaction com o método Execute();
- [x] Confirmar que a tabela transactions já está criada (via migration ou manualmente)
- [x] Criar o schema de validação (schemas/transactions-schema.ts)
      date: string
      description: string
      category: string
      value: number
      type: "Entrada" | "Saída"
      status: "Pago" | "Pendente"
- [x] Validar os dados do seed com o TransactionSchema antes da inserção
- [x] Criar um array transactionsSeedData
      const transactionsSeedData = [
      {
      id: "1",
      date: "2025-10-11",
      description: "Salário Mensal",
      category: "Trabalho",
      value: 3500,
      type: "Entrada",
      status: "Pago"
      },
      {
      id: "2",
      date: "2025-10-05",
      description: "Conta de Luz",
      category: "Moradia",
      value: 220,
      type: "Saída",
      status: "Pago"
      },
      {
      id: "3",
      date: "2025-10-07",
      description: "Jantar com a família",
      category: "Alimentação",
      value: 180,
      type: "Saída",
      status: "Pendente"
      }
      ]
- [x] Adicionar script no package.json para rodar os seeds

## 🧩 Milestone 3 – Autenticação e Users

Objetivo:
Adicionar segurança ao projeto implementando autenticação. Todas as rotas protegidas devem exigir login, e será possível criar usuários que serão salvos no banco de cache. Além disso, o banco de dados será atualizado para incluir a tabela users.

### Tarefas

- [x] Modificar arquivo db para incluir a tabela users:
  id (string, primary key)
  name (string)
  email (string, único)
  password (string, hash)

- [x] Helper de Autenticação (lib/auth-helper.ts)
  Criar uma função utilitária getAuthenticatedUser() para buscar a sessão (usando getServerSession) e garantir que o usuário está logado.
  Se a sessão for nula, lançar um erro 401 (Não Autorizado).
- [x] Na app/api/transactions/route.ts chamar o getAuthenticatedUser() para aplicar a proteção 401
- [x] Teste de Proteção da Rota
