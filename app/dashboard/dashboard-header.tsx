"use client";

import { useRouter } from "next/navigation";
import { CreateLinkDialog } from "./create-link-dialog";

export function DashboardHeader() {
  const router = useRouter();

  const handleLinkCreated = () => {
    // Refresh the page to show the new link
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <CreateLinkDialog onLinkCreated={handleLinkCreated} />
    </div>
  );
}
