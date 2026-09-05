# বিধাপীঠ — Production deployment

## Architecture

- Next.js App Router (frontend + server actions + API)
- PostgreSQL (production) / SQLite (local demo)
- Prisma schema is the canonical data model (`prisma/schema.prisma`)
- Runtime ORM: Drizzle (SQLite now; switch dialect for PostgreSQL)
- Auth: signed JWT httpOnly cookie + server session table
- Tenant identity: session `schoolId` and verified hostname — never from request body
- Payments: provider interface (`demo`, bKash, Nagad, SSLCommerz) with idempotent webhooks
- SMS: provider interface + credit ledger + queue

## Vercel

This app can run on Vercel (Node.js serverless) with a bundled demo SQLite database copied to `/tmp` on first request. That demo data is **ephemeral** (resets when the serverless instance is recycled).

For a real production tenant store, set `DATABASE_URL` to PostgreSQL (Neon / Vercel Postgres) and switch the Drizzle dialect.

One-click import:

```
https://vercel.com/new/clone?repository-url=https://github.com/nayemhossinshakib-del/BIDHAPITH-
```

Required environment variables on Vercel:

- `AUTH_SECRET` — long random string
- `DEMO_MODE=true` (optional, shows demo logins)
- `NEXTAUTH_URL` — `https://your-domain.vercel.app`

## Environment

Copy `.env.example` and set secrets. Never commit `.env`.

Required:

- `DATABASE_URL`
- `AUTH_SECRET` (long random)
- `NEXTAUTH_URL` / public origin
- `BASE_DOMAIN`

## Database

Local demo:

```bash
npm run db:push
npm run db:seed
```

Production PostgreSQL:

1. Change Drizzle dialect / Prisma `provider` to `postgresql`
2. Run migrations
3. Enable daily backups and PITR on the managed database
4. Store uploads in object storage (`STORAGE_*`)

## Custom domains

1. School submits domain
2. Platform returns CNAME (`www` → `DNS_CNAME_TARGET`) and TXT verification token
3. After DNS check, status `ACTIVE` and SSL is provisioned at the edge (Vercel / Caddy / nginx)
4. Proxy maps verified host → tenant. Unverified Host headers are ignored.

## Security checklist

- Tenant queries always include `schoolId` from session
- Webhooks verify amount server-side
- SMS deducts credits in a transaction
- File uploads: JPG/PNG/PDF/WEBP, size limits, stored outside public web root
- Rate limits on login, SMS, admission, upload
- Super Admin impersonation is audited and bannered

## Demo credentials (development only)

Password: `Demo@1234`

- Super Admin: `admin@bidhapith.test`
- School Admin: `admin@abcschool.test`
- Teacher: `teacher@abcschool.test`
- Accountant: `accountant@abcschool.test`
- Student: `student@abcschool.test`

Do not ship these in production.
