"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/db";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date of birth")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Enter a valid date of birth");

const studentSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  gender: z.enum(["MALE", "FEMALE"]),
  className: z.string().trim().min(1).max(100),
  dob: dateSchema,
  parentName: z.string().trim().min(3).max(120),
  parentPhone: z.string().trim().min(7).max(30),
  parentEmail: z.string().trim().email().max(254),
  house: z.string().trim().max(50).optional(),
  bloodGroup: z.string().trim().max(10).optional(),
  address: z.string().trim().max(300).optional(),
  photoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});

export async function createStudentAction(input: unknown) {
  const parsed = studentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Student details are invalid.",
    };
  }

  try {
    const schoolClass = await db.class.findFirst({
      where: { name: parsed.data.className },
      select: { id: true },
    });

    if (!schoolClass) {
      return {
        success: false as const,
        error: "Select a class that already exists in the school.",
      };
    }

    const student = await db.student.create({
      data: {
        admissionNo: `APX/${new Date().getFullYear()}/${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        gender: parsed.data.gender,
        dob: new Date(`${parsed.data.dob}T12:00:00.000Z`),
        bloodGroup: parsed.data.bloodGroup || null,
        photoUrl: parsed.data.photoUrl || null,
        address: parsed.data.address || null,
        house: parsed.data.house || "Blue Phoenix",
        classId: schoolClass.id,
        guardians: {
          create: {
            fullName: parsed.data.parentName,
            relationship: "Parent/Guardian",
            phone: parsed.data.parentPhone,
            email: parsed.data.parentEmail,
          },
        },
      },
      include: {
        class: true,
        guardians: true,
        invoices: true,
      },
    });

    revalidatePath("/");
    return { success: true as const, student };
  } catch (error: unknown) {
    console.error("createStudentAction failed.", error);
    return {
      success: false as const,
      error: "Unable to create the student. Please try again.",
    };
  }
}

export async function getStudentsAction() {
  try {
    const students = await db.student.findMany({
      include: {
        class: true,
        guardians: true,
        invoices: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true as const, students };
  } catch (error: unknown) {
    console.error("getStudentsAction failed.", error);
    return {
      success: false as const,
      error: "Unable to load student records. Please try again.",
    };
  }
}
