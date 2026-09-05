import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId } from "@/lib/id";

const id = () => text("id").primaryKey().$defaultFn(() => createId());
const ts = (name: string) =>
  integer(name, { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date());
const tsNull = (name: string) => integer(name, { mode: "timestamp_ms" });

export const users = sqliteTable(
  "users",
  {
    id: id(),
    email: text("email").notNull(),
    mobile: text("mobile"),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    image: text("image"),
    role: text("role").notNull(),
    status: text("status").notNull().default("ACTIVE"),
    schoolId: text("school_id"),
    emailVerified: tsNull("email_verified"),
    lastLoginAt: tsNull("last_login_at"),
    failedLogins: integer("failed_logins").notNull().default(0),
    lockedUntil: tsNull("locked_until"),
    mustChangePassword: integer("must_change_password", { mode: "boolean" }).notNull().default(false),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("users_email_uq").on(t.email),
    index("users_school_idx").on(t.schoolId),
    index("users_role_idx").on(t.role),
    index("users_mobile_idx").on(t.mobile),
  ],
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: id(),
    userId: text("user_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: ts("expires_at"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    impersonatedBy: text("impersonated_by"),
    revokedAt: tsNull("revoked_at"),
    createdAt: ts("created_at"),
  },
  (t) => [
    uniqueIndex("sessions_token_uq").on(t.tokenHash),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: id(),
    identifier: text("identifier").notNull(),
    ip: text("ip"),
    success: integer("success", { mode: "boolean" }).notNull(),
    createdAt: ts("created_at"),
  },
  (t) => [index("login_attempts_id_idx").on(t.identifier, t.createdAt)],
);

export const roles = sqliteTable("roles", {
  id: id(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(true),
  createdAt: ts("created_at"),
});

export const permissions = sqliteTable("permissions", {
  id: id(),
  key: text("key").notNull().unique(),
  module: text("module").notNull(),
  nameBn: text("name_bn").notNull(),
  createdAt: ts("created_at"),
});

export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    id: id(),
    roleId: text("role_id").notNull(),
    permissionId: text("permission_id").notNull(),
  },
  (t) => [uniqueIndex("role_perm_uq").on(t.roleId, t.permissionId)],
);

export const userRoles = sqliteTable(
  "user_roles",
  {
    id: id(),
    userId: text("user_id").notNull(),
    roleId: text("role_id").notNull(),
    schoolId: text("school_id"),
  },
  (t) => [uniqueIndex("user_role_uq").on(t.userId, t.roleId, t.schoolId)],
);

export const schools = sqliteTable(
  "schools",
  {
    id: id(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    code: text("code").notNull(),
    eiin: text("eiin"),
    type: text("type").notNull().default("private"),
    slug: text("slug").notNull(),
    email: text("email").notNull(),
    mobile: text("mobile").notNull(),
    address: text("address"),
    upazila: text("upazila"),
    district: text("district"),
    division: text("division"),
    status: text("status").notNull().default("TRIAL"),
    logo: text("logo"),
    favicon: text("favicon"),
    banner: text("banner"),
    smsBalance: integer("sms_balance").notNull().default(0),
    storageUsed: integer("storage_used").notNull().default(0),
    onboardingStep: integer("onboarding_step").notNull().default(0),
    onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("schools_code_uq").on(t.code),
    uniqueIndex("schools_slug_uq").on(t.slug),
    index("schools_status_idx").on(t.status),
  ],
);

export const schoolSettings = sqliteTable("school_settings", {
  id: id(),
  schoolId: text("school_id").notNull().unique(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  principalName: text("principal_name"),
  principalPhoto: text("principal_photo"),
  principalMessage: text("principal_message"),
  about: text("about"),
  establishedYear: integer("established_year"),
  currency: text("currency").notNull().default("BDT"),
  timezone: text("timezone").notNull().default("Asia/Dhaka"),
  primaryColor: text("primary_color").notNull().default("#0F766E"),
  secondaryColor: text("secondary_color").notNull().default("#C2410C"),
  facebook: text("facebook"),
  youtube: text("youtube"),
  gradingJson: text("grading_json"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});

export const schoolWebsites = sqliteTable("school_websites", {
  id: id(),
  schoolId: text("school_id").notNull().unique(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  showAdmissionCta: integer("show_admission_cta", { mode: "boolean" }).notNull().default(true),
  showNotices: integer("show_notices", { mode: "boolean" }).notNull().default(true),
  showTeachers: integer("show_teachers", { mode: "boolean" }).notNull().default(true),
  theme: text("theme").notNull().default("classic"),
  footerText: text("footer_text"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});

export const schoolDomains = sqliteTable(
  "school_domains",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    domain: text("domain").notNull(),
    type: text("type").notNull().default("SUBDOMAIN"),
    status: text("status").notNull().default("PENDING"),
    verificationToken: text("verification_token"),
    verifiedAt: tsNull("verified_at"),
    sslStatus: text("ssl_status").notNull().default("PENDING"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("school_domains_domain_uq").on(t.domain),
    index("school_domains_school_idx").on(t.schoolId),
  ],
);

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: id(),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  priceMonthly: real("price_monthly").notNull().default(0),
  priceYearly: real("price_yearly").notNull().default(0),
  maxStudents: integer("max_students").notNull().default(100),
  maxTeachers: integer("max_teachers").notNull().default(10),
  maxStaff: integer("max_staff").notNull().default(5),
  smsAllocation: integer("sms_allocation").notNull().default(0),
  storageLimitMb: integer("storage_limit_mb").notNull().default(500),
  customDomain: integer("custom_domain", { mode: "boolean" }).notNull().default(false),
  onlineAdmission: integer("online_admission", { mode: "boolean" }).notNull().default(true),
  schoolWebsite: integer("school_website", { mode: "boolean" }).notNull().default(true),
  supportLevel: text("support_level").notNull().default("email"),
  featuresJson: text("features_json"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    planId: text("plan_id").notNull(),
    status: text("status").notNull().default("TRIAL"),
    billingCycle: text("billing_cycle").notNull().default("MONTHLY"),
    startsAt: ts("starts_at"),
    endsAt: ts("ends_at"),
    trialEndsAt: tsNull("trial_ends_at"),
    cancelledAt: tsNull("cancelled_at"),
    lastWarningAt: tsNull("last_warning_at"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    index("subs_school_idx").on(t.schoolId),
    index("subs_status_idx").on(t.status),
  ],
);

export const paymentTransactions = sqliteTable(
  "payment_transactions",
  {
    id: id(),
    schoolId: text("school_id"),
    userId: text("user_id"),
    purpose: text("purpose").notNull(),
    amount: real("amount").notNull(),
    currency: text("currency").notNull().default("BDT"),
    provider: text("provider").notNull(),
    transactionId: text("transaction_id"),
    gatewayRef: text("gateway_ref"),
    status: text("status").notNull().default("PENDING"),
    paymentMethod: text("payment_method"),
    paidAt: tsNull("paid_at"),
    metadata: text("metadata"),
    idempotencyKey: text("idempotency_key"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("pay_idem_uq").on(t.idempotencyKey),
    index("pay_school_idx").on(t.schoolId),
    index("pay_status_idx").on(t.status),
    index("pay_txn_idx").on(t.transactionId),
  ],
);

export const smsProviders = sqliteTable("sms_providers", {
  id: id(),
  name: text("name").notNull(),
  type: text("type").notNull().default("generic_http"),
  apiUrl: text("api_url"),
  apiKey: text("api_key"),
  senderId: text("sender_id"),
  username: text("username"),
  password: text("password"),
  encoding: text("encoding").notNull().default("UTF-8"),
  rate: real("rate").notNull().default(0.35),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});

export const smsPackages = sqliteTable("sms_packages", {
  id: id(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  price: real("price").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: ts("created_at"),
});

export const smsCreditTransactions = sqliteTable(
  "sms_credit_transactions",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    type: text("type").notNull(),
    credits: integer("credits").notNull(),
    balanceBefore: integer("balance_before").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),
    createdBy: text("created_by"),
    createdAt: ts("created_at"),
  },
  (t) => [index("sms_credit_school_idx").on(t.schoolId)],
);

export const smsMessages = sqliteTable(
  "sms_messages",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    recipient: text("recipient").notNull(),
    mobile: text("mobile").notNull(),
    message: text("message").notNull(),
    characterCount: integer("character_count").notNull(),
    smsCount: integer("sms_count").notNull(),
    status: text("status").notNull().default("QUEUED"),
    providerRef: text("provider_ref"),
    sentBy: text("sent_by"),
    sentAt: tsNull("sent_at"),
    createdAt: ts("created_at"),
  },
  (t) => [
    index("sms_msg_school_idx").on(t.schoolId),
    index("sms_msg_status_idx").on(t.status),
  ],
);

export const smsQueue = sqliteTable(
  "sms_queue",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    messageId: text("message_id").notNull(),
    attempts: integer("attempts").notNull().default(0),
    nextRunAt: ts("next_run_at"),
    lockedAt: tsNull("locked_at"),
    createdAt: ts("created_at"),
  },
  (t) => [index("sms_queue_run_idx").on(t.nextRunAt)],
);

export const academicYears = sqliteTable(
  "academic_years",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    name: text("name").notNull(),
    startsOn: text("starts_on").notNull(),
    endsOn: text("ends_on").notNull(),
    isCurrent: integer("is_current", { mode: "boolean" }).notNull().default(false),
    createdAt: ts("created_at"),
  },
  (t) => [index("ay_school_idx").on(t.schoolId), uniqueIndex("ay_school_name_uq").on(t.schoolId, t.name)],
);

export const classes = sqliteTable(
  "classes",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    numericLevel: integer("numeric_level").notNull().default(0),
    createdAt: ts("created_at"),
  },
  (t) => [index("class_school_idx").on(t.schoolId), uniqueIndex("class_school_name_uq").on(t.schoolId, t.name)],
);

export const sections = sqliteTable(
  "sections",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    classId: text("class_id").notNull(),
    name: text("name").notNull(),
    createdAt: ts("created_at"),
  },
  (t) => [index("section_school_idx").on(t.schoolId), uniqueIndex("section_class_name_uq").on(t.classId, t.name)],
);

export const subjects = sqliteTable(
  "subjects",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    classId: text("class_id"),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    code: text("code"),
    createdAt: ts("created_at"),
  },
  (t) => [index("subject_school_idx").on(t.schoolId)],
);

export const teachers = sqliteTable(
  "teachers",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    userId: text("user_id").notNull(),
    employeeId: text("employee_id").notNull(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    phone: text("phone"),
    email: text("email"),
    photo: text("photo"),
    address: text("address"),
    joinDate: text("join_date"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("teacher_emp_uq").on(t.schoolId, t.employeeId),
    uniqueIndex("teacher_user_uq").on(t.userId),
    index("teacher_school_idx").on(t.schoolId),
  ],
);

export const teacherAssignments = sqliteTable(
  "teacher_assignments",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    teacherId: text("teacher_id").notNull(),
    classId: text("class_id").notNull(),
    sectionId: text("section_id"),
    subjectId: text("subject_id"),
    createdAt: ts("created_at"),
  },
  (t) => [index("ta_school_idx").on(t.schoolId), index("ta_teacher_idx").on(t.teacherId)],
);

export const accountants = sqliteTable(
  "accountants",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    userId: text("user_id").notNull(),
    employeeId: text("employee_id").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    email: text("email"),
    photo: text("photo"),
    joinDate: text("join_date"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("acc_emp_uq").on(t.schoolId, t.employeeId),
    uniqueIndex("acc_user_uq").on(t.userId),
    index("acc_school_idx").on(t.schoolId),
  ],
);

export const guardians = sqliteTable(
  "guardians",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    userId: text("user_id"),
    name: text("name").notNull(),
    relation: text("relation"),
    mobile: text("mobile"),
    email: text("email"),
    occupation: text("occupation"),
    address: text("address"),
    createdAt: ts("created_at"),
  },
  (t) => [index("guardian_school_idx").on(t.schoolId)],
);

export const students = sqliteTable(
  "students",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    userId: text("user_id"),
    studentId: text("student_id").notNull(),
    admissionNumber: text("admission_number").notNull(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    dateOfBirth: text("date_of_birth"),
    gender: text("gender"),
    photo: text("photo"),
    birthCertificate: text("birth_certificate"),
    bloodGroup: text("blood_group"),
    classId: text("class_id"),
    sectionId: text("section_id"),
    roll: integer("roll"),
    academicYearId: text("academic_year_id"),
    mobile: text("mobile"),
    address: text("address"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("student_sid_uq").on(t.schoolId, t.studentId),
    uniqueIndex("student_adm_uq").on(t.schoolId, t.admissionNumber),
    index("student_school_idx").on(t.schoolId),
    index("student_class_idx").on(t.schoolId, t.classId, t.sectionId),
  ],
);

export const studentGuardians = sqliteTable(
  "student_guardians",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    studentId: text("student_id").notNull(),
    guardianId: text("guardian_id").notNull(),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(true),
  },
  (t) => [uniqueIndex("sg_uq").on(t.studentId, t.guardianId)],
);

export const attendanceSessions = sqliteTable(
  "attendance_sessions",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    classId: text("class_id").notNull(),
    sectionId: text("section_id"),
    date: text("date").notNull(),
    takenBy: text("taken_by"),
    createdAt: ts("created_at"),
  },
  (t) => [uniqueIndex("att_sess_uq").on(t.schoolId, t.classId, t.sectionId, t.date)],
);

export const attendanceRecords = sqliteTable(
  "attendance_records",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    sessionId: text("session_id").notNull(),
    studentId: text("student_id").notNull(),
    status: text("status").notNull(),
    note: text("note"),
    createdAt: ts("created_at"),
  },
  (t) => [
    uniqueIndex("att_rec_uq").on(t.sessionId, t.studentId),
    index("att_rec_student_idx").on(t.schoolId, t.studentId),
  ],
);

export const exams = sqliteTable(
  "exams",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    academicYearId: text("academic_year_id"),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    type: text("type").notNull().default("OTHER"),
    startsOn: text("starts_on"),
    endsOn: text("ends_on"),
    createdAt: ts("created_at"),
  },
  (t) => [index("exam_school_idx").on(t.schoolId)],
);

export const examSubjects = sqliteTable(
  "exam_subjects",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    examId: text("exam_id").notNull(),
    subjectId: text("subject_id").notNull(),
    classId: text("class_id"),
    fullMarks: real("full_marks").notNull().default(100),
    passMarks: real("pass_marks").notNull().default(33),
  },
  (t) => [index("exam_subj_idx").on(t.examId)],
);

export const results = sqliteTable(
  "results",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    examId: text("exam_id").notNull(),
    examSubjectId: text("exam_subject_id").notNull(),
    studentId: text("student_id").notNull(),
    marks: real("marks").notNull().default(0),
    grade: text("grade"),
    gpa: real("gpa"),
    remarks: text("remarks"),
    enteredBy: text("entered_by"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("result_uq").on(t.examSubjectId, t.studentId),
    index("result_student_idx").on(t.schoolId, t.studentId),
  ],
);

export const feeTypes = sqliteTable(
  "fee_types",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    name: text("name").notNull(),
    nameBn: text("name_bn"),
    frequency: text("frequency").notNull().default("ONE_TIME"),
    createdAt: ts("created_at"),
  },
  (t) => [index("fee_type_school_idx").on(t.schoolId)],
);

export const feeStructures = sqliteTable(
  "fee_structures",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    feeTypeId: text("fee_type_id").notNull(),
    classId: text("class_id"),
    academicYearId: text("academic_year_id"),
    amount: real("amount").notNull(),
    dueDay: integer("due_day"),
    createdAt: ts("created_at"),
  },
  (t) => [index("fee_struct_school_idx").on(t.schoolId)],
);

export const studentFees = sqliteTable(
  "student_fees",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    studentId: text("student_id").notNull(),
    feeStructureId: text("fee_structure_id"),
    title: text("title").notNull(),
    amount: real("amount").notNull(),
    discount: real("discount").notNull().default(0),
    fine: real("fine").notNull().default(0),
    paid: real("paid").notNull().default(0),
    due: real("due").notNull().default(0),
    dueDate: text("due_date"),
    status: text("status").notNull().default("DUE"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [index("stfee_school_idx").on(t.schoolId), index("stfee_student_idx").on(t.studentId)],
);

export const feePayments = sqliteTable(
  "fee_payments",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    studentId: text("student_id").notNull(),
    studentFeeId: text("student_fee_id"),
    paymentTransactionId: text("payment_transaction_id"),
    amount: real("amount").notNull(),
    method: text("method").notNull().default("CASH"),
    receivedBy: text("received_by"),
    paidAt: ts("paid_at"),
    status: text("status").notNull().default("PAID"),
    createdAt: ts("created_at"),
  },
  (t) => [index("feepay_school_idx").on(t.schoolId), index("feepay_student_idx").on(t.studentId)],
);

export const receipts = sqliteTable(
  "receipts",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    receiptNumber: text("receipt_number").notNull(),
    feePaymentId: text("fee_payment_id").notNull(),
    studentId: text("student_id").notNull(),
    payloadJson: text("payload_json"),
    createdAt: ts("created_at"),
  },
  (t) => [uniqueIndex("receipt_no_uq").on(t.schoolId, t.receiptNumber)],
);

export const admissionApplications = sqliteTable(
  "admission_applications",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    applicationId: text("application_id").notNull(),
    studentName: text("student_name").notNull(),
    studentNameBn: text("student_name_bn"),
    dateOfBirth: text("date_of_birth"),
    gender: text("gender"),
    birthCertificateNo: text("birth_certificate_no"),
    bloodGroup: text("blood_group"),
    previousSchool: text("previous_school"),
    photo: text("photo"),
    fatherName: text("father_name"),
    motherName: text("mother_name"),
    guardianName: text("guardian_name"),
    guardianMobile: text("guardian_mobile"),
    guardianEmail: text("guardian_email"),
    address: text("address"),
    academicYearId: text("academic_year_id"),
    classId: text("class_id"),
    sectionPreference: text("section_preference"),
    status: text("status").notNull().default("PENDING"),
    notes: text("notes"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    uniqueIndex("adm_appid_uq").on(t.schoolId, t.applicationId),
    index("adm_school_idx").on(t.schoolId),
    index("adm_status_idx").on(t.schoolId, t.status),
  ],
);

export const admissionDocuments = sqliteTable("admission_documents", {
  id: id(),
  schoolId: text("school_id").notNull(),
  applicationId: text("application_id").notNull(),
  kind: text("kind").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  storageKey: text("storage_key").notNull(),
  createdAt: ts("created_at"),
});

export const admissionPayments = sqliteTable(
  "admission_payments",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    applicationId: text("application_id").notNull(),
    paymentTransactionId: text("payment_transaction_id"),
    amount: real("amount").notNull(),
    status: text("status").notNull().default("PENDING"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [index("admpay_school_idx").on(t.schoolId)],
);

export const notices = sqliteTable(
  "notices",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    publishDate: text("publish_date").notNull(),
    expiryDate: text("expiry_date"),
    attachment: text("attachment"),
    audience: text("audience").notNull().default("EVERYONE"),
    classId: text("class_id"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
    createdBy: text("created_by"),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [index("notice_school_idx").on(t.schoolId)],
);

export const schoolDocuments = sqliteTable(
  "school_documents",
  {
    id: id(),
    schoolId: text("school_id").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull().default("OTHER"),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    storageKey: text("storage_key").notNull(),
    visibility: text("visibility").notNull().default("PUBLIC"),
    classId: text("class_id"),
    academicYearId: text("academic_year_id"),
    createdAt: ts("created_at"),
  },
  (t) => [index("doc_school_idx").on(t.schoolId)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: id(),
    schoolId: text("school_id"),
    userId: text("user_id"),
    action: text("action").notNull(),
    module: text("module").notNull(),
    resource: text("resource"),
    resourceId: text("resource_id"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    beforeJson: text("before_json"),
    afterJson: text("after_json"),
    createdAt: ts("created_at"),
  },
  (t) => [
    index("audit_school_idx").on(t.schoolId),
    index("audit_created_idx").on(t.createdAt),
  ],
);

export const notifications = sqliteTable(
  "notifications",
  {
    id: id(),
    schoolId: text("school_id"),
    userId: text("user_id"),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: ts("created_at"),
  },
  (t) => [index("notif_user_idx").on(t.userId)],
);

export const platformSettings = sqliteTable("platform_settings", {
  id: text("id").primaryKey().default("platform"),
  saasName: text("saas_name").notNull().default("বিধাপীঠ"),
  logo: text("logo"),
  supportEmail: text("support_email").notNull().default("support@bidhapith.com"),
  supportPhone: text("support_phone").notNull().default("01700000000"),
  currency: text("currency").notNull().default("BDT"),
  timezone: text("timezone").notNull().default("Asia/Dhaka"),
  defaultLanguage: text("default_language").notNull().default("bn"),
  paymentJson: text("payment_json"),
  smsJson: text("sms_json"),
  domainJson: text("domain_json"),
  smtpJson: text("smtp_json"),
  securityJson: text("security_json"),
  updatedAt: ts("updated_at"),
});

export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: id(),
    userId: text("user_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: ts("expires_at"),
    usedAt: tsNull("used_at"),
    createdAt: ts("created_at"),
  },
  (t) => [index("prt_user_idx").on(t.userId)],
);

export const csvImports = sqliteTable("csv_imports", {
  id: id(),
  schoolId: text("school_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("PREVIEW"),
  totalRows: integer("total_rows").notNull().default(0),
  successRows: integer("success_rows").notNull().default(0),
  errorJson: text("error_json"),
  createdBy: text("created_by"),
  createdAt: ts("created_at"),
});

export const usersRelations = relations(users, ({ one }) => ({
  school: one(schools, { fields: [users.schoolId], references: [schools.id] }),
}));

export const schoolsRelations = relations(schools, ({ many, one }) => ({
  users: many(users),
  settings: one(schoolSettings, { fields: [schools.id], references: [schoolSettings.schoolId] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type School = typeof schools.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type AdmissionApplication = typeof admissionApplications.$inferSelect;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type SmsMessage = typeof smsMessages.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
