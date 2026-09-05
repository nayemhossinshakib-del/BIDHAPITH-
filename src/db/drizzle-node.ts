import { NoopCache } from "drizzle-orm/cache/core";
import { NoopLogger } from "drizzle-orm/logger";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
} from "drizzle-orm/relations";
import { fillPlaceholders, sql } from "drizzle-orm";
import { mapResultRow } from "drizzle-orm/utils";
import {
  BaseSQLiteDatabase,
  SQLitePreparedQuery,
  SQLiteSession,
  SQLiteSyncDialect,
  SQLiteTransaction,
} from "drizzle-orm/sqlite-core";
import type { SqliteClient } from "./node-sqlite";

class NodeSqlitePreparedQuery extends SQLitePreparedQuery<any> {
  constructor(
    private stmt: ReturnType<SqliteClient["prepare"]>,
    query: any,
    private logger: { logQuery: (q: string, p: unknown[]) => void },
    cache: any,
    queryMetadata: any,
    cacheConfig: any,
    private fields: any,
    executeMethod: any,
    private _isResponseInArrayMode: boolean,
    private customResultMapper?: (rows: unknown[][]) => unknown,
  ) {
    super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
  }

  run(placeholderValues?: Record<string, unknown>) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.run(...params);
  }

  all(placeholderValues?: Record<string, unknown>) {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.all(...params);
    }
    const rows = this.values(placeholderValues) as unknown[][];
    if (customResultMapper) return customResultMapper(rows);
    return rows.map((row) => mapResultRow(fields, row, (this as any).joinsNotNullableMap));
  }

  get(placeholderValues?: Record<string, unknown>) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) return stmt.get(...params);
    const row = stmt.raw().get(...params) as unknown[] | undefined;
    if (!row) return undefined;
    if (customResultMapper) return customResultMapper([row]);
    return mapResultRow(fields, row, (this as any).joinsNotNullableMap);
  }

  values(placeholderValues?: Record<string, unknown>) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.raw().all(...params);
  }

  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}

class NodeSqliteSession extends SQLiteSession<"sync", { changes: number; lastInsertRowid: number | bigint }, any, any> {
  private logger = new NoopLogger();
  private cache = new NoopCache();

  constructor(
    private client: SqliteClient,
    dialect: SQLiteSyncDialect,
    private schema: any,
  ) {
    super(dialect);
  }

  prepareQuery(query: any, fields: any, executeMethod: any, isResponseInArrayMode: boolean, customResultMapper?: any, queryMetadata?: any, cacheConfig?: any) {
    const stmt = this.client.prepare(query.sql);
    return new NodeSqlitePreparedQuery(
      stmt,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper,
    );
  }

  transaction(transaction: (tx: any) => unknown, config: { behavior?: "deferred" | "immediate" | "exclusive" } = {}) {
    const tx = new NodeSqliteTx("sync", this.dialect as SQLiteSyncDialect, this, this.schema);
    const nativeTx = this.client.transaction(transaction as (...args: never[]) => unknown);
    return nativeTx[config.behavior ?? "deferred"](tx as never);
  }
}

class NodeSqliteTx extends SQLiteTransaction<"sync", { changes: number; lastInsertRowid: number | bigint }, any, any> {
  transaction(transaction: (tx: any) => unknown) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new NodeSqliteTx("sync", this.dialect as SQLiteSyncDialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}

export function drizzleNode(client: SqliteClient, config: { schema: Record<string, unknown> }) {
  const dialect = new SQLiteSyncDialect({});
  const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
  const schema = {
    fullSchema: config.schema,
    schema: tablesConfig.tables,
    tableNamesMap: tablesConfig.tableNamesMap,
  };
  const session = new NodeSqliteSession(client, dialect, schema);
  return new BaseSQLiteDatabase("sync", dialect, session, schema) as any;
}
