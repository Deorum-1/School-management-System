"use client";

import React, { useState } from "react";
import { useSchool } from "@/context/SchoolContext";
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  amount: number;
  invoiceTitle: string;
}

export function PaystackModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  amount,
  invoiceTitle,
}: PaystackModalProps) {
  const { processPayment } = useSchool();
  const [step, setStep] = useState<"CARD" | "PROCESSING" | "SUCCESS">("CARD");
  const [cardNumber, setCardNumber] = useState("4084 0000 0000 1289");
  const [expiry, setExpiry] = useState("08/28");
  const [cvv, setCvv] = useState("321");
  const [reference, setReference] = useState("");

  if (!isOpen) return null;

  const handlePay = () => {
    setStep("PROCESSING");
    const generatedRef = `PSTK-REF-${Math.floor(100000 + Math.random() * 900000)}`;
    setReference(generatedRef);

    setTimeout(() => {
      processPayment(studentId, amount, generatedRef);
      setStep("SUCCESS");
    }, 1800);
  };

  const handleDone = () => {
    setStep("CARD");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Paystack Header Banner */}
        <div className="bg-[#09A5DB] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm block">paystack</span>
              <span className="text-[10px] text-white/80 block font-medium">Secured Payment Gateway</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "CARD" && (
            <div>
              <div className="mb-5 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Apex Academics Bursary
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  ₦{amount.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {invoiceTitle} • {studentName}
                </p>
              </div>

              {/* Card Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium border border-slate-300 rounded-lg focus:outline-none focus:border-[#09A5DB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Valid Till
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#09A5DB]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      CVV
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#09A5DB]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={handlePay}
                  className="w-full py-3 bg-[#09A5DB] hover:bg-[#078cbd] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Pay ₦{amount.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL encrypted • PCI-DSS Level 1 Certified</span>
              </div>
            </div>
          )}

          {step === "PROCESSING" && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-[#09A5DB] animate-spin mx-auto mb-4" />
              <h4 className="text-base font-bold text-slate-800">
                Authorizing with Bank...
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Please wait while we complete the 3D-Secure verification.
              </p>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Tuition fee has been credited to Apex Academics.
              </p>

              <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">₦{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-medium text-slate-700">Mastercard (Debit)</span>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Close & View Updated Invoices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
