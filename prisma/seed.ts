import { eq } from "drizzle-orm";

process.env.DATABASE_URL ||= "file:./data/bidhapith.db";

import { db } from "../src/db";
import {
  academicYears,
  accountants,
  admissionApplications,
  attendanceRecords,
  attendanceSessions,
  auditLogs,
  classes,
  examSubjects,
  exams,
  feePayments,
  feeStructures,
  feeTypes,
  guardians,
  notices,
  paymentTransactions,
  permissions as permTable,
  platformSettings,
  receipts,
  results,
  rolePermissions,
  roles,
  schoolDocuments,
  schoolDomains,
  schoolSettings,
  schoolWebsites,
  schools,
  sections,
  smsCreditTransactions,
  smsMessages,
  smsPackages,
  smsProviders,
  studentFees,
  studentGuardians,
  students,
  subjects,
  subscriptionPlans,
  subscriptions,
  teacherAssignments,
  teachers,
  users,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import { DEFAULT_ROLE_PERMISSIONS, PERMISSIONS, ROLES } from "../src/lib/constants";
import { createId, publicCode } from "../src/lib/id";

async function seed() {
  console.log("Seeding বিধাপীঠ...");

  const existing = db.select().from(users).where(eq(users.email, "admin@bidhapith.test")).get();
  if (existing) {
    console.log("Already seeded.");
    return;
  }

  const passwordHash = await hashPassword("Demo@1234");

  for (const key of ROLES) {
    db.insert(roles)
      .values({
        id: createId(),
        key,
        name: key,
        nameBn: key,
        isSystem: true,
      })
      .run();
  }
  for (const key of PERMISSIONS) {
    db.insert(permTable)
      .values({
        id: createId(),
        key,
        module: key.split(".")[0],
        nameBn: key,
      })
      .run();
  }
  const roleRows = db.select().from(roles).all();
  const permRows = db.select().from(permTable).all();
  for (const role of roleRows) {
    const keys = DEFAULT_ROLE_PERMISSIONS[role.key as keyof typeof DEFAULT_ROLE_PERMISSIONS] ?? [];
    for (const k of keys) {
      const p = permRows.find((x) => x.key === k);
      if (!p) continue;
      db.insert(rolePermissions)
        .values({ id: createId(), roleId: role.id, permissionId: p.id })
        .run();
    }
  }

  db.insert(platformSettings)
    .values({
      id: "platform",
      saasName: "বিধাপীঠ",
      supportEmail: "support@bidhapith.com",
      supportPhone: "01700000000",
    })
    .run();

  const plans = [
    {
      slug: "trial",
      name: "Free Trial",
      nameBn: "ফ্রি ট্রায়াল",
      priceMonthly: 0,
      priceYearly: 0,
      maxStudents: 50,
      maxTeachers: 5,
      smsAllocation: 50,
      customDomain: false,
      sortOrder: 0,
    },
    {
      slug: "basic",
      name: "Basic",
      nameBn: "বেসিক",
      priceMonthly: 1499,
      priceYearly: 14990,
      maxStudents: 200,
      maxTeachers: 15,
      smsAllocation: 200,
      customDomain: false,
      sortOrder: 1,
    },
    {
      slug: "professional",
      name: "Professional",
      nameBn: "প্রফেশনাল",
      priceMonthly: 3499,
      priceYearly: 34990,
      maxStudents: 800,
      maxTeachers: 40,
      smsAllocation: 1000,
      customDomain: true,
      sortOrder: 2,
    },
    {
      slug: "premium",
      name: "Premium",
      nameBn: "প্রিমিয়াম",
      priceMonthly: 6999,
      priceYearly: 69990,
      maxStudents: 2000,
      maxTeachers: 80,
      smsAllocation: 3000,
      customDomain: true,
      sortOrder: 3,
    },
    {
      slug: "enterprise",
      name: "Enterprise",
      nameBn: "এন্টারপ্রাইজ",
      priceMonthly: 12999,
      priceYearly: 129990,
      maxStudents: 10000,
      maxTeachers: 250,
      smsAllocation: 10000,
      customDomain: true,
      sortOrder: 4,
    },
  ];
  const planIds: Record<string, string> = {};
  for (const p of plans) {
    const id = createId();
    planIds[p.slug] = id;
    db.insert(subscriptionPlans)
      .values({
        id,
        ...p,
        maxStaff: Math.ceil(p.maxTeachers / 4),
        storageLimitMb: p.sortOrder * 2000 + 500,
        onlineAdmission: true,
        schoolWebsite: true,
        supportLevel: p.slug === "enterprise" ? "priority" : "email",
        featuresJson: JSON.stringify([
          "স্কুল ওয়েবসাইট",
          "অনলাইন ভর্তি",
          "ফি ব্যবস্থাপনা",
          "এসএমএস",
        ]),
        isActive: true,
      })
      .run();
  }

  db.insert(smsProviders)
    .values({
      id: createId(),
      name: "Demo Gateway",
      type: "demo",
      senderId: "BIDHAPITH",
      isActive: true,
      rate: 0.35,
    })
    .run();

  for (const pack of [
    { name: "৫০০ এসএমএস", credits: 500, price: 175 },
    { name: "১০০০ এসএমএস", credits: 1000, price: 330 },
    { name: "৫০০০ এসএমএস", credits: 5000, price: 1500 },
  ]) {
    db.insert(smsPackages).values({ id: createId(), ...pack, isActive: true }).run();
  }

  const superId = createId();
  db.insert(users)
    .values({
      id: superId,
      email: "admin@bidhapith.test",
      mobile: "01711000000",
      passwordHash,
      name: "Super Admin",
      nameBn: "সুপার অ্যাডমিন",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    })
    .run();

  async function seedSchool(opts: {
    name: string;
    nameBn: string;
    slug: string;
    code: string;
    district: string;
    division: string;
    plan: string;
    status: string;
    sms: number;
    primary: string;
  }) {
    const schoolId = createId();
    db.insert(schools)
      .values({
        id: schoolId,
        name: opts.name,
        nameBn: opts.nameBn,
        code: opts.code,
        eiin: opts.slug === "adarsha" ? "108912" : "204511",
        type: "private",
        slug: opts.slug,
        email: `office@${opts.slug}.edu.bd`,
        mobile: opts.slug === "adarsha" ? "01711112222" : "01811113333",
        address: `${opts.district}, বাংলাদেশ`,
        district: opts.district,
        division: opts.division,
        status: opts.status,
        smsBalance: opts.sms,
        onboardingComplete: true,
        onboardingStep: 10,
      })
      .run();

    db.insert(schoolSettings)
      .values({
        id: createId(),
        schoolId,
        phone: opts.slug === "adarsha" ? "01711112222" : "01811113333",
        email: `office@${opts.slug}.edu.bd`,
        principalName: opts.slug === "adarsha" ? "প্রফেসর নাজমুল হক" : "মোছা. ফারহানা আক্তার",
        principalMessage:
          "আমাদের বিদ্যালয়ে আপনাকে স্বাগতম। আমরা শিক্ষার্থীদের নৈতিকতা ও জ্ঞানে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।",
        about: `${opts.nameBn} বাংলাদেশের একটি সুপরিচিত শিক্ষা প্রতিষ্ঠান। এখানে প্রাথমিক থেকে মাধ্যমিক পর্যায় পর্যন্ত পাঠদান করা হয়।`,
        establishedYear: opts.slug === "adarsha" ? 1998 : 2005,
        primaryColor: opts.primary,
        facebook: "https://facebook.com",
      })
      .run();

    db.insert(schoolWebsites)
      .values({
        id: createId(),
        schoolId,
        seoTitle: opts.nameBn,
        seoDescription: `${opts.nameBn} — অনলাইন ভর্তি, নোটিশ ও একাডেমিক তথ্য`,
        heroTitle: opts.nameBn,
        heroSubtitle: "জ্ঞান, নৈতিকতা ও নেতৃত্ব",
        footerText: `© ${new Date().getFullYear()} ${opts.nameBn}`,
      })
      .run();

    db.insert(schoolDomains)
      .values({
        id: createId(),
        schoolId,
        domain: `${opts.slug}.localhost`,
        type: "SUBDOMAIN",
        status: "ACTIVE",
        sslStatus: "ACTIVE",
        verifiedAt: new Date(),
      })
      .run();

    const ends = new Date();
    ends.setMonth(ends.getMonth() + 10);
    db.insert(subscriptions)
      .values({
        id: createId(),
        schoolId,
        planId: planIds[opts.plan],
        status: opts.status === "TRIAL" ? "TRIAL" : "ACTIVE",
        billingCycle: "YEARLY",
        startsAt: new Date(),
        endsAt: ends,
      })
      .run();

    const adminId = createId();
    db.insert(users)
      .values({
        id: adminId,
        email: `admin@${opts.slug}school.test`,
        mobile: opts.slug === "adarsha" ? "01711112222" : "01811113333",
        passwordHash,
        name: opts.slug === "adarsha" ? "রাকিব হাসান" : "সাবরিনা চৌধুরী",
        nameBn: opts.slug === "adarsha" ? "রাকিব হাসান" : "সাবরিনা চৌধুরী",
        role: "SCHOOL_ADMIN",
        status: "ACTIVE",
        schoolId,
      })
      .run();

    const yearId = createId();
    db.insert(academicYears)
      .values({
        id: yearId,
        schoolId,
        name: "২০২৬",
        startsOn: "2026-01-01",
        endsOn: "2026-12-31",
        isCurrent: true,
      })
      .run();

    const classMap: Record<string, string> = {};
    const sectionMap: Record<string, string> = {};
    for (const [i, cname] of ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"].entries()) {
      const cid = createId();
      classMap[cname] = cid;
      db.insert(classes)
        .values({
          id: cid,
          schoolId,
          name: `Class ${i + 6}`,
          nameBn: cname,
          numericLevel: i + 6,
        })
        .run();
      for (const s of ["A", "B"]) {
        const sid = createId();
        sectionMap[`${cname}-${s}`] = sid;
        db.insert(sections).values({ id: sid, schoolId, classId: cid, name: s }).run();
      }
    }

    const subjectNames = [
      ["BAN", "বাংলা", "Bangla"],
      ["ENG", "ইংরেজি", "English"],
      ["MATH", "গণিত", "Mathematics"],
      ["SCI", "বিজ্ঞান", "Science"],
      ["SOC", "সমাজবিজ্ঞান", "Social Science"],
      ["REL", "ধর্ম", "Religion"],
    ];
    const subjectIds: string[] = [];
    for (const [code, bn, en] of subjectNames) {
      const sid = createId();
      subjectIds.push(sid);
      db.insert(subjects)
        .values({
          id: sid,
          schoolId,
          name: en,
          nameBn: bn,
          code,
          classId: classMap["ষষ্ঠ"],
        })
        .run();
    }

    const teacherUserId = createId();
    db.insert(users)
      .values({
        id: teacherUserId,
        email: `teacher@${opts.slug}school.test`,
        mobile: opts.slug === "adarsha" ? "01712000001" : "01812000001",
        passwordHash,
        name: "Mahmuda Akter",
        nameBn: "মাহমুদা আক্তার",
        role: "TEACHER",
        status: "ACTIVE",
        schoolId,
      })
      .run();
    const teacherId = createId();
    db.insert(teachers)
      .values({
        id: teacherId,
        schoolId,
        userId: teacherUserId,
        employeeId: "T-1001",
        name: "Mahmuda Akter",
        nameBn: "মাহমুদা আক্তার",
        phone: "01712000001",
        email: `teacher@${opts.slug}school.test`,
        joinDate: "2020-01-12",
        status: "ACTIVE",
      })
      .run();
    db.insert(teacherAssignments)
      .values({
        id: createId(),
        schoolId,
        teacherId,
        classId: classMap["ষষ্ঠ"],
        sectionId: sectionMap["ষষ্ঠ-A"],
        subjectId: subjectIds[0],
      })
      .run();

    const extraTeachers = [
      ["Kamrul Islam", "কামরুল ইসলাম", "T-1002"],
      ["Nusrat Jahan", "নুসরাত জাহান", "T-1003"],
      ["Shahriar Kabir", "শাহরিয়ার কবির", "T-1004"],
    ];
    extraTeachers.forEach((t, idx) => {
      const uid = createId();
      db.insert(users)
        .values({
          id: uid,
          email: `${t[2].toLowerCase()}@${opts.slug}school.test`,
          mobile: `0171300000${idx}`,
          passwordHash,
          name: t[0],
          nameBn: t[1],
          role: "TEACHER",
          status: "ACTIVE",
          schoolId,
        })
        .run();
      const tid = createId();
      db.insert(teachers)
        .values({
          id: tid,
          schoolId,
          userId: uid,
          employeeId: t[2],
          name: t[0],
          nameBn: t[1],
          phone: `0171300000${idx}`,
          email: `${t[2].toLowerCase()}@${opts.slug}school.test`,
          joinDate: "2021-03-01",
          status: "ACTIVE",
        })
        .run();
      db.insert(teacherAssignments)
        .values({
          id: createId(),
          schoolId,
          teacherId: tid,
          classId: classMap["সপ্তম"],
          subjectId: subjectIds[(idx + 1) % subjectIds.length],
        })
        .run();
    });

    const accUser = createId();
    db.insert(users)
      .values({
        id: accUser,
        email: `accountant@${opts.slug}school.test`,
        mobile: "01714000000",
        passwordHash,
        name: "Tanvir Ahmed",
        nameBn: "তানভীর আহমেদ",
        role: "ACCOUNTANT",
        status: "ACTIVE",
        schoolId,
      })
      .run();
    db.insert(accountants)
      .values({
        id: createId(),
        schoolId,
        userId: accUser,
        employeeId: "A-01",
        name: "Tanvir Ahmed",
        phone: "01714000000",
        email: `accountant@${opts.slug}school.test`,
        joinDate: "2019-06-01",
        status: "ACTIVE",
      })
      .run();

    const feeTypeMonthly = createId();
    const feeTypeExam = createId();
    const feeTypeAdm = createId();
    db.insert(feeTypes)
      .values({
        id: feeTypeMonthly,
        schoolId,
        name: "Monthly Fee",
        nameBn: "মাসিক বেতন",
        frequency: "MONTHLY",
      })
      .run();
    db.insert(feeTypes)
      .values({
        id: feeTypeExam,
        schoolId,
        name: "Exam Fee",
        nameBn: "পরীক্ষার ফি",
        frequency: "ONE_TIME",
      })
      .run();
    db.insert(feeTypes)
      .values({
        id: feeTypeAdm,
        schoolId,
        name: "Admission Fee",
        nameBn: "ভর্তি ফি",
        frequency: "ONE_TIME",
      })
      .run();
    const feeStructMonthly = createId();
    db.insert(feeStructures)
      .values({
        id: feeStructMonthly,
        schoolId,
        feeTypeId: feeTypeMonthly,
        classId: classMap["ষষ্ঠ"],
        academicYearId: yearId,
        amount: 1500,
        dueDay: 10,
      })
      .run();

    const examId = createId();
    db.insert(exams)
      .values({
        id: examId,
        schoolId,
        academicYearId: yearId,
        name: "Half Yearly",
        nameBn: "অর্ধবার্ষিক পরীক্ষা",
        type: "HALF_YEARLY",
        startsOn: "2026-06-10",
        endsOn: "2026-06-20",
      })
      .run();
    const examSubIds = subjectIds.slice(0, 4).map((sid) => {
      const id = createId();
      db.insert(examSubjects)
        .values({
          id,
          schoolId,
          examId,
          subjectId: sid,
          classId: classMap["ষষ্ঠ"],
          fullMarks: 100,
          passMarks: 33,
        })
        .run();
      return id;
    });

    const studentNames = [
      ["Ayesha Rahman", "আয়েশা রহমান", "FEMALE"],
      ["Nafis Hasan", "নাফিস হাসান", "MALE"],
      ["Mim Akter", "মিম আক্তার", "FEMALE"],
      ["Rafiul Islam", "রাফিউল ইসলাম", "MALE"],
      ["Sadia Afrin", "সাদিয়া আফরিন", "FEMALE"],
      ["Hasib Khan", "হাসিব খান", "MALE"],
      ["Farzana Yesmin", "ফারজানা ইয়াসমিন", "FEMALE"],
      ["Arif Chowdhury", "আরিফ চৌধুরী", "MALE"],
    ];

    const studentIds: string[] = [];
    studentNames.forEach((s, idx) => {
      const uid = createId();
      const isPrimary = idx === 0;
      if (isPrimary) {
        db.insert(users)
          .values({
            id: uid,
            email: `student@${opts.slug}school.test`,
            mobile: `0171500000${idx}`,
            passwordHash,
            name: s[0],
            nameBn: s[1],
            role: "STUDENT",
            status: "ACTIVE",
            schoolId,
          })
          .run();
      }
      const stid = createId();
      studentIds.push(stid);
      db.insert(students)
        .values({
          id: stid,
          schoolId,
          userId: isPrimary ? uid : null,
          studentId: `2026${String(idx + 1).padStart(3, "0")}`,
          admissionNumber: `A-2026-${idx + 1}`,
          name: s[0],
          nameBn: s[1],
          gender: s[2],
          dateOfBirth: `2014-0${(idx % 9) + 1}-15`,
          classId: classMap["ষষ্ঠ"],
          sectionId: sectionMap["ষষ্ঠ-A"],
          roll: idx + 1,
          academicYearId: yearId,
          mobile: `0171500000${idx}`,
          address: `${opts.district}`,
          bloodGroup: ["A+", "B+", "O+", "AB+"][idx % 4],
          status: "ACTIVE",
        })
        .run();
      const gid = createId();
      db.insert(guardians)
        .values({
          id: gid,
          schoolId,
          name: `${s[1].split(" ")[0]} অভিভাবক`,
          relation: "Father",
          mobile: `0191500000${idx}`,
        })
        .run();
      db.insert(studentGuardians)
        .values({ id: createId(), schoolId, studentId: stid, guardianId: gid, isPrimary: true })
        .run();

      const due = idx % 3 === 0 ? 1500 : 0;
      const paid = 1500 - due;
      const sfid = createId();
      db.insert(studentFees)
        .values({
          id: sfid,
          schoolId,
          studentId: stid,
          feeStructureId: feeStructMonthly,
          title: "মাসিক বেতন — সেপ্টেম্বর ২০২৬",
          amount: 1500,
          paid,
          due,
          status: due ? "DUE" : "PAID",
          dueDate: "2026-09-10",
        })
        .run();
      if (paid > 0) {
        const payId = createId();
        db.insert(feePayments)
          .values({
            id: payId,
            schoolId,
            studentId: stid,
            studentFeeId: sfid,
            amount: paid,
            method: "CASH",
            receivedBy: accUser,
            paidAt: new Date(),
            status: "PAID",
          })
          .run();
        db.insert(receipts)
          .values({
            id: createId(),
            schoolId,
            receiptNumber: publicCode("R", 6),
            feePaymentId: payId,
            studentId: stid,
            payloadJson: JSON.stringify({ amount: paid, title: "মাসিক বেতন" }),
          })
          .run();
      }

      examSubIds.forEach((esid, i) => {
        const marks = 55 + ((idx + i) % 40);
        db.insert(results)
          .values({
            id: createId(),
            schoolId,
            examId,
            examSubjectId: esid,
            studentId: stid,
            marks,
            grade: marks >= 80 ? "A+" : marks >= 70 ? "A" : marks >= 60 ? "A-" : "B",
            enteredBy: teacherUserId,
          })
          .run();
      });
    });

    const attId = createId();
    db.insert(attendanceSessions)
      .values({
        id: attId,
        schoolId,
        classId: classMap["ষষ্ঠ"],
        sectionId: sectionMap["ষষ্ঠ-A"],
        date: "2026-09-04",
        takenBy: teacherUserId,
      })
      .run();
    studentIds.forEach((sid, i) => {
      db.insert(attendanceRecords)
        .values({
          id: createId(),
          schoolId,
          sessionId: attId,
          studentId: sid,
          status: i === 3 ? "ABSENT" : i === 5 ? "LATE" : "PRESENT",
        })
        .run();
    });

    db.insert(notices)
      .values({
        id: createId(),
        schoolId,
        title: "২০২৬ শিক্ষাবর্ষের ভর্তি চলছে",
        content: "আগামী ৩০ সেপ্টেম্বর পর্যন্ত অনলাইনে ভর্তি আবেদন গ্রহণ করা হবে। আবেদন ফি ৫০০ টাকা।",
        publishDate: "2026-09-01",
        audience: "EVERYONE",
        isPublic: true,
        createdBy: adminId,
      })
      .run();
    db.insert(notices)
      .values({
        id: createId(),
        schoolId,
        title: "অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ",
        content: "অর্ধবার্ষিক পরীক্ষা ১০ জুন থেকে শুরু হবে। বিস্তারিত রুটিন ডাউনলোড সেন্টারে পাওয়া যাবে।",
        publishDate: "2026-08-20",
        audience: "STUDENTS",
        isPublic: true,
        createdBy: adminId,
      })
      .run();

    db.insert(schoolDocuments)
      .values({
        id: createId(),
        schoolId,
        title: "ষষ্ঠ শ্রেণির সিলেবাস ২০২৬",
        category: "SYLLABUS",
        fileName: "syllabus-class-6.pdf",
        mimeType: "application/pdf",
        size: 128000,
        storageKey: "demo/syllabus-class-6.pdf",
        visibility: "PUBLIC",
        classId: classMap["ষষ্ঠ"],
        academicYearId: yearId,
      })
      .run();
    db.insert(schoolDocuments)
      .values({
        id: createId(),
        schoolId,
        title: "একাডেমিক ক্যালেন্ডার ২০২৬",
        category: "CALENDAR",
        fileName: "calendar-2026.pdf",
        mimeType: "application/pdf",
        size: 64000,
        storageKey: "demo/calendar-2026.pdf",
        visibility: "PUBLIC",
        academicYearId: yearId,
      })
      .run();

    db.insert(admissionApplications)
      .values({
        id: createId(),
        schoolId,
        applicationId: publicCode("APP", 8),
        studentName: "Nabila Tasnim",
        studentNameBn: "নাবিলা তাসনিম",
        dateOfBirth: "2014-04-12",
        gender: "FEMALE",
        guardianName: "তৌহিদুল ইসলাম",
        guardianMobile: "01719990000",
        address: opts.district,
        classId: classMap["ষষ্ঠ"],
        academicYearId: yearId,
        status: "PENDING",
      })
      .run();
    db.insert(admissionApplications)
      .values({
        id: createId(),
        schoolId,
        applicationId: publicCode("APP", 8),
        studentName: "Shakib Hasan",
        studentNameBn: "সাকিব হাসান",
        dateOfBirth: "2013-11-02",
        gender: "MALE",
        guardianMobile: "01819990000",
        classId: classMap["সপ্তম"],
        status: "APPROVED",
      })
      .run();

    db.insert(smsMessages)
      .values({
        id: createId(),
        schoolId,
        recipient: "অভিভাবক",
        mobile: "01715000000",
        message: "আগামীকাল স্কুল বন্ধ থাকবে। — বিধাপীঠ",
        characterCount: 40,
        smsCount: 1,
        status: "DELIVERED",
        sentBy: adminId,
        sentAt: new Date(),
      })
      .run();
    db.insert(smsCreditTransactions)
      .values({
        id: createId(),
        schoolId,
        type: "ALLOCATION",
        credits: opts.sms,
        balanceBefore: 0,
        balanceAfter: opts.sms,
        description: "Initial plan allocation",
        createdBy: superId,
      })
      .run();

    db.insert(paymentTransactions)
      .values({
        id: createId(),
        schoolId,
        purpose: "SUBSCRIPTION",
        amount: opts.plan === "professional" ? 34990 : 14990,
        currency: "BDT",
        provider: "demo",
        status: "PAID",
        paymentMethod: "bKash",
        paidAt: new Date(),
        transactionId: publicCode("TXN", 10),
      })
      .run();

    db.insert(auditLogs)
      .values({
        id: createId(),
        schoolId,
        userId: adminId,
        action: "SCHOOL_SEEDED",
        module: "system",
        resource: "school",
        resourceId: schoolId,
      })
      .run();

    return schoolId;
  }

  await seedSchool({
    name: "Adarsha High School",
    nameBn: "আদর্শ উচ্চ বিদ্যালয়",
    slug: "abc",
    code: "ABC-001",
    district: "ঢাকা",
    division: "ঢাকা",
    plan: "professional",
    status: "ACTIVE",
    sms: 980,
    primary: "#0F766E",
  });

  await seedSchool({
    name: "Nurani Model School",
    nameBn: "নূরানী মডেল স্কুল",
    slug: "xyz",
    code: "XYZ-002",
    district: "চট্টগ্রাম",
    division: "চট্টগ্রাম",
    plan: "basic",
    status: "TRIAL",
    sms: 180,
    primary: "#1D4ED8",
  });

  console.log("Seed complete.");
  console.log("Demo logins (password: Demo@1234):");
  console.log("  Super Admin     admin@bidhapith.test");
  console.log("  School Admin    admin@abcschool.test");
  console.log("  Teacher         teacher@abcschool.test");
  console.log("  Accountant      accountant@abcschool.test");
  console.log("  Student         student@abcschool.test");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
