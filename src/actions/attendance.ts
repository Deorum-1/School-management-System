"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markAttendanceAction(studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED", remarks?: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await db.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: today,
        },
      },
      update: {
        status,
        remarks,
      },
      create: {
        studentId,
        date: today,
        status,
        remarks,
        timeIn: status === "PRESENT" || status === "LATE" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
      },
    });

    revalidatePath("/teacher");
    return { success: true, record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
