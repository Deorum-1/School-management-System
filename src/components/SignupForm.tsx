"use client";

import { useFormStatus } from "react-dom";
import { signupAction } from "@/actions/auth";
import { PUBLIC_SIGNUP_ROLES, ROLE_LABELS } from "@/lib/permissions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export function SignupForm({ error }: { error: string | null }) {
  return (
    <form action={signupAction} className="mt-7">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
        >
          {error}
        </p>
      )}
      <label className="block text-xs font-medium text-slate-700">
        Full name
        <input
          type="text"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={120}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-slate-700">
        Email address
        <input
          type="email"
          name="email"
          autoComplete="email"
          maxLength={254}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-slate-700">
        Phone number <span className="font-normal text-slate-500">(optional)</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={30}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-slate-700">
        Register as
        <select
          name="role"
          defaultValue=""
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="" disabled>
            Choose your role
          </option>
          {PUBLIC_SIGNUP_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-xs font-medium text-slate-700">
        Password
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={256}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <span className="mt-1 block font-normal text-slate-500">
          Use at least 12 characters.
        </span>
      </label>
      <SubmitButton />
      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
