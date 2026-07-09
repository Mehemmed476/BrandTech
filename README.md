# Brand Technology

Production-ready Next.js ecommerce foundation.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9
- Prisma
- PostgreSQL
- npm

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run docker:up
npm run docker:down
```

## Docker

This project is configured for standalone Next.js output and includes a production Dockerfile plus Docker Compose for the app and PostgreSQL.

```bash
npm run docker:up
npm run docker:down
```

## Structure

```text
src/
  app/       App Router layouts and future routes
  shared/    Shared components, hooks, utilities, services, and types
  features/  Feature modules
  entities/  Domain entities
  widgets/   Composed feature blocks
  config/    Application configuration
  styles/    Global styles and design tokens
```
