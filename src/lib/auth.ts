import { Role, UserSession } from "./permissions";

export const DEMO_USERS: Record<Role, UserSession> = {
  ADMIN: {
    id: "usr_admin_01",
    name: "Dr. Katherine Vance",
    email: "principal@apexacademics.edu",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  TEACHER: {
    id: "usr_teacher_01",
    name: "Mr. David Adeleke (M.Sc Physics)",
    email: "david.adeleke@apexacademics.edu",
    role: "TEACHER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    classAssigned: "Grade 11 Science (SS2 Gold)",
  },
  PARENT: {
    id: "usr_parent_01",
    name: "Chief & Mrs. Adebayo Balogun",
    email: "adebayo.balogun@gmail.com",
    role: "PARENT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    childrenIds: ["std_01", "std_04"],
  },
  STUDENT: {
    id: "usr_student_01",
    name: "Tunde Balogun",
    email: "tunde.balogun@student.apex.edu",
    role: "STUDENT",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    studentId: "std_01",
  },
  ACCOUNTANT: {
    id: "usr_accountant_01",
    name: "Mrs. Folake Sanusi (CPA)",
    email: "bursary@apexacademics.edu",
    role: "ACCOUNTANT",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
};

export function getSession(role: Role = "ADMIN"): UserSession {
  return DEMO_USERS[role];
}
