# CAMPUS CONNECT

Campus Connect is a role-based campus SaaS app built with Next.js 15, TypeScript, Tailwind CSS, Auth.js/NextAuth, MongoDB Atlas, Mongoose, Recharts, and Vercel.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Required local environment variables:

```env
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/campus_connect?retryWrites=true&w=majority"
AUTH_SECRET="generate-a-long-random-secret"
NEXTAUTH_SECRET="generate-the-same-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="your_resend_api_key_here"
SEED_DEMO_ENABLED="false"
```

Use the same random value for `AUTH_SECRET` and `NEXTAUTH_SECRET`.

## MongoDB Atlas Free Tier

1. Create a free MongoDB Atlas account.
2. Create an M0 free cluster.
3. Create a database user with a strong password.
4. In Network Access, allow Vercel to connect. For student/demo deployment, `0.0.0.0/0` is the simplest option.
5. Copy the `mongodb+srv://...` connection string.
6. Replace `<password>` and set the database name to `campus_connect`.
7. Paste it into `MONGODB_URI` locally and in Vercel.

## Seed Demo Users

Local:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000/api/seed
```

Production seed route safety:

- In production, `/api/seed` is disabled by default.
- To seed the first deployed demo data, temporarily set `SEED_DEMO_ENABLED=true` in Vercel, visit `/api/seed` once, then set it back to `false` or remove it.
- After an admin exists, admin/super admin sessions can seed without the flag.

Demo login credentials after seeding:

| Role | Campus ID | Password |
| --- | --- | --- |
| Super Admin | `SUPER001` | `Campus@123` |
| Admin | `ADM001` | `Campus@123` |
| Principal | `PRI001` | `Campus@123` |
| HOD | `HOD-CSE-001` | `Campus@123` |
| Faculty | `FAC2026001` | `Campus@123` |
| Placement Officer | `PLC001` | `Campus@123` |
| Student | `MCA2026001` | `Campus@123` |

## GitHub Push

```bash
git init
git add .
git commit -m "Prepare Campus Connect for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campus-connect.git
git push -u origin main
```

Skip `git init` and `git remote add` if your repository is already connected.

## Vercel Deployment

1. Push the project to GitHub.
2. Open Vercel and choose Add New Project.
3. Import the GitHub repository.
4. Framework preset: Next.js.
5. Build command: `npm run build`.
6. Install command: `npm install`.
7. Add the required environment variables.
8. Deploy.
9. Seed demo users once.
10. Test all demo roles.

Required Vercel environment variables:

```env
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/campus_connect?retryWrites=true&w=majority"
AUTH_SECRET="same-long-random-secret"
NEXTAUTH_SECRET="same-long-random-secret"
AUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
RESEND_API_KEY="your_resend_api_key_here"
SEED_DEMO_ENABLED="false"
```

Email verification OTPs are sent with Resend from `onboarding@resend.dev`. Add `RESEND_API_KEY` locally and in Vercel Environment Variables. If it is missing, the OTP is not shown in the UI; local development logs it in the terminal and returns a setup error.

Optional environment variables:

```env
NEXT_PUBLIC_SOCKET_URL=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Production Checklist

- `npm install` completes.
- `npm run build` passes.
- Vercel has all required environment variables.
- `MONGODB_URI` is a real Atlas URI, not the placeholder.
- `/api/seed` is used once, then `SEED_DEMO_ENABLED` is disabled.
- Login uses Campus ID, not email.
- Student cannot open admin/faculty/HOD/principal portals.
- Faculty cannot open admin or principal portals.
- HOD reports are limited to department data.
- Student notes show only approved notes.
- Admin can create users, bulk generate student IDs, reset passwords, activate/deactivate users, copy credentials, and export CSV.
- Attendance, notes approval, placement applications, assignments, leave, events, notifications, and audit logs are checked after deployment.
- Test mobile layout on a phone viewport before sharing the Vercel URL.

## Final Local Commands

```bash
npm install
npm run build
npm run dev
```
