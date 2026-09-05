import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">পৃষ্ঠা পাওয়া যায়নি</h1>
      <Button asChild>
        <Link href="/">হোমে ফিরে যান</Link>
      </Button>
    </div>
  );
}
