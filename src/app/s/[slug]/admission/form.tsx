"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function AdmissionForm({
  slug,
  schoolId,
  classes,
}: {
  slug: string;
  schoolId: string;
  classes: { id: string; name: string }[];
}) {
  const [result, setResult] = useState<{ applicationId: string; amount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (result) {
    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <p className="font-medium">আবেদন গৃহীত হয়েছে</p>
        <p className="mt-2 text-sm">আবেদন আইডি: {result.applicationId}</p>
        <p className="text-sm">ফি: ৳{result.amount} (ডেমো পেমেন্ট যাচাই হয়েছে)</p>
      </div>
    );
  }

  return (
    <form
      className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await fetch("/api/admissions/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              schoolId,
              slug,
              studentName: fd.get("studentName"),
              studentNameBn: fd.get("studentNameBn"),
              dateOfBirth: fd.get("dateOfBirth"),
              gender: fd.get("gender"),
              birthCertificateNo: fd.get("birthCertificateNo"),
              bloodGroup: fd.get("bloodGroup"),
              previousSchool: fd.get("previousSchool"),
              fatherName: fd.get("fatherName"),
              motherName: fd.get("motherName"),
              guardianName: fd.get("guardianName"),
              guardianMobile: fd.get("guardianMobile"),
              guardianEmail: fd.get("guardianEmail"),
              address: fd.get("address"),
              classId: fd.get("classId"),
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || "আবেদন ব্যর্থ");
            return;
          }
          setResult({ applicationId: data.applicationId, amount: data.amount });
        });
      }}
    >
      <Field name="studentName" label="শিক্ষার্থীর নাম" />
      <Field name="studentNameBn" label="বাংলা নাম" />
      <Field name="dateOfBirth" label="জন্ম তারিখ" type="date" />
      <div>
        <Label>লিঙ্গ</Label>
        <select name="gender" className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
          <option value="MALE">ছেলে</option>
          <option value="FEMALE">মেয়ে</option>
        </select>
      </div>
      <Field name="birthCertificateNo" label="জন্ম নিবন্ধন নম্বর" />
      <Field name="bloodGroup" label="রক্তের গ্রুপ" />
      <Field name="previousSchool" label="পূর্ববর্তী স্কুল" />
      <div>
        <Label>ক্লাস</Label>
        <select name="classId" className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Field name="fatherName" label="পিতার নাম" />
      <Field name="motherName" label="মাতার নাম" />
      <Field name="guardianName" label="অভিভাবকের নাম" />
      <Field name="guardianMobile" label="অভিভাবক মোবাইল" />
      <Field name="guardianEmail" label="ইমেইল" />
      <div className="sm:col-span-2">
        <Label>ঠিকানা</Label>
        <Textarea name="address" className="mt-1" />
      </div>
      {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "জমা হচ্ছে..." : "আবেদন ও ফি পরিশোধ"}
      </Button>
    </form>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} type={type} className="mt-1" required={name === "studentName" || name === "guardianMobile"} />
    </div>
  );
}
