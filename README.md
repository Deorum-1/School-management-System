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

The student directory, daily attendance, and admissions screens use Prisma server actions backed by SQLite. Enrolling an approved applicant creates the student and guardian records and updates the applicant in one database transaction. `npm run db:seed` safely seeds demo classes, students, guardians, and applicants and can be run more than once. Other modules still use demo data; those data sets are rendered only for authenticated roles with the corresponding read permission and are not persisted.

The private workspace requires a database-backed login. Only an administrator can create accounts and assign roles. Admins and teachers use their email address as their username; students and parents use a username and do not need an email address. Passwords are scrypt-hashed before being saved to Prisma. Users select their role and enter their username and password when signing in. If an Admin password was entered directly into Prisma as plain text, the first successful Admin sign-in upgrades it to a scrypt hash. The first administrator is provisioned separately. The browser receives only a random, HTTP-only session token whose hash is stored in the `Session` table. Server actions enforce role permissions. The parent and student roles do not yet have dedicated portal pages, and login rate limiting must be supplied by a trusted reverse proxy or hosting platform before public deployment.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set any integration keys you need.

3. Generate the Prisma client and apply migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Create the first administrator in an interactive terminal. The command generates a strong password, saves its hash to Prisma, and displays the password once:

   ```bash
   npm run auth:create-admin
   ```

   Save the generated password securely; it cannot be recovered.

5. Optionally seed demo school data, then start the app:

   ```bash
   npm run db:seed
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and sign in with the administrator account. Use **Accounts** in the workspace to create credentials for other users.

Production deployments must use HTTPS and a configured `PAYSTACK_SECRET_KEY` for the public Paystack webhook. Do not expose `.env` or use the demo seed data as real student records.
