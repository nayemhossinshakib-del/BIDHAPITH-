import { z } from "zod";

export const bdMobile = z
  .string()
  .trim()
  .regex(/^01[3-9]\d{8}$/, "মোবাইল নম্বর 01XXXXXXXXX ফরম্যাটে দিন");

export const emailSchema = z.string().trim().toLowerCase().email("সঠিক ইমেইল দিন");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
});
