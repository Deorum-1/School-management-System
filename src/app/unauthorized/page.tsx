import { logoutAction } from "@/actions/auth";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">Access unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account does not have permission to access this workspace.
        </p>
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
