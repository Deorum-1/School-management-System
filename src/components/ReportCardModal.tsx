"use client";

import React from "react";
import { X, Printer, CheckCircle, Shield } from "lucide-react";
import type { StudentRecord, GradeItem } from "@/lib/initial-data";

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  grades: GradeItem[];
}

export function ReportCardModal({
  isOpen,
  onClose,
  student,
  grades,
}: ReportCardModalProps) {
  if (!isOpen) return null;

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const totalScore = studentGrades.reduce((sum, g) => sum + g.total, 0);
  const averageScore = studentGrades.length > 0 ? (totalScore / studentGrades.length).toFixed(1) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:m-0 print:border-none print:shadow-none print:w-full">
        {/* Top bar (Hidden when printing) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold">Official Terminal Report Sheet Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-6 sm:p-8 bg-white text-slate-800" id="printable-report">
          {/* Header & Crest */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow">
                AP
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  APEX ACADEMICS INTERNATIONAL
                </h2>
                <p className="text-xs font-semibold text-blue-800 italic">
                  &quot;Excellence, Integrity, and Leadership&quot;
                </p>
                <p className="text-[11px] text-slate-500">
                  Plot 10 Admiralty Way, Lekki Phase 1, Lagos, Nigeria • info@apexacademics.edu
                </p>
              </div>
            </div>
            <div className="inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full mt-2">
              Continuous Assessment & Terminal Examination Report Card
            </div>
          </div>

          {/* Student Bio Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Student Name</span>
              <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Admission No.</span>
              <span className="font-mono font-bold text-slate-800">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class & Session</span>
              <span className="font-semibold text-slate-800">{student.className} • 2026/2027</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Term / House</span>
              <span className="font-semibold text-slate-800">1st Term • {student.house}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Times School Opened</span>
              <span className="font-semibold text-slate-800">118 Sessions</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Times Present</span>
              <span className="font-semibold text-emerald-700">118 (100% Attendance)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class Position</span>
              <span className="font-bold text-blue-700">1st of 32 Students</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Term Average</span>
              <span className="font-black text-slate-900">{averageScore}% (Distinction)</span>
            </div>
          </div>

          {/* Academic Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="border border-slate-300 p-2">Subject</th>
                  <th className="border border-slate-300 p-2 text-center">CA 1 (15)</th>
                  <th className="border border-slate-300 p-2 text-center">CA 2 (15)</th>
                  <th className="border border-slate-300 p-2 text-center">CA 3 (10)</th>
                  <th className="border border-slate-300 p-2 text-center">Exam (60)</th>
                  <th className="border border-slate-300 p-2 text-center font-black">Total (100)</th>
                  <th className="border border-slate-300 p-2 text-center">Grade</th>
                  <th className="border border-slate-300 p-2">Subject Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 font-semibold text-slate-900">{g.subject}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{g.ca1}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{g.ca2}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{g.ca3}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{g.exam}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-700">{g.total}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px]">
                        {g.grade}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-600 text-[11px] italic">{g.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Affective & Psychomotor Traits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">
                Affective & Behavioral Traits (1 - 5)
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>Punctuality & Regularity:</span> <span className="font-bold text-blue-600">5 / 5 (Excellent)</span></div>
                <div className="flex justify-between"><span>Neatness & Uniform:</span> <span className="font-bold text-blue-600">5 / 5 (Spotless)</span></div>
                <div className="flex justify-between"><span>Politeness & Cooperation:</span> <span className="font-bold text-blue-600">5 / 5 (Exemplary)</span></div>
                <div className="flex justify-between"><span>Leadership Initiative:</span> <span className="font-bold text-blue-600">4 / 5 (Very Good)</span></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">
                Psychomotor & Skills Domain (1 - 5)
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>Handwriting & Presentation:</span> <span className="font-bold text-emerald-600">5 / 5</span></div>
                <div className="flex justify-between"><span>Sports & Athletic Drills:</span> <span className="font-bold text-emerald-600">5 / 5</span></div>
                <div className="flex justify-between"><span>Laboratory Practical Competence:</span> <span className="font-bold text-emerald-600">5 / 5</span></div>
                <div className="flex justify-between"><span>Verbal Articulation:</span> <span className="font-bold text-emerald-600">4 / 5</span></div>
              </div>
            </div>
          </div>

          {/* Teacher and Principal Signoff */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-slate-700">Class Tutor Remarks:</p>
              <p className="italic text-slate-600 mt-1">
                &quot;Tunde has displayed an extraordinary work ethic this term, leading the science department in practical inquiry. Maintain this trajectory for the WASSCE & SAT.&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                <span>Mr. David Adeleke, M.Sc</span>
                <span className="text-slate-300">•</span>
                <span>Signed electronically</span>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-700">Principal&apos;s Certification:</p>
              <p className="italic text-slate-600 mt-1">
                &quot;A quintessential scholar and a proud ambassador of Apex Academics. Promoted with High Honors.&quot;
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 font-bold text-[11px]">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Dr. Katherine Vance (Head of School)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
