import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function applyMigration(sql: string, fileName: string): Promise<boolean> {
    console.log(`\n=== Applying ${fileName} ===`);

    // Extract project ref from URL
    const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!match) {
        console.error("Could not parse Supabase URL");
        return false;
    }

    const projectRef = match[1];

    // Try multiple connection methods
    const connectionAttempts = [
        {
            name: "Transaction Mode Pooler (Port 6543)",
            string: `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
        },
        {
            name: "Session Mode Pooler (Port 5432)",
            string: `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
        },
        {
            name: "Direct Connection (Port 5432)",
            string: `postgresql://postgres:[YOUR-DB-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`
        }
    ];

    for (const attempt of connectionAttempts) {
        // Skip direct connection as we don't have the password
        if (attempt.string.includes('[YOUR-DB-PASSWORD]')) {
            console.log(`\n📍 ${attempt.name}: Requires database password (not attempting)`);
            continue;
        }

        try {
            console.log(`\n📍 Trying ${attempt.name}...`);
            const client = new pg.Client({
                connectionString: attempt.string,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000
            });

            await client.connect();
            console.log("✅ Connected!");

            console.log("Executing SQL...");
            await client.query(sql);
            console.log(`✅ Migration ${fileName} applied successfully!`);

            await client.end();
            return true;
        } catch (error: any) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }

    console.log(`\n⚠️  All automatic connection attempts failed for ${fileName}`);
    return false;
}

async function printManualInstructions() {
    console.log("\n" + "=".repeat(60));
    console.log("📋 MANUAL MIGRATION INSTRUCTIONS");
    console.log("=".repeat(60));
    console.log("\nAutomatic migration failed. Please apply manually:\n");
    console.log("1. Go to: https://supabase.com/dashboard/project/wytscoyfbsklptqdqkir/sql");
    console.log("2. Click 'New Query'");
    console.log("3. Copy and paste each SQL file below");
    console.log("4. Click 'Run'\n");

    const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
    const migrations = [
        '20260109153000_add_profile_columns.sql',
        '20260109154000_add_admin_set_password_function.sql'
    ];

    for (const migrationFile of migrations) {
        const filePath = path.join(migrationsDir, migrationFile);
        if (fs.existsSync(filePath)) {
            const sql = fs.readFileSync(filePath, 'utf8');
            console.log(`\n${"=".repeat(60)}`);
            console.log(`FILE: ${migrationFile}`);
            console.log("=".repeat(60));
            console.log(sql);
        }
    }

    console.log("\n" + "=".repeat(60));
}

async function main() {
    console.log("╔" + "=".repeat(58) + "╗");
    console.log("║  Database Migration Tool                                 ║");
    console.log("╚" + "=".repeat(58) + "╝");
    console.log(`\nProject: ${supabaseUrl}\n`);

    const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
    const migrations = [
        '20260109153000_add_profile_columns.sql',
        '20260109154000_add_admin_set_password_function.sql'
    ];

    let allSucceeded = true;

    for (const migrationFile of migrations) {
        const filePath = path.join(migrationsDir, migrationFile);
        if (fs.existsSync(filePath)) {
            const sql = fs.readFileSync(filePath, 'utf8');
            const success = await applyMigration(sql, migrationFile);
            if (!success) allSucceeded = false;
        } else {
            console.log(`⚠️  Migration file not found: ${migrationFile}`);
            allSucceeded = false;
        }
    }

    if (!allSucceeded) {
        await printManualInstructions();
    } else {
        console.log("\n✅ All migrations applied successfully!");
    }
}

main().catch(console.error);
