import { redirect } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignupPage({
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
    errorCode === "exists"
      ? "An account with this email already exists."
      : errorCode === "unavailable"
        ? "Account creation is temporarily unavailable. Please try again."
        : errorCode === "invalid"
          ? "Enter valid account details and a password of at least 12 characters."
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
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose the role that matches your school account.
        </p>
        <SignupForm error={error} />
        <p className="mt-5 text-center text-xs text-slate-500">
          Administrator accounts are created by the school administrator.
        </p>
      </section>
    </main>
  );
}
