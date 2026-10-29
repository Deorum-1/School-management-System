"use client";

import React from "react";
import { X, Printer, ShieldCheck, DollarSign } from "lucide-react";
import { StaffRecord } from "@/lib/initial-data";

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffRecord;
}

export function PayslipModal({ isOpen, onClose, staff }: PayslipModalProps) {
  if (!isOpen) return null;

  const grossEarnings = staff.salaryBase + staff.allowances;
  const netSalary = grossEarnings - staff.deductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:m-0 print:border-none print:shadow-none print:w-full">
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Confidential Employee Salary Advice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-white text-slate-800" id="payslip-doc">
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-900">APEX ACADEMICS INTERNATIONAL</h3>
              <p className="text-xs text-slate-500">Corporate Payroll & Compensation Directorate</p>
              <p className="text-[11px] text-slate-400">Monthly Compensation Advice for October 2026</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                Status: PAID
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: PAY-OCT-2026-APX</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs mb-5 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Employee Name</span>
              <span className="font-bold text-slate-800">{staff.firstName} {staff.lastName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Staff Number</span>
              <span className="font-mono font-bold text-slate-800">{staff.staffNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Designation</span>
              <span className="font-medium text-slate-700">{staff.designation}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Department</span>
              <span className="font-medium text-slate-700">{staff.department}</span>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                Earnings (₦)
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Consolidated Salary:</span>
                  <span className="font-mono font-semibold">₦{staff.salaryBase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Housing Allowance:</span>
                  <span className="font-mono font-semibold">₦{(staff.allowances * 0.55).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transport & Utility Allowance:</span>
                  <span className="font-mono font-semibold">₦{(staff.allowances * 0.45).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Earnings:</span>
                  <span className="font-mono text-emerald-700">₦{grossEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                Statutory Deductions (₦)
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">PAYE State Income Tax:</span>
                  <span className="font-mono font-semibold">₦{(staff.deductions * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Contributory Pension (8%):</span>
                  <span className="font-mono font-semibold">₦{(staff.deductions * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">National Health Insurance (NHIS):</span>
                  <span className="font-mono font-semibold">₦{(staff.deductions * 0.1).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Deductions:</span>
                  <span className="font-mono text-rose-600">₦{staff.deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Banner */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase">Net Take-Home Pay</span>
              <p className="text-[11px] text-emerald-700">Transferred directly to Bank Account (Zenith Bank Plc)</p>
            </div>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ₦{netSalary.toLocaleString()}
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Certified by Bursar Mrs. Folake Sanusi</span>
            </div>
            <span>Generated on 29 October 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
