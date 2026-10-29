export const MINIMUM_ENTRANCE_SCORE = 70;

export function meetsAdmissionRequirement(
  entranceScore: number | null | undefined,
): boolean {
  return (
    typeof entranceScore === "number" &&
    Number.isFinite(entranceScore) &&
    entranceScore > MINIMUM_ENTRANCE_SCORE
  );
}
