# 🧙 RPG API
## API desenvolvida com NestJS para um sistema de RPG

## 📦 Requisitos
Node.js

Docker

pnpm (ou npm)

## 🚀 Como rodar o projeto
1. Clone o repositório
```bash
git clone https://github.com/oLuqueJs/rpg_api.git
cd rpg_api
```

2. Configure o arquivo .env
Copie o arquivo de exemplo:

```bash
cp .env.example .env
```
Edite a variável DATABASE_URL com a URL de conexão com as credenciais do docker compose:

env
```
DATABASE_URL="postgresql://postgres:basicpass@localhost:5432/postgres"
```
3. Suba o banco de dados com Docker
```bash
docker-compose up -d
```
Postgres na porta 5432.

4. Instale as dependências
```bash
pnpm install 
# ou
npm install
```
5. Execute as migrações Prisma (caso o schema já esteja pronto)
```bash
npx prisma migrate dev
```
6. Rode o projeto
```bash
pnpm start:dev
# ou
npm run start:dev
```

A aplicação estará disponível em:

http://localhost:8000

## 📖 Acessar a documentação Swagger
Acesse a documentação da API no navegador:

http://localhost:8000/docs