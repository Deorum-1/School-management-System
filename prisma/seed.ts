import { PrismaClient } from "@prisma/client";
import { INITIAL_STUDENTS } from "../src/lib/initial-data";

const prisma = new PrismaClient();

function getGradeLevel(className: string) {
  const gradeMatch = /\bGrade\s+(\d+)\b/i.exec(className);
  if (gradeMatch) return Number(gradeMatch[1]);

  const juniorSecondaryMatch = /\bJSS\s+(\d+)\b/i.exec(className);
  if (juniorSecondaryMatch) return 6 + Number(juniorSecondaryMatch[1]);

  throw new Error(`Could not determine grade level for class "${className}"`);
}

function getClassCode(className: string) {
  return className
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seed() {
  for (const student of INITIAL_STUDENTS) {
    const classCode = getClassCode(student.className);
    await prisma.class.upsert({
      where: { code: classCode },
      update: {
        name: student.className,
        gradeLevel: getGradeLevel(student.className),
      },
      create: {
        id: student.classId,
        name: student.className,
        code: classCode,
        gradeLevel: getGradeLevel(student.className),
      },
    });

    await prisma.student.upsert({
      where: { admissionNo: student.admissionNo },
      update: {
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dob: new Date(`${student.dob}T12:00:00.000Z`),
        bloodGroup: student.bloodGroup || null,
        photoUrl: student.photoUrl || null,
        address: student.address || null,
        house: student.house,
        classId: student.classId,
      },
      create: {
        id: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dob: new Date(`${student.dob}T12:00:00.000Z`),
        bloodGroup: student.bloodGroup || null,
        photoUrl: student.photoUrl || null,
        address: student.address || null,
        house: student.house,
        classId: student.classId,
      },
    });

    const guardianId = `guardian_${student.id}`;
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
        studentId: student.id,
      },
    });
  }

  console.info(`Seeded ${INITIAL_STUDENTS.length} demo students and guardians.`);
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed the school database.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
