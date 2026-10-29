"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApplicantRecord } from "@/lib/initial-data";
import { meetsAdmissionRequirement } from "@/lib/admissions";
import { NIGERIAN_CLASSES } from "@/lib/school-classes";
import db from "@/lib/db";

const applicantStatusSchema = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "EXAM_SCHEDULED",
  "INTERVIEW",
  "ADMITTED",
  "REJECTED",
]);

const applicationSchema = z.object({
  id: z.string().trim().min(1),
  appNo: z.string().trim().min(1),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  intendedClass: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
  parentEmail: z.string(),
  entranceScore: z.number().nullable(),
  status: applicantStatusSchema,
  createdAt: z.date(),
});

const admissionInputSchema = z.object({
  applicantId: z.string().trim().min(1),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date of birth")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.valueOf()) &&
        date.toISOString().slice(0, 10) === value &&
        date <= new Date()
      );
    }, "Enter a valid date of birth that is not in the future"),
});

function toApplicantRecord(
  applicant: z.infer<typeof applicationSchema>,
): ApplicantRecord {
  return {
    id: applicant.id,
    appNo: applicant.appNo,
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    gender: applicant.gender,
    intendedClass: applicant.intendedClass,
    parentName: applicant.parentName,
    parentPhone: applicant.parentPhone,
    parentEmail: applicant.parentEmail,
    entranceScore: applicant.entranceScore ?? undefined,
    status: applicant.status,
    appliedDate: applicant.createdAt.toISOString().slice(0, 10),
  };
}

export async function getAdmissionApplicantsAction() {
  try {
    const applicants = await db.admissionApplicant.findMany({
      orderBy: [{ createdAt: "desc" }, { appNo: "asc" }],
    });

    return {
      success: true as const,
      applicants: applicants.map((applicant) =>
        toApplicantRecord(applicationSchema.parse(applicant)),
      ),
    };
  } catch (error: unknown) {
    console.error("getAdmissionApplicantsAction failed.", error);
    return {
      success: false as const,
      error: "Unable to load admission applications. Please try again.",
    };
  }
}

export async function admitApplicantAction(input: unknown) {
  const parsed = admissionInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Admission details are invalid.",
    };
  }

  try {
    const outcome = await db.$transaction(async (transaction) => {
      const applicant = await transaction.admissionApplicant.findUnique({
        where: { id: parsed.data.applicantId },
      });

      if (!applicant) {
        return { error: "This admission application could not be found." };
      }

      if (!meetsAdmissionRequirement(applicant.entranceScore)) {
        return {
          error: "Admission requires an entrance exam score above 70%.",
        };
      }

      if (applicant.status === "ADMITTED") {
        const existingStudent = await transaction.student.findUnique({
          where: { admissionNo: `ADM/${applicant.appNo}` },
          include: {
            class: true,
            guardians: true,
            invoices: true,
          },
        });

        if (existingStudent) {
          return { applicant, student: existingStudent };
        }

        return { error: "This applicant has already been admitted." };
      }

      if (applicant.status === "REJECTED") {
        return { error: "A rejected applicant cannot be admitted." };
      }

      const className = applicant.intendedClass.trim();
      const schoolClass = NIGERIAN_CLASSES.find(
        (candidate) => candidate.name === className,
      );
      if (!schoolClass) {
        return {
          error: "The applicant's intended class is not a recognized school class.",
        };
      }

      const databaseClass = await transaction.class.findUnique({
        where: { code: schoolClass.code },
      });
      if (!databaseClass) {
        return {
          error: "The applicant's class is not set up in the database. Run the school database seed.",
        };
      }

      const admissionNo = `ADM/${applicant.appNo}`;
      const student = await transaction.student.create({
        data: {
          admissionNo,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          gender: applicant.gender,
          dob: new Date(`${parsed.data.dateOfBirth}T12:00:00.000Z`),
          house: "Blue Phoenix",
          classId: databaseClass.id,
          guardians: {
            create: {
              fullName: applicant.parentName,
              relationship: "Parent/Guardian",
              phone: applicant.parentPhone,
              email: applicant.parentEmail,
            },
          },
        },
        include: {
          class: true,
          guardians: true,
          invoices: true,
        },
      });

      const updatedApplicant = await transaction.admissionApplicant.update({
        where: { id: applicant.id },
        data: { status: "ADMITTED" },
      });

      return { applicant: updatedApplicant, student };
    });

    if ("error" in outcome) {
      return { success: false as const, error: outcome.error };
    }

    revalidatePath("/");
    return {
      success: true as const,
      applicant: toApplicantRecord(
        applicationSchema.parse(outcome.applicant),
      ),
      student: outcome.student,
    };
  } catch (error: unknown) {
    console.error("admitApplicantAction failed.", error);
    return {
      success: false as const,
      error: "Unable to admit the applicant. No student record was saved.",
    };
  }
}
