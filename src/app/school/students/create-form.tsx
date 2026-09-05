"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateStudentForm({ classes }: { classes: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} type="button">
        নতুন শিক্ষার্থী
      </Button>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fd.get("name"),
              nameBn: fd.get("nameBn"),
              mobile: fd.get("mobile"),
              classId: fd.get("classId"),
              roll: Number(fd.get("roll") || 0) || undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setMsg(data.message || "ব্যর্থ");
            return;
          }
          setMsg("শিক্ষার্থী সফলভাবে যুক্ত হয়েছে");
          setOpen(false);
          router.refresh();
        });
      }}
    >
      <Input name="name" placeholder="নাম (ইংরেজি)" required />
      <Input name="nameBn" placeholder="বাংলা নাম" />
      <Input name="mobile" placeholder="01XXXXXXXXX" />
      <select name="classId" className="h-10 rounded-lg border border-input bg-card px-3 text-sm">
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Input name="roll" placeholder="রোল" type="number" />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          বাতিল
        </Button>
      </div>
      {msg ? <p className="sm:col-span-3 text-sm text-primary">{msg}</p> : null}
    </form>
  );
}
