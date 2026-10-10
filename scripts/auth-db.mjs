import nextEnv from "@next/env";
import { getMigrations } from "better-auth/db/migration";

nextEnv.loadEnvConfig(process.cwd());

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Set DATABASE_URL in .env.local before setting up authentication.",
    );
  }
  const url = new URL(connectionString);
  if (["username", "your_username"].includes(url.username)) {
    throw new Error(
      "DATABASE_URL still contains a placeholder username. Replace it with your database connection string.",
    );
  }

  const { auth } = await import("../lib/auth.ts");
  const pool = auth.options.database;
  try {
    const connection = await pool.connect();
    try {
      await connection.query("SELECT 1");
      console.log("PostgreSQL connection successful.");
      console.log(
        `Database TLS encryption: ${connection.connection.stream.encrypted ? "enabled" : "disabled"}.`,
      );
    } finally {
      connection.release();
    }
    if (process.argv.includes("--migrate")) {
      const migration = await getMigrations(auth.options);
      if (migration.schemaProblems.length || migration.unsafeChanges.length) {
        throw new Error(
          "The existing schema needs manual review before migration.",
        );
      }
      await migration.runMigrations();
      console.log("Better Auth schema is ready.");
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  if (error.code === "28P01") {
    console.error(
      "PostgreSQL rejected the credentials. Check DATABASE_URL in .env.local.",
    );
  } else if (error.code === "ECONNREFUSED") {
    console.error(
      "PostgreSQL is unreachable. Check that the server is running and DATABASE_URL has the correct host and port.",
    );
  } else {
    console.error(
      error.code ? `Database setup failed (${error.code}).` : error.message,
    );
  }
  process.exitCode = 1;
});
