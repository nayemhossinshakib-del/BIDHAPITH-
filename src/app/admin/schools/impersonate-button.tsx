"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ImpersonateButton({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={async () => {
        const res = await fetch("/api/auth/impersonate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolId }),
        });
        const data = await res.json();
        if (res.ok) router.push(data.redirectTo || "/school");
      }}
    >
      অ্যাডমিন হিসেবে
    </Button>
  );
}
