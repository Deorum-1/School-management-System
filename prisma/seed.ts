import { PrismaClient } from "@prisma/client";
import {
  INITIAL_APPLICANTS,
  INITIAL_STUDENTS,
} from "../src/lib/initial-data";
import { NIGERIAN_CLASSES } from "../src/lib/school-classes";

const prisma = new PrismaClient();

function normalizeClassName(raw: string): string | null {
  const text = raw.trim();
  const nursery = /\b(?:nursery|nur|kg)\s*([1-3])\b/i.exec(text);
  if (nursery) return `Nursery ${Number(nursery[1])}`;

  const primary = /\b(?:primary|pry|basic)\s*([1-6])\b/i.exec(text);
  if (primary) return `Primary ${Number(primary[1])}`;

  const juniorSecondary = /\b(?:jss|junior secondary)\s*([1-3])\b/i.exec(text);
  if (juniorSecondary) return `JSS ${Number(juniorSecondary[1])}`;

  const seniorSecondary = /\b(?:sss|ss|senior secondary)\s*([1-3])\b/i.exec(text);
  if (seniorSecondary) return `SS ${Number(seniorSecondary[1])}`;

  const grade = /\bgrade\s*(\d{1,2})\b/i.exec(text);
  if (grade) {
    const level = Number(grade[1]);
    if (level >= 1 && level <= 6) return `Primary ${level}`;
    if (level >= 7 && level <= 9) return `JSS ${level - 6}`;
    if (level >= 10 && level <= 12) return `SS ${level - 9}`;
  }

  return null;
}

async function seedClasses() {
  const byName = new Map<string, string>();

  for (const schoolClass of NIGERIAN_CLASSES) {
    const record = await prisma.class.upsert({
      where: { code: schoolClass.code },
      update: {
        name: schoolClass.name,
        gradeLevel: schoolClass.gradeLevel,
      },
      create: schoolClass,
    });
    byName.set(record.name, record.id);
  }

  return byName;
}

async function normalizeExistingStudentClasses(classIds: Map<string, string>) {
  const existingClasses = await prisma.class.findMany({
    select: { id: true, name: true },
  });
  let studentsUpdated = 0;

  for (const existingClass of existingClasses) {
    const canonicalName = normalizeClassName(existingClass.name);
    const canonicalId = canonicalName
      ? classIds.get(canonicalName)
      : undefined;

    if (!canonicalId || canonicalId === existingClass.id) continue;

    const result = await prisma.student.updateMany({
      where: { classId: existingClass.id },
      data: { classId: canonicalId },
    });
    studentsUpdated += result.count;
  }

  return studentsUpdated;
}

async function seed() {
  const classIds = await seedClasses();
  const normalizedStudents = await normalizeExistingStudentClasses(classIds);

  for (const student of INITIAL_STUDENTS) {
    const className = normalizeClassName(student.className);
    if (!className) {
      throw new Error(
        `Student ${student.admissionNo} has unrecognized class "${student.className}". ` +
          "Use Nursery 1-3, Primary 1-6, JSS 1-3, or SS 1-3.",
      );
    }

    const classId = classIds.get(className);

    if (!classId) {
      throw new Error(
        `Student ${student.admissionNo} maps to missing class "${className}".`,
      );
    }

    const studentData = {
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dob: new Date(`${student.dob}T12:00:00.000Z`),
      bloodGroup: student.bloodGroup || null,
      photoUrl: student.photoUrl || null,
      address: student.address || null,
      house: student.house,
      classId,
    };

    const savedStudent = await prisma.student.upsert({
      where: { admissionNo: student.admissionNo },
      update: studentData,
      create: {
        admissionNo: student.admissionNo,
        ...studentData,
      },
      select: { id: true },
    });

    const guardianId = `guardian_${savedStudent.id}`;
    await prisma.guardian.upsert({
      where: { id: guardianId },
      update: {
        fullName: student.parentName,
        phone: student.parentPhone,
        email: student.parentEmail,
      },
      create: {
        id: guardianId,
        fullName: student.parentName,
        relationship: "Parent/Guardian",
        phone: student.parentPhone,
        email: student.parentEmail,
        studentId: savedStudent.id,
      },
    });
  }

  for (const applicant of INITIAL_APPLICANTS) {
    const intendedClass = normalizeClassName(applicant.intendedClass);
    if (!intendedClass || !classIds.has(intendedClass)) {
      throw new Error(
        `Applicant ${applicant.appNo} has an unrecognized intended class "${applicant.intendedClass}".`,
      );
    }

    await prisma.admissionApplicant.upsert({
      where: { appNo: applicant.appNo },
      update: {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        gender: applicant.gender,
        intendedClass,
        parentName: applicant.parentName,
        parentPhone: applicant.parentPhone,
        parentEmail: applicant.parentEmail,
        entranceScore: applicant.entranceScore ?? null,
      },
      create: {
        id: applicant.id,
        appNo: applicant.appNo,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        gender: applicant.gender,
        intendedClass,
        parentName: applicant.parentName,
        parentPhone: applicant.parentPhone,
        parentEmail: applicant.parentEmail,
        entranceScore: applicant.entranceScore ?? null,
        status: applicant.status,
        createdAt: new Date(`${applicant.appliedDate}T12:00:00.000Z`),
      },
    });
  }

  console.info(
    `Seeded ${NIGERIAN_CLASSES.length} Nigerian school classes, ${INITIAL_STUDENTS.length} demo students, and ${INITIAL_APPLICANTS.length} applicants. ` +
      `Normalized ${normalizedStudents} existing student class assignments.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed the school database.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
