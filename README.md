# Next Boilerplate

A modern Next.js boilerplate designed for rapid development with a robust stack built-in.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Dockerized)
- **Caching**: Redis (Dockerized)
- **Email/SMTP**: Nodemailer + Handlebars (Templates in `src/templates/`)
- **Local Mail Testing**: Mailpit (Dockerized)
- **Package Manager**: pnpm

## 📦 Getting Started

### 1. Prerequisites

Make sure you have installed on your machine:
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (Required for local DB, Redis, and Mailpit services)

### 2. Automatic Setup (Recommended)

We provide an interactive script that automatically configures your environment. Run the following command in your terminal:

```bash
./scripts/setup.sh
```

The script will automatically:
1. Initialize your `.env` file based on `.env.example`.
2. Install all dependencies using `pnpm`.
3. Ask if you want to run **Docker Compose** to spin up PostgreSQL, Redis, and Mailpit locally.
4. Generate the Prisma Client and sync the schema to your database.

### 3. Manual Setup

If you prefer setting up manually without the script:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Start Docker services (Postgres, Redis, Mailpit):
   ```bash
   docker compose up -d
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Setup Database:
   ```bash
   pnpm prisma:generate
   pnpm prisma:push
   ```

## 🛠️ Development

To start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

### Useful Commands

- `pnpm dev` - Start the Next.js development server.
- `pnpm build` - Build the app for production.
- `pnpm start` - Start the production server.
- `pnpm lint` - Run ESLint.
- `pnpm format` - Run Prettier to format code.
- `pnpm prisma:studio` - Open Prisma Studio on port 5555 to manage database records visually.

## 📧 Email Templates & Mailpit

Email templates are located in `src/templates/` and use **Handlebars** syntax (`.hbs`). 

During local development, all outgoing emails are intercepted by **Mailpit** so you don't spam real addresses. You can inspect caught emails by opening the Mailpit Web UI at:
👉 **[http://localhost:8025](http://localhost:8025)**

## 🐳 Docker Deployment

A highly-optimized `Dockerfile` using multi-stage builds is included for deploying to production. 

```bash
docker build -t next-boilerplate .
docker run -p 3000:3000 next-boilerplate
```
*(Make sure to supply production environment variables such as `DB_HOST=postgres` when orchestrating with Docker).*
