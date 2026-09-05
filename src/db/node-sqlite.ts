type StatementSync = {
  run: (...params: never[]) => { changes: number; lastInsertRowid: number | bigint };
  get: (...params: never[]) => unknown;
  all: (...params: never[]) => unknown[];
  setReturnArrays: (v: boolean) => void;
};

type DatabaseSyncCtor = new (
  filename: string,
  options?: { readOnly?: boolean },
) => {
  prepare: (sql: string) => StatementSync;
  exec: (sql: string) => void;
  close: () => void;
};

function loadDatabaseSync(): DatabaseSyncCtor {
  const getter = (process as unknown as { getBuiltinModule?: (name: string) => { DatabaseSync: DatabaseSyncCtor } }).getBuiltinModule;
  const mod = getter?.("sqlite") ?? getter?.("node:sqlite");
  if (!mod?.DatabaseSync) {
    throw new Error("Node.js built-in sqlite is unavailable. Use Node 22+.");
  }
  return mod.DatabaseSync;
}

const DatabaseSync = loadDatabaseSync();

type RunResult = { changes: number; lastInsertRowid: number | bigint };

class NodeStatement {
  constructor(private stmt: StatementSync) {}

  run(...params: unknown[]): RunResult {
    const res = this.stmt.run(...(params as never[]));
    return { changes: Number(res.changes), lastInsertRowid: res.lastInsertRowid };
  }

  get(...params: unknown[]) {
    return this.stmt.get(...(params as never[]));
  }

  all(...params: unknown[]) {
    return this.stmt.all(...(params as never[]));
  }

  raw() {
    return {
      get: (...params: unknown[]) => {
        this.stmt.setReturnArrays(true);
        try {
          return this.stmt.get(...(params as never[]));
        } finally {
          this.stmt.setReturnArrays(false);
        }
      },
      all: (...params: unknown[]) => {
        this.stmt.setReturnArrays(true);
        try {
          return this.stmt.all(...(params as never[]));
        } finally {
          this.stmt.setReturnArrays(false);
        }
      },
    };
  }
}

export class NodeSqlite {
  private db: DatabaseSync;

  constructor(filename: string, options?: { readonly?: boolean; fileMustExist?: boolean }) {
    this.db = new DatabaseSync(filename, {
      readOnly: Boolean(options?.readonly),
    });
  }

  prepare(sql: string) {
    return new NodeStatement(this.db.prepare(sql));
  }

  exec(sql: string) {
    this.db.exec(sql);
  }

  pragma(text: string) {
    this.db.exec(`PRAGMA ${text}`);
  }

  transaction<T>(fn: (...args: never[]) => T) {
    const run = (mode: string) =>
      (...args: never[]) => {
        this.db.exec(`BEGIN ${mode.toUpperCase()}`);
        try {
          const result = fn(...args);
          this.db.exec("COMMIT");
          return result;
        } catch (err) {
          try {
            this.db.exec("ROLLBACK");
          } catch {
            /* ignore */
          }
          throw err;
        }
      };
    const deferred = run("deferred");
    return Object.assign(deferred, {
      deferred: run("deferred"),
      immediate: run("immediate"),
      exclusive: run("exclusive"),
    });
  }

  close() {
    this.db.close();
  }
}

export type SqliteClient = NodeSqlite;
