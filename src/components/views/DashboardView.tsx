"use client";

import React from "react";
import { useSchool } from "@/context/SchoolContext";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Bus,
  ShieldCheck,
  ArrowUpRight,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function DashboardView() {
  const {
    students,
    staff,
    transactions,
    kidMonitor,
    announcements,
    houseStandings,
    setActiveTab,
    setIsMobileSimulator,
  } = useSchool();

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSurplus = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>2026/2027 Academic Session • 1st Term in Progress</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to Apex Academics ERP
          </h2>
          <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
            All 22 integrated school modules are running live. Monitor academics, finance, student transit, CBT examinations, and pastoral care in real-time.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab("attendance")}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Roll-Call</span>
            </button>
            <button
              onClick={() => setActiveTab("cbt")}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Launch CBT Exam</span>
            </button>
            <button
              onClick={() => setIsMobileSimulator(true)}
              className="px-3.5 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <span>Open Mobile App Simulator</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("students")}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{students.length * 52 + 18}</span>
            <span className="text-xs font-semibold text-emerald-600">+14 this term</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">98.4% Average Attendance</p>
        </div>

        <div
          onClick={() => setActiveTab("students")}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic & Staff
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{staff.length * 8 + 4}</span>
            <span className="text-xs font-semibold text-slate-500">Full Faculty</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">100% Monthly Payroll Verified</p>
        </div>

        <div
          onClick={() => setActiveTab("accounting")}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Term Fee Collection
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₦{(totalIncome / 1000000).toFixed(1)}M</span>
            <span className="text-xs font-semibold text-emerald-600">+8.5% YoY</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Paystack Automated Settlement</p>
        </div>

        <div
          onClick={() => setActiveTab("kid_monitor")}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kid Monitor & Safety
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">All Safe</span>
            <span className="text-xs font-semibold text-slate-500">Inside Campus</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">RFID Gates & GPS Fleet Synced</p>
        </div>
      </div>

      {/* Middle Row: Live Kid Monitor Alert + House Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kid Monitor Live Card */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="font-bold text-slate-900 text-sm">
                Kid Monitor: Live Campus Arrival & Transit Radar
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("kid_monitor")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Full Gate Log →
            </button>
          </div>

          <div className="space-y-3">
            {kidMonitor.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                    {log.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{log.studentName}</p>
                    <p className="text-slate-500 text-[11px]">
                      {log.className} • In via {log.gatekeeper}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.busStatus}</span>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Checked-in at {log.gateCheckIn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* House Points Leaderboard */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>House Cup Standings</span>
              </h3>
              <button
                onClick={() => setActiveTab("house_points")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Award Points →
              </button>
            </div>

            <div className="space-y-2.5">
              {houseStandings.map((h) => (
                <div
                  key={h.house}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{h.emblem}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{h.house}</p>
                      <p className="text-[10px] text-slate-400">Rank #{h.rank}</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-xs">
                    {h.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Inter-House Sports Gala:</span>
            <span className="font-semibold text-blue-600">Nov 14, 2026</span>
          </div>
        </div>
      </div>

      {/* Announcements Feed Preview */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">Official School Announcements & Bulletin</h3>
          <button
            onClick={() => setActiveTab("news")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Open News Feed →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {ann.category}
                </span>
                <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-2">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-3">
                  {ann.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{ann.date}</span>
                <span className="font-medium text-slate-600">{ann.likes} acknowledges</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
