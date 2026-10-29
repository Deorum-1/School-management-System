import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string | string[] };
}) {
  if (await getSessionUser()) {
    redirect("/");
  }

  const errorCode = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;
  const error =
    errorCode === "unavailable"
      ? "Sign-in is temporarily unavailable. Please try again."
      : errorCode === "invalid"
        ? "Invalid email, password, or account role."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
            A
          </span>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Apex Academics
            </h1>
            <p className="text-xs text-slate-500">School management portal</p>
          </div>
        </div>
        <h2 className="mt-8 text-xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select your account role and enter your credentials to continue.
        </p>
        <LoginForm error={error} />
      </section>
    </main>
  );
}
