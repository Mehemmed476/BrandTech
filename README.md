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

## Newsletter email setup

Apply Prisma schema changes before starting a deployment:

```bash
npm run db:push
```

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
and `MAIL_FROM` in the environment. `NEXT_PUBLIC_APP_URL` must be the public
site URL so unsubscribe links in emails point to the correct domain.

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
