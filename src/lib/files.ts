const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_BYTES = 8 * 1024 * 1024;

export function validateUpload(file: { type: string; size: number; name: string }) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("শুধু JPG, PNG, WEBP ও PDF আপলোড করা যাবে");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("ফাইল ৮ MB-এর বেশি হতে পারবে না");
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png", "webp", "pdf"].includes(ext)) {
    throw new Error("ফাইল এক্সটেনশন সঠিক নয়");
  }
}
