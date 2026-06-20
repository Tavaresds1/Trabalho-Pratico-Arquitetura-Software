# Sistema Acadêmico — Arquitetura de Microsserviços

Projeto acadêmico que demonstra uma arquitetura de microsserviços completa com API Gateway, dois serviços independentes, bancos de dados isolados e front-end React.

---

## Arquitetura

```
Browser (React :5173)
        │
        │  HTTP — todas as chamadas vão para o gateway
        ▼
┌─────────────────────────────┐
│       API Gateway :3000      │  ← único ponto de entrada
│  cors · logger · proxy       │
└──────────┬──────────┬───────┘
           │          │
    /api/alunos   /api/cursos
           │          │
    ┌──────▼──┐  ┌────▼──────┐
    │ms-alunos│  │ ms-cursos │
    │  :3001  │  │   :3002   │
    └──────┬──┘  └────┬──────┘
           │          │
    ┌──────▼──┐  ┌────▼──────┐
    │ postgres│  │ postgres  │
    │ alunos  │  │  cursos   │
    │  :5432  │  │   :5433   │
    └─────────┘  └───────────┘
```

Cada microsserviço tem seu próprio banco de dados (padrão *Database per Service*). Eles não compartilham dados, apenas a rede interna do Docker.

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclui Docker Compose)
- [Node.js 20+](https://nodejs.org/) — apenas para rodar o front-end localmente

---

## Como rodar

### 1. Subir o back-end completo

```bash
docker compose up --build
```

O `--build` garante que as imagens sejam reconstruídas com o código atual. Na primeira execução, o Docker vai baixar as imagens base e instalar as dependências.

Serviços disponíveis após o boot:

| Serviço | URL |
|---|---|
| API Gateway | http://localhost:3000 |
| Microsserviço Alunos | http://localhost:3001 *(interno)* |
| Microsserviço Cursos | http://localhost:3002 *(interno)* |
| pgAdmin | http://localhost:8080 |
| PostgreSQL Alunos | localhost:5432 |
| PostgreSQL Cursos | localhost:5433 |

> O pgAdmin já vem pré-configurado com os dois bancos. Login: `admin@admin.com` / senha: `admin`.

### 2. Subir o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse em **http://localhost:5173**.

---

## Estrutura do projeto

```
.
├── docker-compose.yml
├── pgadmin/
│   └── servers.json              # conexões pré-configuradas no pgAdmin
├── backend/
│   ├── api-gateway/              # porta 3000 — único ponto de entrada
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.js          # rotas de proxy + CORS
│   │       └── middleware/
│   │           ├── logger.js     # loga método, rota e tempo de resposta
│   │           └── errorHandler.js  # retorna 503 quando serviço cai
│   ├── ms-alunos/                # porta 3001
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.js
│   │       ├── config/database.js
│   │       ├── models/Aluno.js
│   │       └── routes/alunos.js
│   └── ms-cursos/                # porta 3002
│       ├── Dockerfile
│       ├── package.json
│       └── src/
│           ├── index.js
│           ├── config/database.js
│           ├── models/Curso.js
│           └── routes/cursos.js
└── frontend/                     # React + Vite, porta 5173
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── services/
        │   ├── api.js            # Axios → gateway (nunca direto para 3001/3002)
        │   ├── alunosService.js
        │   └── cursosService.js
        └── components/
            ├── Header.jsx
            ├── Alert.jsx
            ├── AlunosSection.jsx
            └── CursosSection.jsx
```

---

## Endpoints da API

Todas as requisições passam pelo API Gateway em `http://localhost:3000`.

### Alunos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/alunos` | Lista todos os alunos. Aceita `?nome=` para filtro. |
| `GET` | `/api/alunos/:id` | Busca aluno por ID. |
| `POST` | `/api/alunos` | Cadastra novo aluno. |

**Body para POST:**
```json
{
  "nome": "Maria da Silva",
  "matricula": "2024001",
  "email": "maria.silva@uni.edu.br"
}
```

### Cursos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/cursos` | Lista todos os cursos. Aceita `?nome=` e `?departamento=`. |
| `GET` | `/api/cursos/:id` | Busca curso por ID. |
| `POST` | `/api/cursos` | Cadastra novo curso. |

**Body para POST:**
```json
{
  "nome": "Ciência da Computação",
  "carga_horaria": 3200,
  "departamento": "Engenharia de Software"
}
```

---

## Comportamento do Gateway

**Logs de requisição** — cada chamada é registrada no stdout com método, rota, status HTTP e tempo de resposta:

```
[2026-06-20T20:00:00.000Z] [INFO]  GET /api/alunos    | status=200 | tempo=42.17ms
[2026-06-20T20:00:01.000Z] [ERROR] POST /api/cursos   | status=503 | tempo=5001.02ms
```

**Erro 503** — quando um microsserviço interno está indisponível, o gateway retorna:

```json
{
  "status": "error",
  "code": 503,
  "message": "Servico temporariamente indisponivel.",
  "detail": "Microsservico de Alunos (porta 3001) nao esta respondendo.",
  "timestamp": "2026-06-20T20:00:01.000Z"
}
```

Para simular: `docker stop ms-alunos` e tente cadastrar ou listar alunos no front-end.

---

## Comandos úteis

```bash
# Ver logs de todos os serviços em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f api-gateway
docker compose logs -f ms-alunos

# Ver status dos containers
docker compose ps

# Parar tudo
docker compose down

# Parar e apagar volumes (banco zerado)
docker compose down -v

# Reconstruir apenas um serviço
docker compose up --build api-gateway
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite |
| API Gateway | Node.js + Express + http-proxy-middleware |
| Microsserviços | Node.js + Express + Sequelize |
| Banco de dados | PostgreSQL 16 |
| Containerização | Docker + Docker Compose |
| ORM | Sequelize 6 |
