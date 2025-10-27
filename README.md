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


## 🧩 Milestone 4 – Integração Completa de Autenticação (Users + Frontend)

🎯 Objetivo

Conectar totalmente o sistema de autenticação, garantindo que o NextAuth.js utilize o banco de dados de usuários e que o frontend possa realizar login real.
Essa milestone consolida o fluxo completo: usuário → login → sessão → requisições autenticadas.

### Tarefas

- [x] Configuração do Adaptador/Callbacks (NextAuth.js)
    Implementar callbacks no authOptions (arquivo app/api/auth/[...nextauth]/route.ts) para injetar user.id e user.email no token JWT e na sessão.

- [x] Repositório de Usuários (repository/UsersRepository.ts)
Criar o repositório responsável por consultar o banco de usuários, com o método getUserByEmail(email: string).

- [x] Service de Usuários (service/UsersService.ts)
      Implementar o método de login, usando bcrypt para validar as credenciais contra o hash salvo no banco.
- [x] Conectar  o Service ao NextAuth.js

- [x] Página de Login (app/login/page.tsx)
     Criar uma página de login simples (Client Component) que utilize signIn('credentials', ...) do next-auth/react.

## 🧩Milestone 5 — Estrutura Visual e Organização de Rotas

🎯 Objetivo 

Dar o primeiro passo visual e estrutural do sistema: criar os grupos de páginas, implementar o layout visual inicial da dashboard e aplicar uma estilização profissional à página de login.

### Tarefas

- [x] Estilização da página de login
- [x] Criação dos grupos de páginas
- [x] Formatação inicial e primeiros components da dashboard.

## 🧩Milestone 5 — Estrutura Visual e Organização de Rotas

🎯 Objetivo 

Carregar os dados diretamente do cache (banco de dados sqlite) e assim, tornar os dados do dashboad.
Listar as entradas e saídas do mês corrente.


### Tarefas
- [x] Implementar o TransactionsService para recuperar os dados através do TransactionsRepository
- [x] implementar o uso de filtros (ano, mês, status, tipo, categoria)
- [x] recuperar o valor das entradas, saídas  eo balanço do mês corrente.
- [x] Listar os dados usando o componente ExpenseList


## Milestone 6 — Google Sheets Integration & Data Synchronization

🎯 Objetivo 

Conectar o sistema ao Google Sheets e criar o processo de sincronização de dados, garantindo que todas as transações sejam baixadas da planilha e armazenadas no cache local (SQLite).
Com isso, o dashboard passa a refletir dados reais da planilha, mantendo o desempenho local e a consistência dos registros.


### Tarefas
- [x] Criar o service GoogleSheetsService para lidar com a autenticação e comunicação com a API do Google Sheets.
- [x] Adicionar método fetchAll() para buscar todos os registros da planilha (aba Transactions).
- [x] Criar método saveToCache() no TransactionRepository para sincronizar os dados obtidos com o banco local (SQLite):
- [x] Criar rota app/api/sync/route.ts que permita sincronização manual via endpoint /api/sync
- [x] Listar os dados usando o componente ExpenseList
- [x] (Opcional -> fazer agora ou deixar para a proxima milestone) Automatizar a sincronização na inicialização da aplicação

## Milestone 7 — Transaction Form Integration + UX Improvements

### Tarefas
- [x] Criar o formulário para cadastro de novos registros
- [x] Corrigir erros no visual no dashboard
- [x] Conectar com o googlesheets e sincronizar
- [x] Atualizar o dashboard automaticamente a cada inserção.


## 🧩 Milestone 8 — Dynamic Filters for Transactions

🎯 Goal

Add dynamic filtering functionality to the Dashboard, allowing users to refine transactions by multiple criteria (Status, Month, Year, and Category).
This feature improves usability and provides a faster way to locate specific data directly within the interface.

✅ Tasks

- [x] Create a filter state to store active filter values (month, year).

- [x] Implement filter logic to dynamically update the displayed transactions.




