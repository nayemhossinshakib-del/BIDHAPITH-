export const PLATFORM = {
  name: "বিধাপীঠ",
  nameEn: "Bidhapith",
  tagline: "বাংলাদেশের স্কুল ব্যবস্থাপনা এখন আরও সহজ",
  supportEmail: "support@bidhapith.com",
  supportPhone: "01700000000",
  currency: "BDT",
  timezone: "Asia/Dhaka",
} as const;

export const ROLES = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "TEACHER",
  "ACCOUNTANT",
  "STUDENT",
  "GUARDIAN",
  "STAFF",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  SCHOOL_ADMIN: "/school",
  TEACHER: "/teacher",
  ACCOUNTANT: "/accountant",
  STUDENT: "/student",
  GUARDIAN: "/student",
  STAFF: "/school",
};

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "সুপার অ্যাডমিন",
  SCHOOL_ADMIN: "স্কুল অ্যাডমিন",
  TEACHER: "শিক্ষক",
  ACCOUNTANT: "হিসাবরক্ষক",
  STUDENT: "শিক্ষার্থী",
  GUARDIAN: "অভিভাবক",
  STAFF: "কর্মী",
};

export const PERMISSIONS = [
  "student.view",
  "student.create",
  "student.update",
  "student.delete",
  "teacher.view",
  "teacher.create",
  "teacher.update",
  "teacher.delete",
  "accountant.view",
  "accountant.create",
  "accountant.update",
  "accountant.delete",
  "accounting.view",
  "accounting.create",
  "accounting.update",
  "accounting.delete",
  "admission.view",
  "admission.approve",
  "admission.reject",
  "sms.view",
  "sms.send",
  "sms.history",
  "website.manage",
  "website.settings",
  "website.pages",
  "reports.view",
  "settings.manage",
  "school.manage",
  "subscription.view",
  "subscription.manage",
  "attendance.view",
  "attendance.manage",
  "result.view",
  "result.manage",
  "notice.manage",
  "document.manage",
  "class.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [...PERMISSIONS],
  SCHOOL_ADMIN: [...PERMISSIONS],
  TEACHER: [
    "student.view",
    "attendance.view",
    "attendance.manage",
    "result.view",
    "result.manage",
    "reports.view",
  ],
  ACCOUNTANT: [
    "student.view",
    "accounting.view",
    "accounting.create",
    "accounting.update",
    "admission.view",
    "reports.view",
  ],
  STUDENT: ["result.view", "attendance.view"],
  GUARDIAN: ["result.view", "attendance.view", "accounting.view"],
  STAFF: ["student.view", "reports.view"],
};

export const DIVISIONS = [
  { id: "dhaka", name: "ঢাকা", nameEn: "Dhaka" },
  { id: "chattogram", name: "চট্টগ্রাম", nameEn: "Chattogram" },
  { id: "rajshahi", name: "রাজশাহী", nameEn: "Rajshahi" },
  { id: "khulna", name: "খুলনা", nameEn: "Khulna" },
  { id: "barishal", name: "বরিশাল", nameEn: "Barishal" },
  { id: "sylhet", name: "সিলেট", nameEn: "Sylhet" },
  { id: "rangpur", name: "রংপুর", nameEn: "Rangpur" },
  { id: "mymensingh", name: "ময়মনসিংহ", nameEn: "Mymensingh" },
] as const;

export const DISTRICTS: Record<string, { id: string; name: string }[]> = {
  dhaka: [
    { id: "dhaka", name: "ঢাকা" },
    { id: "gazipur", name: "গাজীপুর" },
    { id: "narayanganj", name: "নারায়ণগঞ্জ" },
    { id: "tangail", name: "টাঙ্গাইল" },
    { id: "kishoreganj", name: "কিশোরগঞ্জ" },
  ],
  chattogram: [
    { id: "chattogram", name: "চট্টগ্রাম" },
    { id: "coxsbazar", name: "কক্সবাজার" },
    { id: "cumilla", name: "কুমিল্লা" },
    { id: "feni", name: "ফেনী" },
  ],
  rajshahi: [
    { id: "rajshahi", name: "রাজশাহী" },
    { id: "bogura", name: "বগুড়া" },
    { id: "pabna", name: "পাবনা" },
  ],
  khulna: [
    { id: "khulna", name: "খুলনা" },
    { id: "jessore", name: "যশোর" },
    { id: "kushtia", name: "কুষ্টিয়া" },
  ],
  barishal: [
    { id: "barishal", name: "বরিশাল" },
    { id: "patuakhali", name: "পটুয়াখালী" },
  ],
  sylhet: [
    { id: "sylhet", name: "সিলেট" },
    { id: "moulvibazar", name: "মৌলভীবাজার" },
  ],
  rangpur: [
    { id: "rangpur", name: "রংপুর" },
    { id: "dinajpur", name: "দিনাজপুর" },
  ],
  mymensingh: [
    { id: "mymensingh", name: "ময়মনসিংহ" },
    { id: "jamalpur", name: "জামালপুর" },
  ],
};

export const SCHOOL_TYPES = [
  { id: "govt_primary", name: "সরকারি প্রাথমিক বিদ্যালয়" },
  { id: "govt_secondary", name: "সরকারি মাধ্যমিক বিদ্যালয়" },
  { id: "private", name: "বেসরকারি বিদ্যালয়" },
  { id: "kindergarten", name: "কিন্ডারগার্টেন" },
  { id: "madrasah", name: "মাদ্রাসা" },
  { id: "technical", name: "কারিগরি বিদ্যালয়" },
  { id: "english_medium", name: "ইংলিশ মিডিয়াম" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const GENDERS = [
  { id: "MALE", name: "ছেলে" },
  { id: "FEMALE", name: "মেয়ে" },
  { id: "OTHER", name: "অন্যান্য" },
] as const;

export const SESSION_COOKIE = "bidhapith_session";
export const IMPERSONATE_COOKIE = "bidhapith_impersonator";
export const THEME_COOKIE = "bidhapith_theme";

export const DEMO_ACCOUNTS = [
  {
    role: "SUPER_ADMIN" as Role,
    email: "admin@bidhapith.test",
    password: "Demo@1234",
    label: "সুপার অ্যাডমিন",
  },
  {
    role: "SCHOOL_ADMIN" as Role,
    email: "admin@abcschool.test",
    password: "Demo@1234",
    label: "স্কুল অ্যাডমিন (আদর্শ)",
  },
  {
    role: "TEACHER" as Role,
    email: "teacher@abcschool.test",
    password: "Demo@1234",
    label: "শিক্ষক",
  },
  {
    role: "ACCOUNTANT" as Role,
    email: "accountant@abcschool.test",
    password: "Demo@1234",
    label: "হিসাবরক্ষক",
  },
  {
    role: "STUDENT" as Role,
    email: "student@abcschool.test",
    password: "Demo@1234",
    label: "শিক্ষার্থী",
  },
];
