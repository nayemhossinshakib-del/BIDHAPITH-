import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DEMO_DB = path.join(/* turbopackIgnore: true */ process.cwd(), "prisma", "demo.sqlite");
const LOCAL_DB = path.join(/* turbopackIgnore: true */ process.cwd(), "data", "bidhapith.db");

function resolveDbPath() {
  if (process.env.VERCEL) return "/tmp/bidhapith.db";
  return LOCAL_DB;
}

function fileOk(p: string) {
  try {
    return (
      fs.existsSync(/* turbopackIgnore: true */ p) &&
      fs.statSync(/* turbopackIgnore: true */ p).size > 0
    );
  } catch {
    return false;
  }
}

function demoCandidates() {
  return [
    DEMO_DB,
    path.join(/* turbopackIgnore: true */ process.cwd(), "prisma", "demo.sqlite"),
    path.join(/* turbopackIgnore: true */ process.cwd(), "src", "db", "demo.sqlite"),
    "/var/task/prisma/demo.sqlite",
  ];
}

function findDemoDb() {
  for (const src of demoCandidates()) {
    if (fileOk(src)) return src;
  }
  return null;
}

function hasUsersTable(file: string) {
  if (!fileOk(file)) return false;
  let probe: Database.Database | null = null;
  try {
    probe = new Database(file, { readonly: true, fileMustExist: true });
    const row = probe.prepare("select name from sqlite_master where type='table' and name='users'").get();
    return Boolean(row);
  } catch {
    return false;
  } finally {
    try {
      probe?.close();
    } catch {
      /* ignore */
    }
  }
}

function ensureDatabase(target: string) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (hasUsersTable(target)) return;

  const demo = findDemoDb();
  if (!demo) {
    throw new Error(
      `Bidhapith demo database missing. Looked for prisma/demo.sqlite (cwd=${process.cwd()}).`,
    );
  }
  fs.copyFileSync(/* turbopackIgnore: true */ demo, target);
  if (!hasUsersTable(target)) {
    throw new Error("Copied demo database but users table is missing.");
  }
}

const resolved = resolveDbPath();
ensureDatabase(resolved);

const sqlite = new Database(resolved);
sqlite.pragma(process.env.VERCEL ? "journal_mode = DELETE" : "journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("busy_timeout = 5000");

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema });
export { schema, sqlite };
export type DB = typeof db;
export const dbPath = resolved;
