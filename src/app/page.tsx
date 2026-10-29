"use client";

import { SchoolProvider } from "@/context/SchoolContext";
import { SchoolWorkspace } from "@/components/SchoolWorkspace";

export default function Home() {
  return (
    <SchoolProvider>
      <SchoolWorkspace />
    </SchoolProvider>
  );
}
