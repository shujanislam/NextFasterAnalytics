# NextFaster Analytics

A simple internal analytics dashboard for **NextFaster**.  
Built with **Next.js (App Router)**, **TailwindCSS**, and **PostgreSQL**.

## Features

- Dashboard-style UI (simple, minimal styling)
- Total users count
- Active users (last 24 hours) based on `last_login_at`
- Logged-out users (last 24 hours) based on `last_logout_at`
- Data fetched server-side using Postgres queries

## Tech Stack

- Next.js (App Router)
- TailwindCSS
- PostgreSQL
- `pg` (node-postgres)

## Getting Started

### 1) Install dependencies
```bash
npm install
# or pnpm install
# or yarn
```

### 22) Configure environment variables

Create a .env.local file in the project root:

```bash
POSTGRES_USER=your_user
POSTGRES_HOST=localhost
POSTGRES_DB=your_db
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432
POSTGRES_MAX=10
POSTGRES_IDLE_TIMEOUT=30000
POSTGRES_CONNECTION_TIMEOUT=5000
POSTGRES_KEEP_ALIVE=true
```

### 4) Run the server

```bash 
pnpm dev
```

### Database
This project expects a table similar to:

```sql
CREATE TABLE users_metrics (
  id BIGINT PRIMARY KEY,
  username TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL,
  last_login_at TIMESTAMPTZ,
  last_logout_at TIMESTAMPTZ
);

```

## Credits

Based on **NextFaster** by:
- [@ethanniser](https://x.com/ethanniser)
- [@RhysSullivan](https://x.com/RhysSullivan)
- [@armans-code](https://x.com/ksw_arman)

