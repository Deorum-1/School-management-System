import { redirect } from "next/navigation";
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DISCIPLINE,
  INITIAL_GRADES,
  INITIAL_HOUSE_STANDINGS,
  INITIAL_INVENTORY,
  INITIAL_KID_MONITOR,
  INITIAL_LESSON_NOTES,
  INITIAL_STAFF,
  INITIAL_TRANSACTIONS,
} from "@/lib/initial-data";
import { hasPermission } from "@/lib/permissions";
import { requireAuth } from "@/lib/auth";
import { SchoolProvider } from "@/context/SchoolContext";
import { SchoolWorkspace } from "@/components/SchoolWorkspace";

export default async function Home() {
  const user = await requireAuth();
  if (!hasPermission(user.role, "dashboard:read")) {
    redirect("/unauthorized");
  }

  const canRead = (permission: string) =>
    hasPermission(user.role, permission);
  const initialData = {
    staff: canRead("staff:read") ? INITIAL_STAFF : [],
    grades: canRead("grades:read") ? INITIAL_GRADES : [],
    kidMonitor: canRead("kidmonitor:read") ? INITIAL_KID_MONITOR : [],
    transactions: canRead("accounting:read") ? INITIAL_TRANSACTIONS : [],
    announcements: canRead("news:read") ? INITIAL_ANNOUNCEMENTS : [],
    lessonNotes: canRead("lesson_notes:read") ? INITIAL_LESSON_NOTES : [],
    inventory: canRead("inventory:read") ? INITIAL_INVENTORY : [],
    discipline: canRead("discipline:read") ? INITIAL_DISCIPLINE : [],
    houseStandings: canRead("house_points:read")
      ? INITIAL_HOUSE_STANDINGS
      : [],
  };

  return (
    <SchoolProvider user={user} initialData={initialData}>
      <SchoolWorkspace />
    </SchoolProvider>
  );
}
