"use server";

import { z } from "zod";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE"]),
  classId: z.string().min(1, "Class is required"),
  dob: z.string().min(1, "Date of birth is required"),
  parentName: z.string().min(3, "Parent name is required"),
  parentPhone: z.string().min(8, "Parent phone is required"),
  parentEmail: z.string().email("Valid parent email is required"),
});

export async function createStudentAction(formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      gender: formData.get("gender") as "MALE" | "FEMALE",
      classId: formData.get("classId") as string,
      dob: formData.get("dob") as string,
      parentName: formData.get("parentName") as string,
      parentPhone: formData.get("parentPhone") as string,
      parentEmail: formData.get("parentEmail") as string,
    };

    const validated = studentSchema.parse(rawData);
    const admissionNo = `APX/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = await db.student.create({
      data: {
        admissionNo,
        firstName: validated.firstName,
        lastName: validated.lastName,
        gender: validated.gender,
        dob: new Date(validated.dob),
        classId: validated.classId,
        guardians: {
          create: {
            fullName: validated.parentName,
            phone: validated.parentPhone,
            email: validated.parentEmail,
            relationship: "Parent/Guardian",
          },
        },
      },
    });

    revalidatePath("/admin");
    return { success: true, student: newStudent };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create student" };
  }
}

export async function getStudentsAction() {
  try {
    const students = await db.student.findMany({
      include: {
        class: true,
        guardians: true,
        attendance: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
