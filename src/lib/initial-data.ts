export interface StudentRecord {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  className: string;
  classId: string;
  house: "Red Dragon" | "Blue Phoenix" | "Green Falcon" | "Gold Lion";
  dob: string;
  bloodGroup: string;
  address: string;
  photoUrl: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: "ACTIVE" | "SUSPENDED" | "ALUMNI";
  feesStatus: "PAID" | "PENDING" | "PARTIAL";
  feesDue: number;
}

export interface StaffRecord {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "TEACHER" | "ADMIN" | "NURSE" | "BURSAR" | "SECURITY";
  department: string;
  designation: string;
  salaryBase: number;
  allowances: number;
  deductions: number;
  qualification: string;
  joinedDate: string;
  avatar: string;
  status: "ACTIVE" | "ON_LEAVE";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  timeIn: string;
  remarks?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  class: string;
  ca1: number; // Max 15
  ca2: number; // Max 15
  ca3: number; // Max 10
  exam: number; // Max 60
  total: number;
  grade: string;
  remark: string;
}

export interface ApplicantRecord {
  id: string;
  appNo: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  intendedClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "EXAM_SCHEDULED" | "INTERVIEW" | "ADMITTED" | "REJECTED";
  entranceScore?: number;
  appliedDate: string;
}

export interface KidMonitorLogRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  gateCheckIn: string;
  gateCheckOut: string | null;
  gatekeeper: string;
  busRoute: string;
  busStatus: "Safe At School" | "On Route 4 (In-Transit)" | "Home Disembarked";
  busDriver: string;
  pickupPerson: string;
  pickupOtp: string;
  infirmaryVisits: {
    date: string;
    symptom: string;
    treatment: string;
    nurse: string;
  }[];
}

export interface AccountingTransactionRecord {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  description: string;
  date: string;
  reference: string;
  recordedBy: string;
  status: "VERIFIED" | "PENDING";
}

export interface LessonNoteRecord {
  id: string;
  subject: string;
  className: string;
  teacherName: string;
  weekNumber: number;
  topic: string;
  objectives: string[];
  materials: string[];
  contentSummary: string;
  status: "APPROVED" | "SUBMITTED" | "NEEDS_REVISION";
  date: string;
}

export interface CBTQuestionRecord {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface AssignmentRecord {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherName: string;
  dueDate: string;
  maxScore: number;
  description: string;
  submissionsCount: number;
}

export interface HousePointAwardRecord {
  id: string;
  studentId: string;
  studentName: string;
  house: "Red Dragon" | "Blue Phoenix" | "Green Falcon" | "Gold Lion";
  points: number;
  reason: string;
  awardedBy: string;
  date: string;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  infraction: string;
  sanction: string;
  reportedBy: string;
  date: string;
  status: "RESOLVED" | "SERVING" | "PENDING_HEARING";
  parentNotified: boolean;
}

export interface ChatMessageRecord {
  id: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  channel: string;
  content: string;
  timestamp: string;
  isMe?: boolean;
}

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "std_01",
    admissionNo: "APX/2024/0089",
    firstName: "Tunde",
    lastName: "Balogun",
    gender: "MALE",
    className: "SS 2",
    classId: "cls_ss2_sci",
    house: "Blue Phoenix",
    dob: "2010-04-14",
    bloodGroup: "O+",
    address: "Plot 14 Admiralty Way, Lekki Phase 1, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    parentName: "Chief & Mrs. Adebayo Balogun",
    parentPhone: "+234 803 555 0192",
    parentEmail: "adebayo.balogun@gmail.com",
    status: "ACTIVE",
    feesStatus: "PENDING",
    feesDue: 350000,
  },
  {
    id: "std_02",
    admissionNo: "APX/2024/0104",
    firstName: "Chioma",
    lastName: "Eze",
    gender: "FEMALE",
    className: "SS 2",
    classId: "cls_ss2_sci",
    house: "Red Dragon",
    dob: "2010-09-22",
    bloodGroup: "A+",
    address: "24 Glover Road, Ikoyi, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    parentName: "Dr. Kenneth Eze",
    parentPhone: "+234 802 334 9910",
    parentEmail: "k.eze@lagosmed.org",
    status: "ACTIVE",
    feesStatus: "PAID",
    feesDue: 0,
  },
  {
    id: "std_03",
    admissionNo: "APX/2024/0112",
    firstName: "Amina",
    lastName: "Bello",
    gender: "FEMALE",
    className: "SS 2",
    classId: "cls_ss2_sci",
    house: "Gold Lion",
    dob: "2010-02-18",
    bloodGroup: "B+",
    address: "12 Queen's Drive, Ikoyi, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    parentName: "Alhaji Ibrahim Bello",
    parentPhone: "+234 809 111 8832",
    parentEmail: "i.bello@tradecorp.ng",
    status: "ACTIVE",
    feesStatus: "PAID",
    feesDue: 0,
  },
  {
    id: "std_04",
    admissionNo: "APX/2025/0245",
    firstName: "Sarah",
    lastName: "Balogun",
    gender: "FEMALE",
    className: "JSS 1",
    classId: "cls_jss1_blue",
    house: "Blue Phoenix",
    dob: "2014-11-05",
    bloodGroup: "O+",
    address: "Plot 14 Admiralty Way, Lekki Phase 1, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
    parentName: "Chief & Mrs. Adebayo Balogun",
    parentPhone: "+234 803 555 0192",
    parentEmail: "adebayo.balogun@gmail.com",
    status: "ACTIVE",
    feesStatus: "PARTIAL",
    feesDue: 120000,
  },
  {
    id: "std_05",
    admissionNo: "APX/2024/0077",
    firstName: "Emeka",
    lastName: "Okonkwo",
    gender: "MALE",
    className: "SS 2",
    classId: "cls_ss2_sci",
    house: "Green Falcon",
    dob: "2010-06-12",
    bloodGroup: "O-",
    address: "8 Bourdillon Road, Ikoyi, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    parentName: "Barrister Chukwuma Okonkwo",
    parentPhone: "+234 805 777 2201",
    parentEmail: "c.okonkwo@chambers.ng",
    status: "ACTIVE",
    feesStatus: "PAID",
    feesDue: 0,
  },
  {
    id: "std_06",
    admissionNo: "APX/2024/0095",
    firstName: "Zainab",
    lastName: "Mohammed",
    gender: "FEMALE",
    className: "SS 3",
    classId: "cls_ss3_arts",
    house: "Gold Lion",
    dob: "2009-08-19",
    bloodGroup: "AA",
    address: "17 Alexander Avenue, Ikoyi",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    parentName: "Ambassador Usman Mohammed",
    parentPhone: "+234 803 888 4402",
    parentEmail: "u.mohammed@gov.ng",
    status: "ACTIVE",
    feesStatus: "PAID",
    feesDue: 0,
  },
];

export const INITIAL_STAFF: StaffRecord[] = [
  {
    id: "stf_01",
    staffNumber: "STF-APX-014",
    firstName: "Katherine",
    lastName: "Vance",
    email: "principal@apexacademics.edu",
    phone: "+234 803 100 2001",
    role: "ADMIN",
    department: "Executive Administration",
    designation: "Principal / Head of School",
    salaryBase: 950000,
    allowances: 180000,
    deductions: 75000,
    qualification: "Ph.D Educational Management (Oxon)",
    joinedDate: "2018-09-01",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "stf_02",
    staffNumber: "STF-APX-042",
    firstName: "David",
    lastName: "Adeleke",
    email: "david.adeleke@apexacademics.edu",
    phone: "+234 802 444 1199",
    role: "TEACHER",
    department: "Physical Sciences",
    designation: "Senior Physics Master & SS2 Class Tutor",
    salaryBase: 480000,
    allowances: 65000,
    deductions: 35000,
    qualification: "M.Sc Physics (UNILAG)",
    joinedDate: "2021-01-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "stf_03",
    staffNumber: "STF-APX-029",
    firstName: "Folake",
    lastName: "Sanusi",
    email: "bursary@apexacademics.edu",
    phone: "+234 803 999 1234",
    role: "BURSAR",
    department: "Bursary & Accounts",
    designation: "Chief Finance Officer (Bursar)",
    salaryBase: 620000,
    allowances: 85000,
    deductions: 45000,
    qualification: "FCA, B.Sc Accounting (UI)",
    joinedDate: "2019-11-01",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "stf_04",
    staffNumber: "STF-APX-068",
    firstName: "Chinyere",
    lastName: "Nwachukwu",
    email: "chinyere.n@apexacademics.edu",
    phone: "+234 806 222 3411",
    role: "TEACHER",
    department: "Mathematics & Computing",
    designation: "HOD Mathematics",
    salaryBase: 510000,
    allowances: 70000,
    deductions: 38000,
    qualification: "B.Sc Ed Mathematics (First Class)",
    joinedDate: "2020-03-10",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "stf_05",
    staffNumber: "STF-APX-071",
    firstName: "Sister Grace",
    lastName: "Okafor",
    email: "infirmary@apexacademics.edu",
    phone: "+234 803 876 5432",
    role: "NURSE",
    department: "Medical Infirmary",
    designation: "School Matron / Lead Registered Nurse",
    salaryBase: 420000,
    allowances: 50000,
    deductions: 28000,
    qualification: "RN, RM, B.N.Sc Nursing Science",
    joinedDate: "2021-08-01",
    avatar: "https://images.unsplash.com/photo-1594824813627-c1d428989f6d?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
];

export const INITIAL_GRADES: GradeItem[] = [
  {
    id: "grd_01",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    subject: "Physics",
    class: "SS 2",
    ca1: 14,
    ca2: 13.5,
    ca3: 9,
    exam: 54,
    total: 90.5,
    grade: "A1",
    remark: "Exceptional mastery of Newtonian mechanics & wave motion",
  },
  {
    id: "grd_02",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    subject: "Mathematics",
    class: "SS 2",
    ca1: 15,
    ca2: 14,
    ca3: 9.5,
    exam: 53,
    total: 91.5,
    grade: "A1",
    remark: "Brilliant analytical aptitude; flawless calculus solutions",
  },
  {
    id: "grd_03",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    subject: "English Language",
    class: "SS 2",
    ca1: 12,
    ca2: 13,
    ca3: 8,
    exam: 49,
    total: 82,
    grade: "A1",
    remark: "Articulate essay structure and strong vocabulary",
  },
  {
    id: "grd_04",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    subject: "Chemistry",
    class: "SS 2",
    ca1: 13,
    ca2: 12.5,
    ca3: 8.5,
    exam: 50,
    total: 84,
    grade: "A1",
    remark: "Very competent in qualitative & quantitative stoichiometry",
  },
  {
    id: "grd_05",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    subject: "Biology",
    class: "SS 2",
    ca1: 11,
    ca2: 13,
    ca3: 8,
    exam: 46,
    total: 78,
    grade: "B2",
    remark: "Very good grasp of mammalian physiology; keep it up",
  },
  {
    id: "grd_06",
    studentId: "std_02",
    studentName: "Chioma Eze",
    subject: "Physics",
    class: "SS 2",
    ca1: 15,
    ca2: 15,
    ca3: 10,
    exam: 56,
    total: 96,
    grade: "A1",
    remark: "Top of class in thermodynamics and circuit analysis",
  },
  {
    id: "grd_07",
    studentId: "std_02",
    studentName: "Chioma Eze",
    subject: "Mathematics",
    class: "SS 2",
    ca1: 14.5,
    ca2: 14.5,
    ca3: 10,
    exam: 55,
    total: 94,
    grade: "A1",
    remark: "Superlative performance across pure and applied math",
  },
];

export const INITIAL_KID_MONITOR: KidMonitorLogRecord[] = [
  {
    id: "kml_01",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    className: "SS 2",
    gateCheckIn: "07:38 AM",
    gateCheckOut: null,
    gatekeeper: "Officer Musa Danladi (Gate A)",
    busRoute: "Route 4 - Lekki & VI Express",
    busStatus: "Safe At School",
    busDriver: "Mr. Sunday Agbo (Bus #12)",
    pickupPerson: "Chief Adebayo Balogun (Father)",
    pickupOtp: "849-204",
    infirmaryVisits: [
      {
        date: "2026-10-24",
        symptom: "Mild forehead contusion during basketball drills",
        treatment: "Cold compress applied + Arnica gel. Student rested 20 mins and returned to class.",
        nurse: "Sister Grace Okafor",
      },
    ],
  },
  {
    id: "kml_02",
    studentId: "std_04",
    studentName: "Sarah Balogun",
    className: "JSS 1",
    gateCheckIn: "07:41 AM",
    gateCheckOut: null,
    gatekeeper: "Officer Musa Danladi (Gate A)",
    busRoute: "Route 4 - Lekki & VI Express",
    busStatus: "Safe At School",
    busDriver: "Mr. Sunday Agbo (Bus #12)",
    pickupPerson: "Mrs. Folashade Balogun (Mother)",
    pickupOtp: "912-441",
    infirmaryVisits: [],
  },
  {
    id: "kml_03",
    studentId: "std_02",
    studentName: "Chioma Eze",
    className: "SS 2",
    gateCheckIn: "07:29 AM",
    gateCheckOut: null,
    gatekeeper: "Officer James Udoh (Gate B)",
    busRoute: "Private Commute",
    busStatus: "Safe At School",
    busDriver: "Family Chauffeur (Mr. Emmanuel)",
    pickupPerson: "Dr. Kenneth Eze (Father)",
    pickupOtp: "631-778",
    infirmaryVisits: [],
  },
];

export const INITIAL_TRANSACTIONS: AccountingTransactionRecord[] = [
  {
    id: "tx_01",
    type: "INCOME",
    category: "Tuition Fees",
    amount: 14500000,
    description: "Term 1 School Fees Collection Batch #1 (Direct Bank & Paystack)",
    date: "2026-10-15",
    reference: "PAY-2026-OCT-8821",
    recordedBy: "Mrs. Folake Sanusi",
    status: "VERIFIED",
  },
  {
    id: "tx_02",
    type: "EXPENSE",
    category: "Salaries & Payroll",
    amount: 4820000,
    description: "Academic & Auxiliary Staff Monthly Payroll (October 2026)",
    date: "2026-10-25",
    reference: "EXP-SAL-2026-10",
    recordedBy: "Mrs. Folake Sanusi",
    status: "VERIFIED",
  },
  {
    id: "tx_03",
    type: "EXPENSE",
    category: "Science Lab Equipment",
    amount: 850000,
    description: "Procurement of 12 New Digital Compound Microscopes for Biology & Physics Lab",
    date: "2026-10-20",
    reference: "PO-LAB-9912",
    recordedBy: "Mr. David Adeleke",
    status: "VERIFIED",
  },
  {
    id: "tx_04",
    type: "INCOME",
    category: "Admission Registration",
    amount: 720000,
    description: "2027/2028 Entrance Examination Application Fee Slips (36 Applicants)",
    date: "2026-10-22",
    reference: "ADM-REV-2026-03",
    recordedBy: "Admissions Desk",
    status: "VERIFIED",
  },
  {
    id: "tx_05",
    type: "EXPENSE",
    category: "Utilities & Generator Fuel",
    amount: 640000,
    description: "Diesel Supply 5,000 Litres for 250kVA Central Campus Generator",
    date: "2026-10-23",
    reference: "EXP-FUEL-4410",
    recordedBy: "Estate Manager",
    status: "VERIFIED",
  },
];

export const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: "app_01",
    appNo: "APX-ADM-2027-0012",
    firstName: "Somto",
    lastName: "Anosike",
    gender: "MALE",
    intendedClass: "JSS 1",
    parentName: "Mr. Obinna Anosike",
    parentPhone: "+234 803 111 4455",
    parentEmail: "obinna@anosikegroup.com",
    status: "ADMITTED",
    entranceScore: 88.5,
    appliedDate: "2026-10-10",
  },
  {
    id: "app_02",
    appNo: "APX-ADM-2027-0015",
    firstName: "Farida",
    lastName: "Yusuf",
    gender: "FEMALE",
    intendedClass: "SS 1",
    parentName: "Engr. Mansur Yusuf",
    parentPhone: "+234 802 888 2311",
    parentEmail: "m.yusuf@infrastructure.ng",
    status: "INTERVIEW",
    entranceScore: 84.0,
    appliedDate: "2026-10-14",
  },
  {
    id: "app_03",
    appNo: "APX-ADM-2027-0021",
    firstName: "Korede",
    lastName: "Ajayi",
    gender: "MALE",
    intendedClass: "JSS 1",
    parentName: "Prof. Olumide Ajayi",
    parentPhone: "+234 809 333 7711",
    parentEmail: "oajayi@unilag.edu.ng",
    status: "EXAM_SCHEDULED",
    entranceScore: undefined,
    appliedDate: "2026-10-21",
  },
  {
    id: "app_04",
    appNo: "APX-ADM-2027-0030",
    firstName: "Daniel",
    lastName: "Williams",
    gender: "MALE",
    intendedClass: "SS 2",
    parentName: "Mrs. Brenda Williams",
    parentPhone: "+234 818 777 9900",
    parentEmail: "brenda.w@chevron.com",
    status: "UNDER_REVIEW",
    entranceScore: undefined,
    appliedDate: "2026-10-26",
  },
];

export const CBT_QUESTIONS: CBTQuestionRecord[] = [
  {
    id: "q1",
    question: "A ball is thrown vertically upwards with a velocity of 20 m/s. Assuming g = 9.8 m/s², what is the maximum height reached?",
    options: ["10.2 meters", "20.4 meters", "40.8 meters", "19.6 meters"],
    correctIndex: 1,
    explanation: "Using v² = u² - 2gh. At maximum height v = 0, so h = u² / (2g) = 400 / 19.6 = 20.41 m.",
    points: 20,
  },
  {
    id: "q2",
    question: "Which of the following electromagnetic radiations has the shortest wavelength and highest frequency?",
    options: ["Infrared rays", "Microwaves", "Gamma rays", "Ultraviolet rays"],
    correctIndex: 2,
    explanation: "Gamma rays have the highest frequency and shortest wavelength (< 10 picometers) in the EM spectrum.",
    points: 20,
  },
  {
    id: "q3",
    question: "Calculate the electrical resistance of an appliance rated 2.4 kW when operated on a 240V mains supply.",
    options: ["10 Ω", "24 Ω", "48 Ω", "100 Ω"],
    correctIndex: 1,
    explanation: "Power P = V² / R. Therefore R = V² / P = (240 × 240) / 2400 = 57600 / 2400 = 24 Ω.",
    points: 20,
  },
  {
    id: "q4",
    question: "Faraday's law of electromagnetic induction states that the magnitude of induced EMF is directly proportional to:",
    options: [
      "The total magnetic flux linked with the circuit",
      "The rate of change of magnetic flux linkage",
      "The resistance of the conductor",
      "The temperature of the magnetic core",
    ],
    correctIndex: 1,
    explanation: "Faraday's Law gives EMF = -N (dΦ / dt), which is directly proportional to the rate of change of magnetic flux linkage.",
    points: 20,
  },
  {
    id: "q5",
    question: "In optics, the critical angle for total internal reflection between diamond (n=2.42) and air (n=1.00) is approximately:",
    options: ["48.8°", "42.0°", "24.4°", "65.5°"],
    correctIndex: 2,
    explanation: "sin(θc) = 1 / n = 1 / 2.42 ≈ 0.4132. arcsin(0.4132) ≈ 24.41°.",
    points: 20,
  },
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann_01",
    title: "🏆 Apex Academics Emerges 1st in National Science Olympiad 2026",
    category: "ACADEMIC",
    author: "Dr. Katherine Vance (Principal)",
    date: "October 27, 2026",
    badge: "Urgent & Pinned",
    summary:
      "We are immensely proud to announce that our Senior Secondary STEM team, led by Tunde Balogun and Chioma Eze, won the Gold Medal at the National Physics and Applied Mathematics Competition in Abuja.",
    likes: 84,
  },
  {
    id: "ann_02",
    title: "🏃‍♂️ Annual Inter-House Sports Festival 2026 — Date & Schedules Announced",
    category: "SPORTS",
    author: "Sports Committee & House Masters",
    date: "October 24, 2026",
    badge: "Upcoming Event",
    summary:
      "The 24th Inter-House Sports Championship will take place at the Main Stadium on Friday, November 14, 2026. House rehearsals continue every Tuesday and Thursday afternoon.",
    likes: 62,
  },
  {
    id: "ann_03",
    title: "💳 2026/2027 1st Term Tuition Settlement & Parent Portal Online Payments",
    category: "FINANCE",
    author: "Bursary Department",
    date: "October 18, 2026",
    badge: "Notice to Parents",
    summary:
      "Parents can now settle outstanding tuition and extracurricular levies via the Parent Portal using our Paystack Instant Card & Bank Gateway with automated receipt generation.",
    likes: 39,
  },
];

export const INITIAL_LESSON_NOTES: LessonNoteRecord[] = [
  {
    id: "ln_01",
    subject: "Physics",
    className: "SS 2",
    teacherName: "Mr. David Adeleke",
    weekNumber: 6,
    topic: "Electromagnetic Induction & Transformer Principles",
    objectives: [
      "Demonstrate Faraday's law using coil and bar magnet",
      "Explain Lenz's law as a consequence of energy conservation",
      "Derive the transformer formula: Vp / Vs = Np / Ns",
      "Calculate efficiency of step-up and step-down transformers",
    ],
    materials: ["Neodymium bar magnets", "Dual 500-turn solenoid coils", "Center-zero galvanometer", "Step-down transformer kit"],
    contentSummary:
      "Students will experimentally observe electromagnetic induction, relate magnetic flux cutting to galvanometer deflection, and solve transformer equations.",
    status: "APPROVED",
    date: "2026-10-22",
  },
  {
    id: "ln_02",
    subject: "Mathematics",
    className: "SS 2",
    teacherName: "Mrs. Chinyere Nwachukwu",
    weekNumber: 6,
    topic: "Differential Calculus: First Principles & Product Rule",
    objectives: [
      "Differentiate polynomials from first principles: dy/dx = lim(h->0) [f(x+h) - f(x)]/h",
      "Apply the product rule: d/dx(uv) = u(dv/dx) + v(du/dx)",
      "Determine coordinates of stationary points and determine their nature",
    ],
    materials: ["GeoGebra interactive grapher", "Calculus problem worksheet sets", "Whiteboard plotting"],
    contentSummary:
      "Rigorous progression from secant slopes to tangent limits, with hands-on practice on polynomials and product rule applications.",
    status: "APPROVED",
    date: "2026-10-23",
  },
  {
    id: "ln_03",
    subject: "Chemistry",
    className: "SS 2",
    teacherName: "Dr. Abiola Benson",
    weekNumber: 7,
    topic: "Redox Reactions and Electrochemical Cells",
    objectives: [
      "Identify oxidizing and reducing agents in terms of electron transfer and oxidation numbers",
      "Construct a standard Daniell Zinc-Copper cell",
      "Measure cell potential using high-impedance digital voltmeter",
    ],
    materials: ["Zinc and Copper electrodes", "1M ZnSO4 and CuSO4 solutions", "Porous pot / Salt bridge (KNO3)"],
    contentSummary:
      "Laboratory practical session exploring electrochemical series, half-cell potentials, and galvanic battery principles.",
    status: "SUBMITTED",
    date: "2026-10-26",
  },
];

export const INITIAL_HOUSE_STANDINGS = [
  { house: "Blue Phoenix", color: "from-blue-600 to-indigo-700", points: 1420, emblem: "🦅", rank: 1 },
  { house: "Red Dragon", color: "from-red-600 to-rose-700", points: 1385, emblem: "🐉", rank: 2 },
  { house: "Gold Lion", color: "from-amber-500 to-yellow-600", points: 1310, emblem: "🦁", rank: 3 },
  { house: "Green Falcon", color: "from-emerald-600 to-teal-700", points: 1240, emblem: "🦅", rank: 4 },
];

export const INITIAL_INVENTORY = [
  { id: "inv_01", code: "EQ-SCI-004", name: "Olympus Binocular Compound Microscope", category: "Science Lab", qty: 24, min: 10, condition: "Excellent", location: "Lab 2 Cabinet A" },
  { id: "inv_02", code: "IT-LAP-018", name: "Dell Latitude 5430 Core i7 Laptops", category: "IT Lab", qty: 45, min: 20, condition: "Good", location: "STEM Computer Center" },
  { id: "inv_03", code: "BK-PHY-091", name: "Senior Secondary Physics by P.N. Okeke", category: "Textbooks", qty: 120, min: 30, condition: "Good", location: "Library Stacks 4" },
  { id: "inv_04", code: "SP-BB-012", name: "Spalding Official Competition Basketballs", category: "Sports Complex", qty: 18, min: 8, condition: "Good", location: "Sports Equipment Room" },
  { id: "inv_05", code: "MD-FA-002", name: "Comprehensive First Aid & Trauma Kit", category: "Infirmary", qty: 6, min: 4, condition: "Sterile & Stocked", location: "School Clinic" },
];

export const INITIAL_DISCIPLINE = [
  {
    id: "dsc_01",
    studentId: "std_05",
    studentName: "Emeka Okonkwo",
    className: "SS 2",
    infraction: "Unapproved smartphone possession during morning homeroom assembly",
    sanction: "Device confiscated for 48 hrs + 2 hours campus library assistance",
    reportedBy: "Mr. David Adeleke",
    date: "2026-10-23",
    status: "RESOLVED",
    parentNotified: true,
  },
  {
    id: "dsc_02",
    studentId: "std_01",
    studentName: "Tunde Balogun",
    className: "SS 2",
    infraction: "Late arrival to 1st period Chemistry practical by 14 minutes",
    sanction: "Verbal warning & assigned lab cleanup duty",
    reportedBy: "Dr. Abiola Benson",
    date: "2026-10-18",
    status: "RESOLVED",
    parentNotified: true,
  },
];

export const INITIAL_BEHAVIOURAL = {
  punctuality: 5,
  neatness: 5,
  politeness: 5,
  leadership: 4,
  sportsmanship: 5,
  honesty: 5,
  teacherRemark:
    "Tunde exhibits outstanding moral rectitude, intellectual curiosity, and exemplary peer leadership. A consummate role model in Blue Phoenix House.",
};
