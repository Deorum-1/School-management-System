# Apex Academics

A school management workspace built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- School overview with enrollment, staff, fees, admissions, and announcements
- Student directory with class filtering, search, and enrollment
- Daily attendance roll call
- Assessment and results overview
- Fee balances, demo payment recording, and transaction history
- Staff directory and admissions pipeline
- Nigerian class structure: Nursery 1–3, Primary 1–6, JSS 1–3, and SS 1–3
- Responsive navigation for desktop and mobile

The student directory and daily attendance screens use Prisma server actions backed by SQLite, so those records persist across reloads. `npm run db:seed` safely seeds the demo classes, students, and guardians and can be run more than once. The other modules still use demo data held in client state.

Authentication and authorization are not implemented. The role selector is only a demo control, and the server actions are not access-controlled. Do not use this app with real student data or deploy it publicly until sign-in and server-side permission checks are in place.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set any integration keys you need.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

To generate the Prisma client and apply database migrations, run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

`npm run build` and `npm run lint` currently report pre-existing lint errors in files outside the new workspace UI. Run `npx tsc --noEmit` to check TypeScript types.
