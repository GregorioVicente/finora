# Finora

SaaS de gestão financeira com dashboard, importação de extratos CSV, categorização automática e visualização de dados.

## Stack

- Frontend: React 19, TypeScript, Vite, Recharts e Lucide
- Backend: Java 21, Spring Boot 3.5, Spring Data JPA e H2
- Infra local: Docker Compose

## Executar com Docker

```bash
cp .env.example .env
# Defina JWT_SECRET no arquivo .env
docker compose up --build
```

Acesse `http://localhost:5173`. A API fica em `http://localhost:8080/api` e o console H2 em `http://localhost:8080/h2-console`.

## Executar em desenvolvimento

Backend (requer Maven 3.9+ e Java 21+):

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## CSV aceito

Cabeçalhos reconhecidos (maiúsculas/minúsculas são ignoradas):

```csv
data,descricao,valor,categoria
2026-08-01,Salário,8500.00,Renda
2026-08-03,Supermercado Central,-452.37,Alimentação
```

Também são aceitos `date`, `description`, `amount` e `category`, separadores vírgula ou ponto-e-vírgula e datas `dd/MM/yyyy` ou `yyyy-MM-dd`. Valores negativos são despesas e positivos são receitas. A categoria é opcional.

## API

- `GET /api/dashboard?month=YYYY-MM` — resumo, categorias e evolução mensal
- `GET /api/transactions?month=YYYY-MM` — lista transações
- `POST /api/transactions/import` — importa CSV via `multipart/form-data` no campo `file`
- `PATCH /api/transactions/{id}/category` — altera categoria (`{"category":"Moradia"}`)
- `DELETE /api/transactions/{id}` — exclui transação
- `POST /api/auth/register` — cria a conta com e-mail e senha e retorna o JWT
- `POST /api/auth/login` — autentica e retorna um token JWT
- `GET /api/budgets?month=YYYY-MM` — lista limites e valores utilizados
- `POST /api/budgets` — cria ou atualiza um limite por categoria
- `DELETE /api/budgets/{id}` — remove um planejamento

Os endpoints financeiros exigem `Authorization: Bearer <token>`. A conta inicial para teste é `demo@finora.com`, senha `demo123`. Em produção, defina a variável `JWT_SECRET` com um segredo forte e exclusivo.

O cadastro é imediato e requer apenas e-mail e senha. Não há integração com serviço de envio de e-mail.

Para lançamentos manuais, use **Transações → Novo lançamento**. É possível inserir receita ou despesa, data, descrição, valor e categoria.
