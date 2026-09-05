# বিধাপীঠ (Bidhapith)

বাংলাদেশি স্কুলগুলোর জন্য মাল্টি-টেন্যান্ট SaaS স্কুল ব্যবস্থাপনা প্ল্যাটফর্ম।

স্কুল ওয়েবসাইট, অনলাইন ভর্তি, ফি, SMS, RBAC এবং সুপার অ্যাডমিন কন্ট্রোল — এক প্ল্যাটফর্মে। লাইব্রেরি/হোস্টেল/পরিবহন মডিউল নেই।

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Demo logins (password `Demo@1234`)

| Role | Email |
| --- | --- |
| Super Admin | admin@bidhapith.test |
| School Admin (আদর্শ) | admin@abcschool.test |
| Teacher | teacher@abcschool.test |
| Accountant | accountant@abcschool.test |
| Student | student@abcschool.test |

Public school site: `/s/abc` and `/s/xyz`

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Drizzle ORM + better-sqlite3 (local) — Prisma schema included for PostgreSQL production
- Auth: httpOnly JWT session + server-side session table
- Zod validation, RBAC, tenant isolation
- Payment & SMS provider abstractions
- PWA manifest, Docker Compose

## Security rules

- Never trust `schoolId` / `userId` from the client
- Derive tenant from authenticated session or verified domain
- Payment amounts verified server-side; webhooks are idempotent
- SMS credits deducted in a database transaction
- Cross-tenant reads return 403

See `docs/DEPLOYMENT.md` for production notes.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nayemhossinshakib-del/BIDHAPITH-&env=AUTH_SECRET,DEMO_MODE&envDescription=Set%20AUTH_SECRET%20to%20a%20long%20random%20string.%20DEMO_MODE=true%20shows%20demo%20logins.&project-name=bidhapith&repository-name=bidhapith)

1. Open [vercel.com/new](https://vercel.com/new) and import `nayemhossinshakib-del/BIDHAPITH-`.
2. Use branch `arena/01a07055-bidhapith` if `main` is empty.
3. Install command: `npm install --legacy-peer-deps`
4. Environment variables:

| Name | Value |
| --- | --- |
| `AUTH_SECRET` | long random string |
| `DEMO_MODE` | `true` |
| `NEXTAUTH_URL` | `https://<your-app>.vercel.app` |

The Vercel demo uses a bundled SQLite file copied to `/tmp` (ephemeral). For production, attach Neon/Vercel Postgres.
