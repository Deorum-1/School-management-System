export type Role = "ADMIN" | "TEACHER" | "PARENT" | "STUDENT" | "ACCOUNTANT";

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
    "attendance:read",
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
    "attendance:read",
    "house_points:read",
    "chat:read",
    "chat:write",
    "news:read",
    "transcript:read",
  ],
  ACCOUNTANT: [
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
