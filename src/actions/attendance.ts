"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/db";

const attendanceSchema = z.object({
  studentId: z.string().trim().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().trim().max(500).optional(),
});

const attendanceStatusSchema = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
]);

function getLagosSchoolDay(now: Date) {
  const dateParts: Record<string, string> = {};
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(now)
    .forEach((part) => {
      dateParts[part.type] = part.value;
    });

  const { year, month, day } = dateParts;
  if (!year || !month || !day) {
    throw new Error("Could not determine the current school date.");
  }

  return new Date(`${year}-${month}-${day}T00:00:00.000+01:00`);
}

export async function getTodayAttendanceAction() {
  try {
    const date = getLagosSchoolDay(new Date());
    const records = await db.attendance.findMany({
      where: { date },
      select: { studentId: true, status: true },
    });
    const attendanceStatuses: Record<
      string,
      "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
    > = {};
    records.forEach((record) => {
      const parsedStatus = attendanceStatusSchema.safeParse(record.status);
      if (parsedStatus.success) {
        attendanceStatuses[record.studentId] = parsedStatus.data;
      }
    });

    return { success: true as const, attendanceStatuses };
  } catch (error: unknown) {
    console.error("getTodayAttendanceAction failed.", error);
    return {
      success: false as const,
      error: "Unable to load today's attendance. Please try again.",
    };
  }
}

export async function markAttendanceAction(input: unknown) {
  const parsed = attendanceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Attendance details are invalid.",
    };
  }

  try {
    const now = new Date();
    const date = getLagosSchoolDay(now);
    const timeIn =
      parsed.data.status === "PRESENT" || parsed.data.status === "LATE"
        ? now.toLocaleTimeString("en-GB", {
            timeZone: "Africa/Lagos",
            hour: "2-digit",
            minute: "2-digit",
          })
        : null;

    const record = await db.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parsed.data.studentId,
          date,
        },
      },
      update: {
        status: parsed.data.status,
        remarks: parsed.data.remarks,
        timeIn,
      },
      create: {
        studentId: parsed.data.studentId,
        date,
        status: parsed.data.status,
        remarks: parsed.data.remarks,
        timeIn,
      },
      select: { studentId: true },
    });

    revalidatePath("/");
    return {
      success: true as const,
      record: { studentId: record.studentId, status: parsed.data.status },
    };
  } catch (error: unknown) {
    console.error("markAttendanceAction failed.", error);
    return {
      success: false as const,
      error: "Unable to save attendance. Please try again.",
    };
  }
}
