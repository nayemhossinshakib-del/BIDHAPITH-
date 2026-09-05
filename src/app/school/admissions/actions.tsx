"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdmissionActions({ id }: { id: string }) {
  const router = useRouter();
  async function decide(decision: "APPROVED" | "REJECTED") {
    await fetch("/api/admissions/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, decision }),
    });
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => decide("APPROVED")}>
        অনুমোদন
      </Button>
      <Button size="sm" variant="outline" onClick={() => decide("REJECTED")}>
        প্রত্যাখ্যান
      </Button>
    </div>
  );
}
