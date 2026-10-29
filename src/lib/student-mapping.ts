import type { Prisma } from "@prisma/client";
import { INITIAL_STUDENTS, StudentRecord } from "@/lib/initial-data";

export type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    class: true;
    guardians: true;
    invoices: true;
  };
}>;

const houses: StudentRecord["house"][] = [
  "Red Dragon",
  "Blue Phoenix",
  "Green Falcon",
  "Gold Lion",
];

export function toStudentRecord(student: StudentWithRelations): StudentRecord {
  const demoRecord = INITIAL_STUDENTS.find(
    (record) => record.admissionNo === student.admissionNo,
  );
  const feesDue = student.invoices.length
    ? student.invoices.reduce(
        (total, invoice) =>
          total + Math.max(0, invoice.amount - invoice.amountPaid),
        0,
      )
    : (demoRecord?.feesDue ?? 350000);
  const feesStatus = student.invoices.length
    ? feesDue === 0
      ? "PAID"
      : student.invoices.some((invoice) => invoice.amountPaid > 0)
        ? "PARTIAL"
        : "PENDING"
    : (demoRecord?.feesStatus ?? "PENDING");
  const guardian = student.guardians[0];

  return {
    id: student.id,
    admissionNo: student.admissionNo,
    firstName: student.firstName,
    lastName: student.lastName,
    gender: student.gender === "MALE" ? "MALE" : "FEMALE",
    className: student.class.name,
    classId: student.classId,
    house: houses.find((house) => house === student.house) ?? "Blue Phoenix",
    dob: student.dob.toISOString().slice(0, 10),
    bloodGroup: student.bloodGroup ?? "",
    address: student.address ?? "",
    photoUrl: student.photoUrl ?? "",
    parentName: guardian?.fullName ?? "",
    parentPhone: guardian?.phone ?? "",
    parentEmail: guardian?.email ?? "",
    status: "ACTIVE",
    feesStatus,
    feesDue,
  };
}
