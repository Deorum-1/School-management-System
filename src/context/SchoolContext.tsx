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
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_GRADES,
  INITIAL_KID_MONITOR,
  INITIAL_TRANSACTIONS,
  INITIAL_APPLICANTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LESSON_NOTES,
  INITIAL_HOUSE_STANDINGS,
  INITIAL_INVENTORY,
  INITIAL_DISCIPLINE,
  StudentRecord,
  StaffRecord,
  GradeItem,
  KidMonitorLogRecord,
  AccountingTransactionRecord,
  ApplicantRecord,
  LessonNoteRecord,
  ChatMessageRecord,
} from "@/lib/initial-data";
import { Role } from "@/lib/permissions";
import { DEMO_USERS } from "@/lib/auth";
import { toStudentRecord } from "@/lib/student-mapping";

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
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  students: StudentRecord[];
  attendanceStatuses: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">;
  staff: StaffRecord[];
  grades: GradeItem[];
  kidMonitor: KidMonitorLogRecord[];
  transactions: AccountingTransactionRecord[];
  applicants: ApplicantRecord[];
  announcements: typeof INITIAL_ANNOUNCEMENTS;
  lessonNotes: LessonNoteRecord[];
  inventory: typeof INITIAL_INVENTORY;
  discipline: typeof INITIAL_DISCIPLINE;
  houseStandings: typeof INITIAL_HOUSE_STANDINGS;
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
  admitApplicant: (id: string) => void;
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

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>("ADMIN");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [activeNotificationType, setActiveNotificationType] = useState<
    "success" | "error"
  >("success");

  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [attendanceStatuses, setAttendanceStatuses] = useState<
    Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">
  >({});
  const [staff, setStaff] = useState<StaffRecord[]>(INITIAL_STAFF);
  const [grades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [kidMonitor] = useState<KidMonitorLogRecord[]>(INITIAL_KID_MONITOR);
  const [transactions, setTransactions] = useState<AccountingTransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);
  const [announcements] = useState(INITIAL_ANNOUNCEMENTS);
  const [lessonNotes, setLessonNotes] = useState<LessonNoteRecord[]>(INITIAL_LESSON_NOTES);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [discipline, setDiscipline] = useState(INITIAL_DISCIPLINE);
  const [houseStandings, setHouseStandings] = useState(INITIAL_HOUSE_STANDINGS);

  const [chatMessages, setChatMessages] = useState<ChatMessageRecord[]>([
    {
      id: "msg_1",
      senderName: "Mr. David Adeleke",
      senderRole: "Senior Physics Master",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      channel: "SS 2 Science Parents",
      content:
        "Good morning esteemed parents. Please be advised that the STEM Robotics Project submissions and Physics laboratory practicals conclude this Thursday at 3:00 PM.",
      timestamp: "08:15 AM",
    },
    {
      id: "msg_2",
      senderName: "Chief Adebayo Balogun",
      senderRole: "Parent (Tunde & Sarah Balogun)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      channel: "SS 2 Science Parents",
      content:
        "Thank you Mr. Adeleke. Tunde mentioned the solar prototype trials yesterday. We appreciate the extra coaching hours provided by the physics department.",
      timestamp: "08:42 AM",
    },
    {
      id: "msg_3",
      senderName: "Dr. Kenneth Eze",
      senderRole: "Parent (Chioma Eze)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      channel: "SS 2 Science Parents",
      content:
        "Chioma also completed her research summary on electromagnetism. We look forward to the upcoming Science Olympiad awards ceremony.",
      timestamp: "09:05 AM",
    },
  ]);

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
        const [studentResult, attendanceResult] = await Promise.all([
          getStudentsAction(),
          getTodayAttendanceAction(),
        ]);
        if (!active) return;

        if (studentResult.success) {
          setStudents(studentResult.students.map(toStudentRecord));
        } else {
          notify(studentResult.error, "error");
        }

        if (attendanceResult.success) {
          setAttendanceStatuses(attendanceResult.attendanceStatuses);
        } else {
          notify(attendanceResult.error, "error");
        }
      } catch (error: unknown) {
        console.error("Could not load persisted school data.", error);
        if (active) {
          notify("Could not load school records. Please refresh to try again.", "error");
        }
      }
    };

    void loadPersistedData();
    return () => {
      active = false;
    };
  }, [notify]);

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
        notify(result.error, "error");
        return;
      }

      const newStudent = toStudentRecord(result.student);
      setStudents((prev) => [newStudent, ...prev]);
      notify(
        `New student enrolled: ${newStudent.firstName} ${newStudent.lastName} (${newStudent.admissionNo})`,
      );
    } catch (error: unknown) {
      console.error("Could not create student.", error);
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
      console.error("Could not save attendance.", error);
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

  const admitApplicant = (id: string) => {
    const applicant = applicants.find((a) => a.id === id);
    if (!applicant) return;

    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: "ADMITTED" } : a)));

    const newStudent: StudentRecord = {
      id: `std_${Date.now()}`,
      admissionNo: `APX/2027/${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      gender: applicant.gender,
      className: applicant.intendedClass,
      classId: "cls_new",
      house: "Blue Phoenix",
      dob: "2013-05-10",
      bloodGroup: "O+",
      address: "Victoria Island, Lagos",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
      parentName: applicant.parentName,
      parentPhone: applicant.parentPhone,
      parentEmail: applicant.parentEmail,
      status: "ACTIVE",
      feesStatus: "PENDING",
      feesDue: 350000,
    };
    setStudents((prev) => [newStudent, ...prev]);
    notify(`Applicant ${applicant.firstName} ${applicant.lastName} admitted! Added to active student roster.`);
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
      reportedBy: DEMO_USERS[currentRole].name,
      date: new Date().toISOString().split("T")[0],
      status: "RESOLVED" as const,
      parentNotified: true,
    };
    setDiscipline((prev) => [newInc, ...prev]);
    notify(`Disciplinary incident logged for ${newInc.studentName}. Automated SMS dispatch queued to parents.`);
  };

  const sendChatMessage = (content: string, channel: string) => {
    const user = DEMO_USERS[currentRole];
    const newMsg: ChatMessageRecord = {
      id: `msg_${Date.now()}`,
      senderName: user.name,
      senderRole: user.role,
      avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
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
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
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
