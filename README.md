# Victor Udoka Anene | Personal Brand Site (Next.js 14 + Amplify Gen2)

Production-ready personal brand website built for lead conversion:
- Book a Call, Hire Victor, Download CV
- Dynamic services catalog
- CRUD blog + case studies
- Global search, filters, pagination
- Likes & bookmarks per user
- Newsletter signup with double opt-in workflow
- Contact form with S3 file upload
- Secure Admin dashboard with RBAC (Admin/Editor)
- Analytics (page views, top pages, lead funnel basics)
- Audit log for admin actions
- Input validation and rate limiting strategy

## Tech Stack
Frontend:
- Next.js 14 App Router + TypeScript
- TailwindCSS + (lightweight shadcn-compatible components)
- Zod + React Hook Form
- Framer Motion-ready (installed; add animations as needed)
- SEO: JSON-LD, OpenGraph, sitemap.xml, robots.txt

Backend (AWS Amplify Gen2):
- Cognito (email + Google)
- DynamoDB via Amplify Data
- S3 via Amplify Storage
- SES via Amplify Function (Outbox Processor)

> Important note: SES requires domain or email verification in your AWS account.

---

## 1) Local Development

### Prereqs
- Node 18+
- Amplify CLI (Gen2): `npm i -g @aws-amplify/cli`

### Install
```bash
npm install
```

### Configure Amplify outputs
Run:
```bash
amplify pull --appId <YOUR_APP_ID> --envName <YOUR_ENV>
```

This generates `amplify_outputs.json` in the repo root.

### Env
Copy:
```bash
cp .env.example .env.local
```

Set:
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `NEXT_PUBLIC_AMPLIFY_OUTPUTS_LOCAL=true`

### Start
```bash
npm run dev
```

---

## 2) Deploy to AWS Amplify Hosting via GitHub (step-by-step)

1. Push this repo to GitHub.
2. In AWS Console → Amplify → **Create new app** → **Host web app**.
3. Connect GitHub repo + branch.
4. Add environment variables:
   - `SITE_URL` (your prod URL)
   - `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` (optional; can be added later)
   - `SES_FROM_EMAIL` (verified sender address)
5. Build settings: Amplify will detect Next.js. Use default or add:
   - Build command: `npm ci && npm run build`
   - Start command not needed in hosting.
6. Deploy.

### Post-deploy: Outbox processor
This project uses an Outbox record in Data to queue emails. The Lambda needs the Outbox Dynamo table name.

After first deployment, open your generated `amplify_outputs.json` (in Amplify Hosting build artifacts) and find the Data table name for `Outbox`.
Then set Lambda env var `OUTBOX_TABLE_NAME` on the function `outboxProcessor`.

You can do this in Amplify console:
- Backend environments → Functions → outboxProcessor → Environment variables.

---

## 3) Seed sample data
After `amplify pull` exists locally:
```bash
npm run seed
```

---

## 4) Admin Access (RBAC)
Two Cognito groups exist:
- `Admin` (full CRUD)
- `Editor` (create/update, limited delete)

Add your user to a group:
- Cognito → User pools → Users → select user → Add to group.

Admin UI: `/admin`

---

## 5) Security
- RBAC enforced at the Data API layer with group-based authorization rules.
- Input validation with Zod (forms) + Data layer schema constraints.
- Rate limiting strategy: Dynamo-based token bucket (provided in `/src/lib/rateLimit.ts`), ready to plug into Lambdas or Route Handlers.
- Secure file upload: Amplify Storage uses IAM-backed signed requests; client validates file type + size.
- Audit logging: Admin actions write to `AuditLog`.

---

## 6) DynamoDB access patterns (Amplify Data tables)
Amplify Data generates DynamoDB tables. Indexes are defined in `amplify/data/resource.ts`.

Primary access patterns:
- Blog posts by slug, by category, by status
- Case studies by slug, by industry, by status
- Leads by status, by email
- Newsletter subscribers by status
- Interactions by userId and content type/id
- Page views by path

---

## 7) IAM policies (paste-ready)
Amplify manages roles automatically. If you need explicit least-privilege policies for a custom role, see `infra/iam-policies.json`.

---

## License
MIT
