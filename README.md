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

---

## 💾 Milestone 3 – Implementação do Cache (better-sqlite3)

**Objetivo:** Criar cache local para reduzir chamadas ao Google Sheets e otimizar desempenho.

### Tarefas

- [ ] Criar banco `cache.db` com tabelas:
- [] Criar mapenamento dos nomes das colunas da planilha pt/en en/pt (No código o padrão de nome das variáveis é em inglês, logo, será preciso mapear, já que vem da planilha em português.)
- `entries` (id, date, description, category, value, type, status)
- `categories` (id, name)
- `sync_info` (last_sync_timestamp)
- [ ] Criar `Repository` para operações SQLite.
- [ ] Implementar função `cacheIsValid()`:
- Retorna `true` se último sync tiver menos de 2 dias.
- [ ] Implementar método para atualizar cache após inserção, edição ou exclusão.
- [ ] Garantir que o cache é a principal fonte de dados das rotas.

---

## 🧠 Milestone 4 – Camadas de Abstração (Repository → Service → Route)

**Objetivo:** Estruturar arquitetura limpa para isolar regras de negócio e persistência.

### Tarefas

- [ ] Criar classes:
- `EntryRepository` e `CategoryRepository` (SQLite)
- `EntryService` e `CategoryService` (regras de negócio)
- [ ] Rotas API (`/api/entries`, `/api/categories`) chamam somente _services_.
- [ ] Implementar validação e tratamento de erros centralizado.
- [ ] Criar middlewares utilitários (ex: `handleApiError`).

---

## 💻 Milestone 5 – Frontend (Dashboard + Formulários)

**Objetivo:** Criar as 3 páginas principais do sistema.

### Páginas

1. **Dashboard**

- [ ] Resumo de entradas, saídas e balanço.
- [ ] Gráfico de evolução (Recharts).
- [ ] Lista de despesas previstas (mês seguinte).

2. **Nova Entrada**

- [ ] Formulário com campos:
  - Data
  - Descrição
  - Categoria
  - Tipo (Entrada/Saída)
  - Status (Pago/Pendente)
- [ ] Envio para `/api/entries` (POST).
- [ ] Validação com Zod e feedback visual.

3. **Categorias**

- [ ] CRUD completo.
- [ ] Botões de editar/deletar.
- [ ] Atualização imediata do cache.

---

## 🧰 Milestone 6 – Sincronização e Validação do Cache

**Objetivo:** Implementar mecanismo automático de atualização entre Sheets ↔ Cache.

### Tarefas

- [ ] Função `syncWithGoogleSheets()`:
- Atualiza cache completo.
- Atualiza `sync_info` com timestamp.
- [ ] Rodar sincronização:
- Após inserção/edição/exclusão.
- Quando `cacheIsValid()` retornar `false`.
- [ ] Criar botão manual “Sincronizar agora” no Dashboard.

---

## 🧪 Milestone 7 – Testes e Refinamentos

**Objetivo:** Garantir estabilidade, confiabilidade e performance.

### Tarefas

- [ ] Criar testes unitários (Jest) para services e repositories.
- [ ] Criar testes de integração para rotas API.
- [ ] Revisar UX e layout responsivo.
- [ ] Ajustar mensagens de erro e validações.
- [ ] Revisar logs e tratamento de falhas de rede.

---

## 🧱 Milestone 8 – Deploy e Documentação

**Objetivo:** Publicar o projeto e garantir que outros desenvolvedores possam contribuir.

### Tarefas

- [ ] Criar documentação (`README.md` e `API_DOCS.md`).
- [ ] Deploy no Vercel.
- [ ] Testar ambiente de produção com cache ativo.
- [ ] Adicionar badge de build/status no GitHub.
- [ ] Publicar versão `v1.0.0`.

---

## 🕐 Cronograma Estimado

| Milestone                   | Duração Estimada | Status |
| --------------------------- | ---------------- | ------ |
| 1. Estruturação do Projeto  | 2 dias           | 🔜     |
| 2. Integração Google Sheets | 3 dias           | 🔜     |
| 3. Cache SQLite             | 3 dias           | 🔜     |
| 4. Camadas de Abstração     | 2 dias           | 🔜     |
| 5. Frontend                 | 5 dias           | 🔜     |
| 6. Sincronização            | 2 dias           | 🔜     |
| 7. Testes e Refinamentos    | 3 dias           | 🔜     |
| 8. Deploy e Documentação    | 2 dias           | 🔜     |

---

## 🧩 Observações Finais

- O foco inicial é **funcionalidade + arquitetura limpa**.
- O design pode ser aprimorado em versões futuras.
- A estrutura de camadas (Repository → Service → Route) garantirá que, futuramente, seja simples substituir o Google Sheets por um banco real (ex: PostgreSQL).

---

## 🏁 Próximos Passos

1. Criar repositório GitHub.
2. Iniciar **Milestone 1 – Estruturação do Projeto**.
3. Documentar decisões técnicas no repositório (`docs/`).
