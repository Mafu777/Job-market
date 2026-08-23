# Production deployment

## Recommended host

Deploy this Next.js app to Vercel using the repository import flow. Connect the project repository, keep the framework preset as Next.js, and use `npm run build` as the production check.

## Required environment variables

Add these in the Vercel project settings for Production, Preview, and Development as appropriate:

- `DATABASE_URL`: the production PostgreSQL connection string
- `NEXTAUTH_URL`: the final HTTPS site URL
- `NEXTAUTH_SECRET`: a new long random secret, different from local development
- `ADMIN_REPORT_EMAIL`: the inbox for new job reports

To enable report email and career AI, also add:

- `RESEND_API_KEY` and a verified `FEEDBACK_FROM_EMAIL`
- `XAI_API_KEY` or `GROQ_API_KEY`

Never commit `.env` or paste API keys into source files. The repository ignores `.env*` files. Any key previously shared in chat should be revoked and replaced.

## Database

Before the first production deployment, run the schema against the production database from a trusted local terminal:

```powershell
npx prisma generate
npx prisma db push
```

## After deployment

Check these URLs on the live HTTPS domain:

- `/`
- `/jobs`
- `/login`
- `/dashboard/admin`
- `/verify-job`
- `/scam-radar`
- `/robots.txt`
- `/sitemap.xml`

Then create or confirm an `ADMIN` user and verify that a test report reaches `ADMIN_REPORT_EMAIL`.