"use client";

import React from "react";
import { useSchool } from "@/context/SchoolContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Wallet,
  Receipt,
  Bus,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  Clock,
  BookOpen,
  Boxes,
  HelpCircle,
  CreditCard,
  FileCheck2,
  Flag,
  FileText,
  Smile,
  Send,
  MessageSquare,
  Newspaper,
  HeartHandshake,
  Smartphone,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, currentRole, setIsMobileSimulator } = useSchool();

  const handleTabClick = (tabId: string) => {
    if (tabId === "mobile_app") {
      setIsMobileSimulator(true);
    }
    setActiveTab(tabId);
    onClose();
  };

  const navGroups = [
    {
      group: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
        { id: "parent_portal", label: "Parent Portal", icon: HeartHandshake, badge: "Live" },
        { id: "mobile_app", label: "Mobile Companion App", icon: Smartphone, badge: "PWA" },
      ],
    },
    {
      group: "ACADEMICS & CURRICULUM",
      items: [
        { id: "students", label: "Student & Staff Records", icon: Users },
        { id: "grading", label: "Grading & Results", icon: Award },
        { id: "cbt", label: "Computer-Based Test (CBT)", icon: HelpCircle, badge: "Quiz" },
        { id: "assignment", label: "Assignments & Homework", icon: FileCheck2 },
        { id: "timetable", label: "Class Timetable", icon: Clock },
        { id: "lesson_notes", label: "Lesson Notes & Plans", icon: BookOpen },
        { id: "transcript", label: "Academic Transcripts", icon: FileText },
      ],
    },
    {
      group: "STUDENT SAFETY & PASTORAL",
      items: [
        { id: "attendance", label: "Attendance Roll-Call", icon: CalendarCheck },
        { id: "kid_monitor", label: "Kid Monitor (Gate & Bus)", icon: Bus, badge: "GPS" },
        { id: "house_points", label: "House Points & Merits", icon: Flag },
        { id: "behavioural", label: "Behavioural System", icon: Smile },
        { id: "discipline", label: "Student Discipline Log", icon: ShieldAlert },
      ],
    },
    {
      group: "FINANCE & ASSETS",
      items: [
        { id: "payment", label: "Online Fee Payment", icon: CreditCard, badge: "Paystack" },
        { id: "accounting", label: "Accounting & Ledger", icon: Receipt },
        { id: "payroll", label: "Payroll Management", icon: Wallet },
        { id: "inventory", label: "Inventory Management", icon: Boxes },
        { id: "admission", label: "Admissions Pipeline", icon: Sparkles },
      ],
    },
    {
      group: "COMMUNICATION",
      items: [
        { id: "chat", label: "School Chat System", icon: MessageSquare, badge: "Real-time" },
        { id: "news", label: "News Feed & Notices", icon: Newspaper },
        { id: "broadcast", label: "SMS & Email Service", icon: Send },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/20">
              AP
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white block">
                APEX ACADEMICS
              </span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">
                Integrated School ERP
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-blue-900/60 text-blue-300 border border-blue-700/50"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & Session status */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-slate-200 truncate">
                Apex Portal Gateway
              </p>
              <p className="text-[10px] text-slate-400">
                All 22 Modules Active & Synced
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
