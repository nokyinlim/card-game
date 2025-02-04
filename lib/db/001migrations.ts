import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
  sql,
} from 'kysely'
import { db } from './db'

 
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("User")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("emailVerified", "timestamptz")
    .addColumn("image", "text")
    .execute()
 
  await db.schema
    .createTable("Account")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .execute()
 
  await db.schema
    .createTable("Session")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute()
 
  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute()
 
  await db.schema
    .createIndex("Account_userId_index")
    .on("Account")
    .column("userId")
    .execute()
 
  await db.schema
    .createIndex("Session_userId_index")
    .on("Session")
    .column("userId")
    .execute()
}
 

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute()
  await db.schema.dropTable("Session").ifExists().execute()
  await db.schema.dropTable("User").ifExists().execute()
  await db.schema.dropTable("VerificationToken").ifExists().execute()
}

export async function executeMigration() {
    const migrator = new Migrator({
      // @ts-ignore
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, "/"),
      }),
    });
    // console.log("migrating")
    // const res = await migrator.migrateDown();
    // console.log(res);
    const { error, results } = await migrator.migrateToLatest();
    console.log(results);
  
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
      else {
        console.error(`migration "${it.migrationName}" was already executed`);
      
      }
    });
    if (error) {
      console.error("failed to migrate");
      console.error(error);
      process.exit(1);
    }
    await db.destroy();
  }
  executeMigration();  