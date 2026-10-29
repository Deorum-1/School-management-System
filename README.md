# Apex Academics

A school management workspace built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- School overview with enrollment, staff, fees, admissions, and announcements
- Student directory with class filtering, search, and enrollment
- Daily attendance roll call
- Assessment and results overview
- Fee balances, demo payment recording, and transaction history
- Staff directory and admissions pipeline
- Responsive navigation for desktop and mobile

The current interface uses seeded demo data held in client state. Changes made in the UI are not persisted between reloads. The Prisma schema in `prisma/schema.prisma` defines the planned SQLite-backed data model; database persistence and authentication are not connected to these demo screens yet.

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

To generate the Prisma client and apply the SQLite schema, run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

`npm run build` and `npm run lint` currently report pre-existing lint errors in files outside the new workspace UI. Run `npx tsc --noEmit` to check TypeScript types.
