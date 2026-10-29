"use client";

import React from "react";
import { X, Printer, ShieldCheck, Award } from "lucide-react";
import { StudentRecord } from "@/lib/initial-data";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
}

export function TranscriptModal({ isOpen, onClose, student }: TranscriptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:m-0 print:border-none print:shadow-none print:w-full">
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">Official Academic Transcript Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Transcript</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-[#fdfbf7] text-slate-900 border-8 border-double border-amber-900/20" id="transcript-doc">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <div className="inline-block p-2 rounded-full border-2 border-slate-800 mb-2">
              <span className="font-serif font-black text-2xl tracking-widest text-slate-900">APEX</span>
            </div>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-slate-900">
              Apex Academics International College
            </h2>
            <p className="text-xs uppercase font-mono tracking-widest text-slate-600">
              Office of the Registrar & Academic Records
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Accredited by the Ministry of Education & Cambridge International Examinations (CIE)
            </p>
            <div className="mt-3 inline-block px-4 py-1 bg-amber-900 text-white text-xs font-serif font-bold uppercase tracking-widest">
              Cumulative Academic Record & Official Transcript
            </div>
          </div>

          {/* Student metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/70 border border-amber-900/10 rounded-lg text-xs mb-6 font-serif">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Matriculation No.</span>
              <span className="font-bold font-mono text-slate-900">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Date of Birth</span>
              <span className="font-semibold">{student.dob}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Cumulative GPA (CGPA)</span>
              <span className="font-black text-emerald-800 text-sm font-sans">4.88 / 5.00</span>
            </div>
          </div>

          {/* Multi-term Sessions Transcript Grid */}
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif border-b border-amber-900/30 pb-1 mb-2">
                Senior Secondary 1 (Grade 10) • 2025/2026 Academic Session
              </h4>
              <table className="w-full text-xs font-serif border border-slate-300 bg-white">
                <thead className="bg-slate-100 font-sans text-[10px] uppercase text-slate-600">
                  <tr>
                    <th className="p-1.5 border text-left">Course Code & Title</th>
                    <th className="p-1.5 border text-center">Credit Units</th>
                    <th className="p-1.5 border text-center">Score (%)</th>
                    <th className="p-1.5 border text-center">Letter Grade</th>
                    <th className="p-1.5 border text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="p-1.5 border">MTH-101 General Mathematics</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">92%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">PHY-101 Principles of Physics</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">88%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">CHM-101 General Chemistry</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">85%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">ENG-101 English Language & Rhetoric</td><td className="p-1.5 border text-center">3</td><td className="p-1.5 border text-center">81%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">BIO-101 General Biology</td><td className="p-1.5 border text-center">3</td><td className="p-1.5 border text-center">78%</td><td className="p-1.5 border text-center font-bold">B2</td><td className="p-1.5 border text-center font-mono">4.0</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif border-b border-amber-900/30 pb-1 mb-2">
                Senior Secondary 2 (Grade 11) • 2026/2027 Academic Session (Current)
              </h4>
              <table className="w-full text-xs font-serif border border-slate-300 bg-white">
                <thead className="bg-slate-100 font-sans text-[10px] uppercase text-slate-600">
                  <tr>
                    <th className="p-1.5 border text-left">Course Code & Title</th>
                    <th className="p-1.5 border text-center">Credit Units</th>
                    <th className="p-1.5 border text-center">Score (%)</th>
                    <th className="p-1.5 border text-center">Letter Grade</th>
                    <th className="p-1.5 border text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="p-1.5 border">MTH-201 Pure & Applied Mathematics</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">91.5%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">PHY-201 Advanced Mechanics & Electromagnetism</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">90.5%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">CHM-201 Stoichiometry & Organic Chemistry</td><td className="p-1.5 border text-center">4</td><td className="p-1.5 border text-center">84.0%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                  <tr><td className="p-1.5 border">ENG-201 Advanced English Composition & Literature</td><td className="p-1.5 border text-center">3</td><td className="p-1.5 border text-center">82.0%</td><td className="p-1.5 border text-center font-bold">A1</td><td className="p-1.5 border text-center font-mono">5.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transcript Verification Seal */}
          <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-amber-900/40 flex flex-col items-center justify-center text-[9px] font-serif text-amber-900 font-bold uppercase text-center p-1">
                <span>OFFICIAL</span>
                <span>REGISTRAR</span>
                <span>SEAL</span>
              </div>
              <div className="text-[11px] text-slate-600">
                <p className="font-bold text-slate-800">Transcript Security Stamp</p>
                <p>Digital Cryptographic Hash: <span className="font-mono text-[9px]">0x8F9A...B321</span></p>
                <p>Verified in National Academic Registry</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold font-serif text-slate-900">Dr. Anthony Alabi, Ph.D</p>
              <p className="text-[11px] text-slate-600">Registrar & Controller of Academic Records</p>
              <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Genuine & Unaltered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
