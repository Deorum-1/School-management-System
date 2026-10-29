"use client";

import React from "react";
import { useSchool } from "@/context/SchoolContext";
import { CheckCircle2, X } from "lucide-react";

export function NotificationToast() {
  const { activeNotification, dismissNotification } = useSchool();

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 animate-slideUp">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-xs font-medium">{activeNotification}</span>
      <button
        onClick={dismissNotification}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
