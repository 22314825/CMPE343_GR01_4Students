import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sql from '../src/services/neonClient.js';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const migrationFile = path.join(__dirname, '001_init.sql');

  try {
    console.log(`Running migration: ${migrationFile}`);

    const rawSQL = fs.readFileSync(migrationFile, 'utf8');

    // Split by semicolon and trim each statement
    const statements = rawSQL
      .split(/;\s*$/m)      // split on semicolons at line end
      .join(";;")           // ensure we don’t break function bodies (if any)
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements.`);

    for (const stmt of statements) {
      console.log("Executing:", stmt.substring(0, 60) + "...");
      await sql.query(stmt);
    }

    console.log("✅ Migration applied successfully.");
  } catch (error) {
    console.error("❌ Migration FAILED:", error);
    process.exit(1);
  }
}

runMigration();
