"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createStudentAction,
  getStudentsAction,
} from "@/actions/students";
import {
  getTodayAttendanceAction,
  markAttendanceAction,
} from "@/actions/attendance";
import {
  admitApplicantAction,
  getAdmissionApplicantsAction,
} from "@/actions/admissions";
import type {
  StudentRecord,
  StaffRecord,
  GradeItem,
  KidMonitorLogRecord,
  AccountingTransactionRecord,
  ApplicantRecord,
  LessonNoteRecord,
  ChatMessageRecord,
} from "@/lib/initial-data";
import type { Role, UserSession } from "@/lib/permissions";
import { toStudentRecord } from "@/lib/student-mapping";

type SchoolInitialData = {
  staff: typeof import("@/lib/initial-data").INITIAL_STAFF;
  grades: typeof import("@/lib/initial-data").INITIAL_GRADES;
  kidMonitor: typeof import("@/lib/initial-data").INITIAL_KID_MONITOR;
  transactions: typeof import("@/lib/initial-data").INITIAL_TRANSACTIONS;
  announcements: typeof import("@/lib/initial-data").INITIAL_ANNOUNCEMENTS;
  lessonNotes: typeof import("@/lib/initial-data").INITIAL_LESSON_NOTES;
  inventory: typeof import("@/lib/initial-data").INITIAL_INVENTORY;
  discipline: typeof import("@/lib/initial-data").INITIAL_DISCIPLINE;
  houseStandings: typeof import("@/lib/initial-data").INITIAL_HOUSE_STANDINGS;
};

type NewStudentInput = Pick<
  StudentRecord,
  | "firstName"
  | "lastName"
  | "gender"
  | "className"
  | "dob"
  | "house"
  | "bloodGroup"
  | "address"
  | "photoUrl"
  | "parentName"
  | "parentPhone"
  | "parentEmail"
>;

interface SchoolContextType {
  currentUser: UserSession;
  currentRole: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  students: StudentRecord[];
  attendanceStatuses: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">;
  staff: StaffRecord[];
  grades: GradeItem[];
  kidMonitor: KidMonitorLogRecord[];
  transactions: AccountingTransactionRecord[];
  applicants: ApplicantRecord[];
  announcements: SchoolInitialData["announcements"];
  lessonNotes: LessonNoteRecord[];
  inventory: SchoolInitialData["inventory"];
  discipline: SchoolInitialData["discipline"];
  houseStandings: SchoolInitialData["houseStandings"];
  chatMessages: ChatMessageRecord[];
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  addStudent: (student: NewStudentInput) => Promise<void>;
  addStaff: (staff: Omit<StaffRecord, "id" | "status">) => void;
  markAttendance: (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
  ) => Promise<void>;
  runPayroll: () => void;
  processPayment: (studentId: string, amount: number, reference: string) => void;
  awardHousePoints: (house: string, points: number, reason: string) => void;
  addLessonNote: (note: Omit<LessonNoteRecord, "id" | "date" | "status">) => void;
  approveLessonNote: (id: string) => void;
  admitApplicant: (id: string, dateOfBirth: string) => Promise<boolean>;
  addDisciplineIncident: (incident: { studentId: string; infraction: string; sanction: string }) => void;
  sendChatMessage: (content: string, channel: string) => void;
  sendBroadcast: (title: string, message: string, channel: string, target: string) => void;
  restockInventory: (id: string, amount: number) => void;
  issueInventory: (id: string, amount: number) => void;
  activeNotification: string | null;
  activeNotificationType: "success" | "error";
  dismissNotification: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);
const ACTIVE_TAB_STORAGE_KEY = "apex-academics-active-tab";
const ACTIVE_TAB_IDS = new Set([
  "dashboard",
  "students",
  "staff",
  "attendance",
  "grading",
  "accounting",
  "admission",
  "accounts",
]);

export function SchoolProvider({
  children,
  user,
  initialData,
}: {
  children: React.ReactNode;
  user: UserSession;
  initialData: SchoolInitialData;
}) {
  const currentRole = user.role;
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [activeNotificationType, setActiveNotificationType] = useState<
    "success" | "error"
  >("success");

  useEffect(() => {
    const savedTab = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    if (savedTab && ACTIVE_TAB_IDS.has(savedTab)) {
      setActiveTab(savedTab);
    } else {
      window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, "dashboard");
    }
  }, []);

  const selectActiveTab = useCallback((tab: string) => {
    if (!ACTIVE_TAB_IDS.has(tab)) return;
    window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab);
    setActiveTab(tab);
  }, []);

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<
    Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">
  >({});
  const [staff, setStaff] = useState<StaffRecord[]>(initialData.staff);
  const [grades] = useState<GradeItem[]>(initialData.grades);
  const [kidMonitor] = useState<KidMonitorLogRecord[]>(initialData.kidMonitor);
  const [transactions, setTransactions] =
    useState<AccountingTransactionRecord[]>(initialData.transactions);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [announcements] = useState(initialData.announcements);
  const [lessonNotes, setLessonNotes] = useState<LessonNoteRecord[]>(
    initialData.lessonNotes,
  );
  const [inventory, setInventory] = useState(initialData.inventory);
  const [discipline, setDiscipline] = useState(initialData.discipline);
  const [houseStandings, setHouseStandings] = useState(
    initialData.houseStandings,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessageRecord[]>([]);

  const notify = useCallback((msg: string, type: "success" | "error" = "success") => {
    setActiveNotificationType(type);
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  useEffect(() => {
    let active = true;

    const loadPersistedData = async () => {
      try {
        const [studentResult, attendanceResult, applicantResult] =
          await Promise.all([
            user.role === "ADMIN" ||
            user.role === "TEACHER"
              ? getStudentsAction()
              : Promise.resolve(null),
            user.role === "ADMIN" || user.role === "TEACHER"
              ? getTodayAttendanceAction()
              : Promise.resolve(null),
            user.role === "ADMIN"
              ? getAdmissionApplicantsAction()
              : Promise.resolve(null),
          ]);
        if (!active) return;

        if (studentResult?.success) {
          setStudents(studentResult.students.map(toStudentRecord));
        } else if (studentResult) {
          notify(studentResult.error, "error");
        }

        if (attendanceResult?.success) {
          setAttendanceStatuses(attendanceResult.attendanceStatuses);
        } else if (attendanceResult) {
          notify(attendanceResult.error, "error");
        }

        if (applicantResult?.success) {
          setApplicants(applicantResult.applicants);
        } else if (applicantResult) {
          notify(applicantResult.error, "error");
        }
      } catch (error: unknown) {
        console.error(
          "Could not load persisted school data.",
          error instanceof Error ? error.name : "Unknown error",
        );
        if (active) {
          notify("Could not load school records. Please refresh to try again.", "error");
        }
      }
    };

    void loadPersistedData();
    return () => {
      active = false;
    };
  }, [notify, user.role]);

  const addStudent = async (
    data: NewStudentInput,
  ) => {
    try {
      const result = await createStudentAction({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        className: data.className,
        dob: data.dob,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        house: data.house,
        bloodGroup: data.bloodGroup,
        address: data.address,
        photoUrl: data.photoUrl,
      });

      if (!result.success) {
        notify(result.error || "Unable to admit applicant.", "error");
        return;
      }

      const newStudent = toStudentRecord(result.student);
      setStudents((prev) => [newStudent, ...prev]);
      notify(
        `New student enrolled: ${newStudent.firstName} ${newStudent.lastName} (${newStudent.admissionNo})`,
      );
    } catch (error: unknown) {
      console.error(
        "Could not create student.",
        error instanceof Error ? error.name : "Unknown error",
      );
      notify("Could not save the student. Please try again.", "error");
    }
  };

  const addStaff = (data: Omit<StaffRecord, "id" | "status">) => {
    const newStaff: StaffRecord = {
      ...data,
      id: `stf_${Date.now()}`,
      status: "ACTIVE",
    };
    setStaff((prev) => [newStaff, ...prev]);
    notify(`New Staff appointed: ${newStaff.firstName} ${newStaff.lastName} (${newStaff.designation})`);
  };

  const markAttendance = async (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
  ) => {
    const student = students.find((s) => s.id === studentId);
    try {
      const result = await markAttendanceAction({ studentId, status });
      if (!result.success) {
        notify(result.error, "error");
        return;
      }
      setAttendanceStatuses((prev) => ({
        ...prev,
        [result.record.studentId]: result.record.status,
      }));
      notify(
        `Attendance recorded for ${student?.firstName || "Student"}: ${status}`,
      );
    } catch (error: unknown) {
      console.error(
        "Could not save attendance.",
        error instanceof Error ? error.name : "Unknown error",
      );
      notify("Could not save attendance. Please try again.", "error");
    }
  };

  const runPayroll = () => {
    const totalPayroll = staff.reduce((acc, curr) => acc + (curr.salaryBase + curr.allowances - curr.deductions), 0);
    const newTx: AccountingTransactionRecord = {
      id: `tx_${Date.now()}`,
      type: "EXPENSE",
      category: "Salaries & Payroll",
      amount: totalPayroll,
      description: `Disbursed monthly payroll for ${staff.length} staff members (E-Transfer Batch)`,
      date: new Date().toISOString().split("T")[0],
      reference: `PAYROLL-${Date.now().toString().slice(-6)}`,
      recordedBy: "Bursary Automated Engine",
      status: "VERIFIED",
    };
    setTransactions((prev) => [newTx, ...prev]);
    notify(`Payroll successfully disbursed: ₦${totalPayroll.toLocaleString()} to ${staff.length} staff members.`);
  };

  const processPayment = (studentId: string, amount: number, reference: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const remaining = Math.max(0, s.feesDue - amount);
          return {
            ...s,
            feesDue: remaining,
            feesStatus: remaining === 0 ? "PAID" : "PARTIAL",
          };
        }
        return s;
      })
    );

    const student = students.find((s) => s.id === studentId);
    const newTx: AccountingTransactionRecord = {
      id: `tx_${Date.now()}`,
      type: "INCOME",
      category: "Tuition Fees",
      amount: amount,
      description: `Paystack fee settlement for ${student?.firstName} ${student?.lastName} (${student?.admissionNo})`,
      date: new Date().toISOString().split("T")[0],
      reference: reference,
      recordedBy: "Paystack Payment Gateway Webhook",
      status: "VERIFIED",
    };
    setTransactions((prev) => [newTx, ...prev]);
    notify(`Payment of ₦${amount.toLocaleString()} confirmed via Paystack. Receipt generated!`);
  };

  const awardHousePoints = (houseName: string, points: number, reason: string) => {
    setHouseStandings((prev) =>
      prev
        .map((h) => (h.house === houseName ? { ...h, points: h.points + points } : h))
        .sort((a, b) => b.points - a.points)
        .map((h, index) => ({ ...h, rank: index + 1 }))
    );
    notify(`+${points} Points awarded to ${houseName}! Reason: ${reason}`);
  };

  const addLessonNote = (note: Omit<LessonNoteRecord, "id" | "date" | "status">) => {
    const newNote: LessonNoteRecord = {
      ...note,
      id: `ln_${Date.now()}`,
      status: "APPROVED",
      date: new Date().toISOString().split("T")[0],
    };
    setLessonNotes((prev) => [newNote, ...prev]);
    notify(`Lesson Note for "${newNote.topic}" submitted and approved.`);
  };

  const approveLessonNote = (id: string) => {
    setLessonNotes((prev) => prev.map((n) => (n.id === id ? { ...n, status: "APPROVED" } : n)));
    notify("Lesson Note approved by Head of Department.");
  };

  const admitApplicant = async (id: string, dateOfBirth: string) => {
    try {
      const result = await admitApplicantAction({
        applicantId: id,
        dateOfBirth,
      });

      if (!result.success) {
        notify(result.error || "Unable to admit applicant.", "error");
        return false;
      }

      setApplicants((previous) =>
        previous.map((applicant) =>
          applicant.id === result.applicant.id
            ? result.applicant
            : applicant,
        ),
      );
      setStudents((previous) => [
        toStudentRecord(result.student),
        ...previous.filter((student) => student.id !== result.student.id),
      ]);
      notify(
        `${result.applicant.firstName} ${result.applicant.lastName} admitted and saved to the student directory.`,
      );
      return true;
    } catch (error: unknown) {
      console.error(
        "Could not admit applicant.",
        error instanceof Error ? error.name : "Unknown error",
      );
      notify("Could not admit the applicant. Please try again.", "error");
      return false;
    }
  };

  const addDisciplineIncident = (data: { studentId: string; infraction: string; sanction: string }) => {
    const student = students.find((s) => s.id === data.studentId);
    const newInc = {
      id: `dsc_${Date.now()}`,
      studentId: data.studentId,
      studentName: `${student?.firstName} ${student?.lastName}`,
      className: student?.className || "Grade 11",
      infraction: data.infraction,
      sanction: data.sanction,
      reportedBy: user.name,
      date: new Date().toISOString().split("T")[0],
      status: "RESOLVED" as const,
      parentNotified: true,
    };
    setDiscipline((prev) => [newInc, ...prev]);
    notify(`Disciplinary incident logged for ${newInc.studentName}. Automated SMS dispatch queued to parents.`);
  };

  const sendChatMessage = (content: string, channel: string) => {
    const newMsg: ChatMessageRecord = {
      id: `msg_${Date.now()}`,
      senderName: user.name,
      senderRole: user.role,
      avatar: user.avatar ?? "",
      channel,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const sendBroadcast = (title: string, message: string, channel: string, target: string) => {
    notify(`Broadcast "${title}" delivered to ${target} via ${channel} (${students.length * 2} recipients reached).`);
  };

  const restockInventory = (id: string, amount: number) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + amount } : item)));
    notify(`Inventory restocked: +${amount} units added.`);
  };

  const issueInventory = (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty - amount) } : item))
    );
    notify(`Inventory issued: ${amount} units dispatched.`);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser: user,
        currentRole,
        activeTab,
        setActiveTab: selectActiveTab,
        students,
        attendanceStatuses,
        staff,
        grades,
        kidMonitor,
        transactions,
        applicants,
        announcements,
        lessonNotes,
        inventory,
        discipline,
        houseStandings,
        chatMessages,
        isMobileSimulator,
        setIsMobileSimulator,
        addStudent,
        addStaff,
        markAttendance,
        runPayroll,
        processPayment,
        awardHousePoints,
        addLessonNote,
        approveLessonNote,
        admitApplicant,
        addDisciplineIncident,
        sendChatMessage,
        sendBroadcast,
        restockInventory,
        issueInventory,
        activeNotification,
        activeNotificationType,
        dismissNotification: () => setActiveNotification(null),
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}
