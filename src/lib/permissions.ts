export type Role = "ADMIN" | "TEACHER" | "PARENT" | "STUDENT" | "ACCOUNTANT";

export const PUBLIC_SIGNUP_ROLES = [
  "TEACHER",
  "STUDENT",
  "PARENT",
  "ACCOUNTANT",
] as const;

export const LOGIN_ROLES = ["ADMIN", ...PUBLIC_SIGNUP_ROLES] as const;

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
  ACCOUNTANT: "Accountant",
};

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  studentId?: string;
  childrenIds?: string[];
  classAssigned?: string;
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "dashboard:read",
    "students:read",
    "students:write",
    "staff:read",
    "staff:write",
    "payroll:read",
    "payroll:write",
    "grades:read",
    "grades:write",
    "admission:read",
    "admission:write",
    "kidmonitor:read",
    "kidmonitor:write",
    "accounting:read",
    "accounting:write",
    "attendance:read",
    "attendance:write",
    "chat:read",
    "chat:write",
    "news:read",
    "news:write",
    "timetable:read",
    "timetable:write",
    "lesson_notes:read",
    "lesson_notes:approve",
    "parent_portal:read",
    "inventory:read",
    "inventory:write",
    "cbt:read",
    "cbt:write",
    "payment:read",
    "payment:write",
    "assignments:read",
    "assignments:write",
    "house_points:read",
    "house_points:write",
    "transcript:read",
    "transcript:generate",
    "behavioural:read",
    "behavioural:write",
    "discipline:read",
    "discipline:write",
    "broadcast:send",
  ],
  TEACHER: [
    "dashboard:read",
    "students:read",
    "attendance:read",
    "attendance:write",
    "grades:read",
    "grades:write",
    "timetable:read",
    "lesson_notes:read",
    "lesson_notes:write",
    "cbt:read",
    "cbt:write",
    "assignments:read",
    "assignments:write",
    "house_points:read",
    "house_points:write",
    "behavioural:read",
    "behavioural:write",
    "discipline:read",
    "discipline:write",
    "chat:read",
    "chat:write",
    "news:read",
    "kidmonitor:read",
  ],
  PARENT: [
    "parent_portal:read",
    "kidmonitor:read",
    "grades:read",
    "payment:read",
    "payment:write",
    "timetable:read",
    "assignments:read",
    "transcript:read",
    "chat:read",
    "chat:write",
    "news:read",
  ],
  STUDENT: [
    "cbt:read",
    "cbt:take",
    "assignments:read",
    "assignments:submit",
    "grades:read",
    "timetable:read",
    "house_points:read",
    "chat:read",
    "chat:write",
    "news:read",
    "transcript:read",
  ],
  ACCOUNTANT: [
    "dashboard:read",
    "accounting:read",
    "accounting:write",
    "payroll:read",
    "payroll:write",
    "payment:read",
    "payment:write",
    "students:read",
  ],
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
