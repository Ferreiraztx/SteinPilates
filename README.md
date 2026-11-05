# Stein Pilates

Painel de gestão de estúdio construído com React, Vite, API Node.js e Prisma ORM.

## Executar em desenvolvimento

```bash
npm install
npx prisma migrate dev
npm run dev
```

O comando inicia o frontend Vite em `http://localhost:5173` e a API em `http://localhost:3001`.

Antes de executar, copie `.env.example` para `.env` e defina uma senha forte em
`ADMIN_PASSWORD`. O painel exige login e as rotas `/api/*` protegidas usam sessão,
cookie CSRF e CORS restrito. Em desenvolvimento, o frontend acessa a API pelo
proxy `/api`, sem expor uma URL de API diferente no navegador.

## Produção

```bash
npm run build
npm run api
```

Depois do build, a API também entrega os arquivos estáticos pelo endereço `http://localhost:3001`.

O banco SQLite é criado em `data/stein-pilates.db`. O schema está em [prisma/schema.prisma](./prisma/schema.prisma), e os dados iniciais são carregados pelo seed do Prisma.

As páginas do painel ficam separadas em `src/pages`, os modais reutilizáveis em
`src/components` e o dispatcher das rotas protegidas da API em
`server/routes/api.routes.js`. O `server.js` permanece responsável apenas pelo
bootstrap HTTP, segurança, arquivos estáticos e registro do dispatcher.
