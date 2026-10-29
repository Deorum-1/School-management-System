"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth";
import { LOGIN_ROLES, ROLE_LABELS } from "@/lib/permissions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm({ error }: { error: string | null }) {
  return (
    <form action={loginAction} className="mt-7">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
        >
          {error}
        </p>
      )}
      <label className="block text-xs font-medium text-slate-700">
        Sign in as
        <select
          name="role"
          defaultValue=""
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="" disabled>
            Choose your role
          </option>
          {LOGIN_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-medium text-slate-700">
        Username
        <input
          type="text"
          name="username"
          autoComplete="username"
          maxLength={254}
          minLength={1}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-slate-700">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          maxLength={256}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
