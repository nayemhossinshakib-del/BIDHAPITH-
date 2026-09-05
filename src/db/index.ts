import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DEMO_DB = path.join(process.cwd(), "prisma", "demo.sqlite");
const LOCAL_DB = path.join(process.cwd(), "data", "bidhapith.db");

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

function ensureDatabase(target: string) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fileOk(target)) return;
  if (fileOk(DEMO_DB)) {
    fs.copyFileSync(/* turbopackIgnore: true */ DEMO_DB, target);
    return;
  }
  if (target !== LOCAL_DB && fileOk(LOCAL_DB)) {
    fs.copyFileSync(/* turbopackIgnore: true */ LOCAL_DB, target);
  }
}

const resolved = resolveDbPath();
ensureDatabase(resolved);

const sqlite = new Database(resolved);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("busy_timeout = 5000");

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema });
export { schema, sqlite };
export type DB = typeof db;
