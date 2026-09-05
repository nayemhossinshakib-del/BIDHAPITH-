import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

function resolveDbPath() {
  if (process.env.VERCEL) {
    return "/tmp/bidhapith.db";
  }
  const dbUrl = process.env.DATABASE_URL?.replace(/^file:/, "") || "./data/bidhapith.db";
  return path.isAbsolute(dbUrl) ? dbUrl : path.join(process.cwd(), dbUrl);
}

function ensureDatabase(target: string) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target) && fs.statSync(target).size > 0) return;
  const candidates = [
    path.join(process.cwd(), "prisma/demo.sqlite"),
    path.join(process.cwd(), "data/bidhapith.db"),
  ];
  for (const src of candidates) {
    if (fs.existsSync(src) && fs.statSync(src).size > 0) {
      fs.copyFileSync(src, target);
      return;
    }
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
