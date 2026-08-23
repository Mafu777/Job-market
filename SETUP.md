# Setup Instructions

## 1. Scaffold the Next.js project (if you haven't already)

```powershell
npx create-next-app@latest job-marketplace --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd job-marketplace
```

## 2. Copy these files into your project

Drop everything from this starter kit into your `job-marketplace` folder,
overwriting the default `src/app/page.tsx`, `layout.tsx`, and `globals.css`.

## 3. Install the extra dependencies

```powershell
npm install @prisma/client next-auth bcryptjs
npm install -D prisma @types/bcryptjs
```

## 4. Set up your database

Create a free Postgres database (Supabase, Neon, or Railway all work well
and have generous free tiers).

Copy `.env.example` to `.env` and fill in your `DATABASE_URL`.
Generate a secret for `NEXTAUTH_SECRET`:

```powershell
openssl rand -base64 32
```

(If you don't have OpenSSL on Windows, any random 32+ character string works
for local development.)

## 5. Push the schema and generate the Prisma client

```powershell
npx prisma generate
npx prisma db push
```

## 6. Run the dev server

```powershell
npm run dev
```

Visit http://localhost:3000

## What's included

- Prisma schema: User, CandidateProfile, Company, Job, Application, Notification
- Role-based auth (JOB_SEEKER / EMPLOYER / ADMIN) via NextAuth credentials
- Registration + login pages
- Job search/listing page + job detail page + apply flow
- Candidate, employer, and admin dashboard stubs
- API routes: /api/register, /api/jobs, /api/jobs/[id], /api/jobs/[id]/apply

## Suggested next steps

1. Wire up CV upload to S3/Cloudflare R2/Supabase Storage (currently `cvUrl` is just a string field).
2. Build the "new job" form for employers (`/dashboard/employer/new-job`).
3. Add email verification and password reset flows.
4. Add pagination controls to the jobs listing page.
5. Set up `prisma migrate dev` instead of `db push` once you're past the prototyping stage.
6. Deploy: Vercel for the app, Supabase/Neon/Railway for Postgres.
