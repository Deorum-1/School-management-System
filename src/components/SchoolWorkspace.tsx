"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useSchool } from "@/context/SchoolContext";
import { NotificationToast } from "@/components/NotificationToast";
import { StudentRecord } from "@/lib/initial-data";
import { Role } from "@/lib/permissions";
import {
  NIGERIAN_CLASSES,
  NIGERIAN_CLASS_GROUPS,
} from "@/lib/school-classes";

const navigation = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "staff", label: "Staff", icon: GraduationCap },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "grading", label: "Results", icon: BookOpen },
  { id: "accounting", label: "Fees & finance", icon: Wallet },
  { id: "admission", label: "Admissions", icon: CircleDollarSign },
];

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const initials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    PRESENT: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    ADMITTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    PARTIAL: "bg-amber-50 text-amber-700 ring-amber-600/15",
    LATE: "bg-amber-50 text-amber-700 ring-amber-600/15",
    INTERVIEW: "bg-violet-50 text-violet-700 ring-violet-600/15",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/15",
    ABSENT: "bg-rose-50 text-rose-700 ring-rose-600/15",
    SUSPENDED: "bg-rose-50 text-rose-700 ring-rose-600/15",
    UNDER_REVIEW: "bg-blue-50 text-blue-700 ring-blue-600/15",
    EXAM_SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-600/15",
    ALUMNI: "bg-slate-100 text-slate-600 ring-slate-500/10",
    EXCUSED: "bg-slate-100 text-slate-600 ring-slate-500/10",
  };
  const label = status.replaceAll("_", " ").toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ring-1 ring-inset ${
        styles[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/10"
      }`}
    >
      {label}
    </span>
  );
}

function StudentAvatar({
  firstName,
  lastName,
  color = "blue",
}: {
  firstName: string;
  lastName: string;
  color?: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
        colors[color] ?? colors.blue
      }`}
    >
      {initials(firstName, lastName)}
    </span>
  );
}

function StudentRows({ students }: { students: StudentRecord[] }) {
  if (!students.length) {
    return (
      <div className="px-5 py-14 text-center text-sm text-slate-500">
        No students match your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[690px] text-left">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <th className="px-5 py-3">Student</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Admission no.</th>
            <th className="px-4 py-3">Fees</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student, index) => (
            <tr key={student.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <StudentAvatar
                    firstName={student.firstName}
                    lastName={student.lastName}
                    color={["blue", "violet", "amber", "emerald"][index % 4]}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {student.gender === "FEMALE" ? "Female" : "Male"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-600">
                {student.className}
              </td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                {student.admissionNo}
              </td>
              <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                {student.feesDue ? currency.format(student.feesDue) : "—"}
              </td>
              <td className="px-5 py-3.5">
                <StatusPill status={student.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Overview({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { students, staff, transactions, announcements, applicants } = useSchool();
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const outstandingFees = students.reduce((total, student) => total + student.feesDue, 0);
  const classes = new Map<string, number>();
  students.forEach((student) =>
    classes.set(student.className, (classes.get(student.className) ?? 0) + 1),
  );
  const classRows: [string, number][] = [];
  classes.forEach((count, className) => classRows.push([className, count]));
  classRows.splice(5);
  const maxClassSize = Math.max(...classRows.map(([, count]) => count), 1);
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status !== "ADMITTED" && applicant.status !== "REJECTED",
  ).length;

  const metrics = [
    {
      label: "Enrolled students",
      value: students.length.toLocaleString(),
      change: "+12 this term",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
      trend: "up",
    },
    {
      label: "Teaching staff",
      value: staff.filter((member) => member.status === "ACTIVE").length.toString(),
      change: "Across 8 departments",
      icon: GraduationCap,
      iconStyle: "bg-violet-50 text-violet-600",
      trend: "up",
    },
    {
      label: "Fees collected",
      value: currency.format(totalIncome),
      change: `${currency.format(outstandingFees)} outstanding`,
      icon: Wallet,
      iconStyle: "bg-emerald-50 text-emerald-600",
      trend: "up",
    },
    {
      label: "New applications",
      value: pendingApplicants.toString(),
      change: "Awaiting review",
      icon: ClipboardCheck,
      iconStyle: "bg-amber-50 text-amber-600",
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#172d5a] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium text-blue-100">
            <CalendarDays className="h-3.5 w-3.5" />
            2026 / 2027 academic year <span className="text-white/40">•</span> First term
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            Good morning, Alex
          </h2>
          <p className="mt-2 max-w-lg text-xs leading-6 text-blue-100/80 sm:text-sm">
            Your school at a glance. Here&apos;s what&apos;s happening across your
            community today.
          </p>
          <button
            onClick={() => onNavigate("students")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#172d5a] shadow-sm transition hover:bg-blue-50"
          >
            View student directory <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[36px] border-white/[0.045]" />
        <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full bg-blue-400/10 blur-2xl" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Surface key={metric.label} className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-[22px] font-bold tracking-tight text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.iconStyle}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                <TrendIcon className="h-3.5 w-3.5 text-emerald-600" />
                {metric.change}
              </p>
            </Surface>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Surface className="p-5 sm:p-6">
          <SectionHeading
            title="Class overview"
            subtitle="Student enrollment across your classes"
            action={
              <button
                onClick={() => onNavigate("students")}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
              >
                All students <ArrowRight className="ml-1 inline h-3 w-3" />
              </button>
            }
          />
          <div className="space-y-4">
            {classRows.map(([className, count], index) => (
              <div key={className}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{className}</span>
                  <span className="text-[11px] text-slate-500">
                    {count} students
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-sky-500"][index]
                    }`}
                    style={{ width: `${Math.max((count / maxClassSize) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
            {!classRows.length && (
              <p className="py-8 text-center text-xs text-slate-500">
                Enroll students to see class totals.
              </p>
            )}
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <SectionHeading
            title="Latest announcements"
            subtitle="Updates from your school community"
          />
          <div className="space-y-4">
            {announcements.slice(0, 3).map((announcement, index) => (
              <div key={announcement.id} className="flex gap-3">
                <span
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    ["bg-blue-500", "bg-amber-500", "bg-emerald-500"][index]
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-5 text-slate-800">
                    {announcement.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                    {announcement.summary}
                  </p>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {announcement.date} <span className="px-1">·</span>{" "}
                    {announcement.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-5 sm:p-6">
        <SectionHeading
          title="Recently enrolled"
          subtitle="A quick look at the latest student records"
          action={
            <button
              onClick={() => onNavigate("students")}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
            >
              Open directory <ArrowRight className="ml-1 inline h-3 w-3" />
            </button>
          }
        />
        <StudentRows students={students.slice(0, 5)} />
      </Surface>
    </div>
  );
}

function StudentsView({
  query,
  onAdd,
}: {
  query: string;
  onAdd: () => void;
}) {
  const { students } = useSchool();
  const [classFilter, setClassFilter] = useState("All classes");
  const filtered = students.filter((student) => {
    const text = `${student.firstName} ${student.lastName} ${student.admissionNo} ${student.className}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (classFilter === "All classes" || student.className === classFilter)
    );
  });

  return (
    <div className="space-y-5">
      <Surface className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student directory</h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage enrollment and keep student records up to date.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add student
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 sm:px-6">
          <p className="text-[11px] text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filtered.length}</span> of{" "}
            {students.length} students
          </p>
          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option>All classes</option>
            {NIGERIAN_CLASSES.map((schoolClass) => (
              <option key={schoolClass.code} value={schoolClass.name}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </div>
        <StudentRows students={filtered} />
      </Surface>
    </div>
  );
}

function AttendanceView() {
  const { students, attendanceStatuses, markAttendance } = useSchool();
  const markedCount = students.filter((student) => attendanceStatuses[student.id]).length;
  const presentCount = students.filter(
    (student) => attendanceStatuses[student.id] === "PRESENT",
  ).length;

  return (
    <Surface className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Daily attendance</h2>
          <p className="mt-1 text-xs text-slate-500">
            Record today&apos;s roll call for each student.
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-medium text-blue-700">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-y border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-3">
        {[
          ["Students", students.length],
          ["Marked", markedCount],
          ["Present", presentCount],
        ].map(([label, count]) => (
          <div key={label} className="rounded-xl bg-white p-3">
            <p className="text-[10px] font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{count}</p>
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {students.map((student, index) => {
          const status = attendanceStatuses[student.id];
          return (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <StudentAvatar
                  firstName={student.firstName}
                  lastName={student.lastName}
                  color={["blue", "violet", "amber", "emerald"][index % 4]}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {student.className}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {status ? (
                  <StatusPill status={status} />
                ) : (
                  <span className="text-[10px] text-slate-400">Not marked</span>
                )}
                <button
                  onClick={() => markAttendance(student.id, "PRESENT")}
                  aria-label={`Mark ${student.firstName} ${student.lastName} present`}
                  className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                    status === "PRESENT"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(student.id, "ABSENT")}
                  aria-label={`Mark ${student.firstName} ${student.lastName} absent`}
                  className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                    status === "ABSENT"
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

function ResultsView() {
  const { grades } = useSchool();
  const average = grades.length
    ? grades.reduce((total, result) => total + result.total, 0) / grades.length
    : 0;
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Published results", grades.length.toString(), "First term"],
          ["Class average", `${average.toFixed(1)}%`, "Across all subjects"],
          ["Top grade", grades.length ? "A1" : "—", "Highest performance"],
        ].map(([label, value, note]) => (
          <Surface key={label} className="p-4">
            <p className="text-[11px] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-[10px] text-slate-400">{note}</p>
          </Surface>
        ))}
      </div>
      <Surface className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <SectionHeading
            title="Assessment results"
            subtitle="Continuous assessment and examination scores"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-3">Student / subject</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">CA score</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-5 py-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold text-slate-800">
                      {result.studentName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {result.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    {result.class}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    {(result.ca1 + result.ca2 + result.ca3).toFixed(1)} / 40
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    {result.exam} / 60
                  </td>
                  <td className="px-4 py-3.5 text-xs font-bold text-slate-900">
                    {result.total}%
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {result.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}

function FinanceView() {
  const { students, transactions, processPayment } = useSchool();
  const outstanding = students.filter((student) => student.feesDue > 0);
  const income = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Total collected", currency.format(income), "Income this term"],
          ["Outstanding fees", currency.format(outstanding.reduce((total, student) => total + student.feesDue, 0)), `${outstanding.length} students`],
          ["Operating expenses", currency.format(expenses), "Recorded expenses"],
        ].map(([label, value, note]) => (
          <Surface key={label} className="p-4">
            <p className="text-[11px] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-[10px] text-slate-400">{note}</p>
          </Surface>
        ))}
      </div>
      <Surface className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <SectionHeading
            title="Outstanding student fees"
            subtitle="Record a demo payment against a student's balance"
          />
        </div>
        <div className="divide-y divide-slate-100">
          {outstanding.slice(0, 8).map((student) => (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {student.className}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">
                  {currency.format(student.feesDue)}
                </span>
                <button
                  onClick={() =>
                    processPayment(
                      student.id,
                      Math.min(student.feesDue, 50000),
                      `DEMO-${Date.now()}`,
                    )
                  }
                  className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Record payment
                </button>
              </div>
            </div>
          ))}
          {!outstanding.length && (
            <p className="px-5 py-10 text-center text-xs text-slate-500">
              All student fees are up to date.
            </p>
          )}
        </div>
      </Surface>
      <Surface className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <SectionHeading
            title="Recent transactions"
            subtitle="Latest entries in the school ledger"
          />
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 6).map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 sm:px-6"
            >
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {transaction.category}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {transaction.description}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-bold ${
                    transaction.type === "INCOME"
                      ? "text-emerald-700"
                      : "text-slate-800"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "−"}
                  {currency.format(transaction.amount)}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function StaffView() {
  const { staff } = useSchool();
  return (
    <Surface className="overflow-hidden">
      <div className="p-5 sm:p-6">
        <SectionHeading
          title="Staff directory"
          subtitle="Faculty and school team members"
        />
      </div>
      <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {staff.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5"
          >
            <StudentAvatar
              firstName={member.firstName}
              lastName={member.lastName}
              color={["blue", "violet", "amber", "emerald"][index % 4]}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                {member.firstName} {member.lastName}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {member.designation} · {member.department}
              </p>
            </div>
            <StatusPill status={member.status} />
          </div>
        ))}
      </div>
    </Surface>
  );
}

function AdmissionsView() {
  const { applicants, admitApplicant } = useSchool();
  const [selectedApplicant, setSelectedApplicant] =
    useState<(typeof applicants)[number] | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isAdmitting, setIsAdmitting] = useState(false);

  const submitAdmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedApplicant || isAdmitting) return;

    setIsAdmitting(true);
    try {
      const admitted = await admitApplicant(selectedApplicant.id, dateOfBirth);
      if (admitted) {
        setSelectedApplicant(null);
        setDateOfBirth("");
      }
    } finally {
      setIsAdmitting(false);
    }
  };

  return (
    <>
      <Surface className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <SectionHeading
            title="Admissions pipeline"
            subtitle="Review applications and move candidates into the student directory."
          />
        </div>
        <div className="divide-y divide-slate-100">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <StudentAvatar
                  firstName={applicant.firstName}
                  lastName={applicant.lastName}
                  color="violet"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {applicant.appNo} · Applying for {applicant.intendedClass}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {applicant.entranceScore !== undefined && (
                  <span className="hidden text-[10px] text-slate-500 sm:inline">
                    Entrance score:{" "}
                    <strong className="text-slate-700">
                      {applicant.entranceScore}%
                    </strong>
                  </span>
                )}
                <StatusPill status={applicant.status} />
                {applicant.status !== "ADMITTED" &&
                  applicant.status !== "REJECTED" && (
                  <button
                    onClick={() => {
                      setSelectedApplicant(applicant);
                      setDateOfBirth("");
                    }}
                    className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-700"
                  >
                    Admit student
                  </button>
                  )}
              </div>
            </div>
          ))}
          {!applicants.length && (
            <p className="px-5 py-10 text-center text-xs text-slate-500">
              No admission applications found. Run the database seed to load demo applications.
            </p>
          )}
        </div>
      </Surface>

      {selectedApplicant && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isAdmitting) {
              setSelectedApplicant(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-confirmation-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <h2
              id="admission-confirmation-title"
              className="text-base font-bold text-slate-900"
            >
              Admit {selectedApplicant.firstName} {selectedApplicant.lastName}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This will create a student record in{" "}
              <span className="font-semibold text-slate-700">
                {selectedApplicant.intendedClass}
              </span>{" "}
              and save the application as admitted.
            </p>
            <form onSubmit={submitAdmission} className="mt-5 space-y-4">
              <label className="block text-[11px] font-medium text-slate-600">
                Student date of birth
                <input
                  autoFocus
                  type="date"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={isAdmitting}
                  onClick={() => setSelectedApplicant(null)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdmitting ? "Saving admission..." : "Confirm admission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function SchoolWorkspace() {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    students,
    addStudent,
    activeNotification,
  } = useSchool();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const activePage =
    navigation.find((item) => item.id === activeTab) ?? navigation[0];
  const pageTitles: Record<string, string> = {
    dashboard: "Overview",
    students: "Students",
    staff: "Staff",
    attendance: "Attendance",
    grading: "Results",
    accounting: "Fees & finance",
    admission: "Admissions",
  };

  const activeStudentCount = students.filter(
    (student) => student.status === "ACTIVE",
  ).length;

  const handleAddStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const className = String(formData.get("className") ?? "");
    const parentName = String(formData.get("parentName") ?? "").trim();
    const parentEmail = String(formData.get("parentEmail") ?? "").trim();
    const parentPhone = String(formData.get("parentPhone") ?? "").trim();
    const dob = String(formData.get("dob") ?? "");
    const genderValue = String(formData.get("gender") ?? "FEMALE");
    const gender = genderValue === "MALE" ? "MALE" : "FEMALE";
    if (!firstName || !lastName || !className || !parentName || !dob) return;

    addStudent({
      firstName,
      lastName,
      gender,
      className,
      dob,
      house: "Blue Phoenix",
      bloodGroup: "",
      address: "",
      photoUrl: "",
      parentName,
      parentPhone,
      parentEmail,
    });
    setShowAddStudent(false);
    event.currentTarget.reset();
  };

  const content = (() => {
    switch (activeTab) {
      case "students":
        return (
          <StudentsView
            query={search}
            onAdd={() => setShowAddStudent(true)}
          />
        );
      case "staff":
        return <StaffView />;
      case "attendance":
        return <AttendanceView />;
      case "grading":
        return <ResultsView />;
      case "accounting":
        return <FinanceView />;
      case "admission":
        return <AdmissionsView />;
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  })();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {menuOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col bg-[#101b34] text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.08] px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-950/40">
              A
            </span>
            <div>
              <p className="text-[13px] font-bold tracking-wide text-white">
                APEX ACADEMICS
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
                School management
              </p>
            </div>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-2.5 px-3 text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const selected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMenuOpen(false);
                  }}
                  aria-current={selected ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                    selected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" />
                  <span className="flex-1">{item.label}</span>
                  {item.id === "admission" && (
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-blue-100">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
              AC
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">
                Apex City School
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Lagos, Nigeria
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <p className="px-1 pt-4 text-[9px] text-slate-500">
            © 2026 Apex Academics
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {pageTitles[activeTab] ?? activePage.label}
              </p>
              <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                <span className="px-1 text-slate-300">/</span>{" "}
                2026–2027 Academic year
              </p>
            </div>
          </div>

          <div className="hidden max-w-[330px] flex-1 md:block">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => {
                  if (search) setActiveTab("students");
                }}
                placeholder="Search students..."
                aria-label="Search students"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell className="h-[18px] w-[18px]" />
              {activeNotification && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              )}
            </button>
            <span className="hidden h-7 w-px bg-slate-200 sm:block" />
            <label className="sr-only" htmlFor="role-select">
              Current role
            </label>
            <select
              id="role-select"
              value={currentRole}
              onChange={(event) =>
                setCurrentRole(event.target.value as Role)
              }
              className="max-w-[108px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] font-semibold text-slate-700 outline-none focus:border-blue-300 sm:max-w-none sm:px-3 sm:text-[11px]"
            >
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
              <option value="STUDENT">Student</option>
              <option value="ACCOUNTANT">Accountant</option>
            </select>
            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 sm:flex">
              AC
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                School administration
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                {pageTitles[activeTab] ?? activePage.label}
              </h1>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {activeStudentCount} active records
            </div>
          </div>
          {content}
        </main>
      </div>

      {showAddStudent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddStudent(false);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Add a student
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create a student record in the school directory.
                </p>
              </div>
              <button
                aria-label="Close add student form"
                onClick={() => setShowAddStudent(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-[11px] font-medium text-slate-600">
                  First name
                  <input
                    name="firstName"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Tunde"
                  />
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Last name
                  <input
                    name="lastName"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Balogun"
                  />
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Class
                  <select
                    name="className"
                    required
                    defaultValue=""
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Select a class
                    </option>
                    {NIGERIAN_CLASS_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.classes.map((schoolClass) => (
                          <option key={schoolClass.code} value={schoolClass.name}>
                            {schoolClass.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Gender
                  <select
                    name="gender"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Date of birth
                  <input
                    name="dob"
                    type="date"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block text-[11px] font-medium text-slate-600 sm:col-span-2">
                  Parent / guardian name
                  <input
                    name="parentName"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Parent or guardian"
                  />
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Parent email
                  <input
                    name="parentEmail"
                    type="email"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="name@example.com"
                  />
                </label>
                <label className="block text-[11px] font-medium text-slate-600">
                  Parent phone
                  <input
                    name="parentPhone"
                    type="tel"
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="+234 ..."
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Check className="h-3.5 w-3.5" /> Save student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <NotificationToast />
    </div>
  );
}
