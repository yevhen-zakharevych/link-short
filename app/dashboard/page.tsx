"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [userId, isLoaded, router]);

  if (!isLoaded) {
    return <div role="status" aria-live="polite">Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
