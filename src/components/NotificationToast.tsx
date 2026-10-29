"use client";

import React from "react";
import { useSchool } from "@/context/SchoolContext";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export function NotificationToast() {
  const {
    activeNotification,
    activeNotificationType,
    dismissNotification,
  } = useSchool();

  if (!activeNotification) return null;
  const isError = activeNotificationType === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white shadow-2xl animate-slideUp"
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      )}
      <span className="text-xs font-medium">{activeNotification}</span>
      <button
        aria-label="Dismiss notification"
        onClick={dismissNotification}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
