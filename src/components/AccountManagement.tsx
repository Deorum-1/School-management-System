"use client";

import { FormEvent, useState, useTransition } from "react";
import { createAccountAction } from "@/actions/user-accounts";
import { LOGIN_ROLES, ROLE_LABELS } from "@/lib/permissions";

export function AccountManagement() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createdAccount, setCreatedAccount] = useState<{
    name: string;
    email: string;
    roleLabel: string;
  } | null>(null);

  const submitAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);
    setCreatedAccount(null);
    startTransition(async () => {
      const result = await createAccountAction({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setCreatedAccount(result.account);
      form.reset();
    });
  };

  return (
    <section className="max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] sm:p-7">
      <div className="mb-6">
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Create a school account
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Create login credentials for a student, teacher, parent, accountant,
          or another administrator. The username is the email address they will
          use to sign in.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
        >
          {error}
        </p>
      )}
      {createdAccount && (
        <p
          role="status"
          className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800"
        >
          Account created for {createdAccount.name} ({createdAccount.roleLabel}).
          Give them the username {createdAccount.email} and the password you set.
        </p>
      )}

      <form onSubmit={submitAccount} className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-700">
          Full name
          <input
            type="text"
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">
          Username (email address)
          <input
            type="email"
            name="email"
            autoComplete="off"
            maxLength={254}
            required
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">
          Account role
          <select
            name="role"
            defaultValue=""
            required
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            <option value="" disabled>
              Select a role
            </option>
            {LOGIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </label>
        <span className="hidden sm:block" aria-hidden="true" />
        <label className="text-xs font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={256}
            required
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={12}
            maxLength={256}
            required
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </label>
        <div className="sm:col-span-2">
          <p className="mb-3 text-[11px] text-slate-500">
            Passwords must be at least 12 characters. Passwords are securely
            hashed before being saved.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </section>
  );
}
