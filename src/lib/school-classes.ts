export interface SchoolClass {
  name: string;
  code: string;
  gradeLevel: number;
}

function createClasses(
  stage: string,
  count: number,
  firstGradeLevel: number,
): SchoolClass[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `${stage} ${index + 1}`,
    code: `${stage.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    gradeLevel: firstGradeLevel + index,
  }));
}

export const NIGERIAN_CLASS_GROUPS = [
  { label: "Nursery", classes: createClasses("Nursery", 3, 1) },
  { label: "Primary", classes: createClasses("Primary", 6, 4) },
  { label: "Junior Secondary (JSS)", classes: createClasses("JSS", 3, 10) },
  { label: "Senior Secondary (SS)", classes: createClasses("SS", 3, 13) },
] as const;

export const NIGERIAN_CLASSES: SchoolClass[] =
  NIGERIAN_CLASS_GROUPS.flatMap((group) => group.classes);
