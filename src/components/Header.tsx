"use client";

import React, { useState } from "react";
import { useSchool } from "@/context/SchoolContext";
import { DEMO_USERS } from "@/lib/auth";
import { Role } from "@/lib/permissions";
import {
  Bell,
  Search,
  Smartphone,
  ChevronDown,
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const {
    currentRole,
    setCurrentRole,
    isMobileSimulator,
    setIsMobileSimulator,
    setActiveTab,
    students,
  } = useSchool();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof students>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const currentUser = DEMO_USERS[currentRole];

  const handleRoleSelect = (role: Role) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    if (role === "PARENT") setActiveTab("parent_portal");
    else if (role === "STUDENT") setActiveTab("cbt");
    else if (role === "TEACHER") setActiveTab("attendance");
    else setActiveTab("dashboard");
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q.toLowerCase()) ||
        s.lastName.toLowerCase().includes(q.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(q.toLowerCase()) ||
        s.className.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Left side: Mobile menu & Brand indicator */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">
            AP
          </span>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-800 leading-tight">
              Apex Academics SMS
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              2026/2027 Session • 1st Term
            </p>
          </div>
        </div>
      </div>

      {/* Center: Quick Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, admissions, records... (e.g. Tunde, Chioma)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearchModal(true)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Live Search Popup */}
        {showSearchModal && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Matching Student Records ({searchResults.length})</span>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching student found.
                </div>
              ) : (
                searchResults.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveTab("students");
                      setShowSearchModal(false);
                      setSearchQuery("");
                    }}
                    className="p-3 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.photoUrl}
                        alt={s.firstName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.admissionNo} • {s.className}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {s.house}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Role Switcher & Mobile Simulator Toggle & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Simulator Toggle */}
        <button
          onClick={() => setIsMobileSimulator(!isMobileSimulator)}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            isMobileSimulator
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          }`}
          title="Toggle Mobile Companion App Simulator"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile App</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 text-[11px]">Role:</span>
              <span className="font-semibold text-slate-900">{currentRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 divide-y divide-slate-100">
              <div className="px-3 py-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Switch Perspective
              </div>
              <div className="py-1">
                <button
                  onClick={() => handleRoleSelect("ADMIN")}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === "ADMIN" ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-[10px] text-slate-500">Dr. Katherine Vance (Principal)</div>
                    </div>
                  </div>
                  {currentRole === "ADMIN" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => handleRoleSelect("TEACHER")}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === "TEACHER" ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Teacher</div>
                      <div className="text-[10px] text-slate-500">Mr. David Adeleke (SS 2 Physics)</div>
                    </div>
                  </div>
                  {currentRole === "TEACHER" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => handleRoleSelect("PARENT")}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === "PARENT" ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium">Parent Portal</div>
                      <div className="text-[10px] text-slate-500">Chief & Mrs. Adebayo Balogun</div>
                    </div>
                  </div>
                  {currentRole === "PARENT" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => handleRoleSelect("STUDENT")}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === "STUDENT" ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-[10px] text-slate-500">Tunde Balogun (SS 2)</div>
                    </div>
                  </div>
                  {currentRole === "STUDENT" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => handleRoleSelect("ACCOUNTANT")}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === "ACCOUNTANT" ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium">Bursary & Accounts</div>
                      <div className="text-[10px] text-slate-500">Mrs. Folake Sanusi (CPA)</div>
                    </div>
                  </div>
                  {currentRole === "ACCOUNTANT" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar badge */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser.name.split(" ")[0]} {currentUser.name.split(" ")[1]}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
