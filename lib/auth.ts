import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined);

const secret = process.env.BETTER_AUTH_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

if (!baseURL) {
  throw new Error(
    "BETTER_AUTH_URL must be set to the deployed application's HTTPS origin",
  );
}

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

const connectionURL = new URL(databaseUrl);
if (
  connectionURL.hostname.endsWith(".supabase.com") ||
  connectionURL.hostname.endsWith(".supabase.co")
) {
  if (!connectionURL.searchParams.has("sslmode")) {
    connectionURL.searchParams.set("sslmode", "require");
  }
  if (connectionURL.searchParams.get("sslmode") === "require") {
    connectionURL.searchParams.set("uselibpqcompat", "true");
  }
}

const connectionString = connectionURL.toString();
const databaseGlobal = globalThis as typeof globalThis & {
  bazarAuthDatabase?: { connectionString: string; pool: Pool };
};

const database =
  databaseGlobal.bazarAuthDatabase?.connectionString === connectionString
    ? databaseGlobal.bazarAuthDatabase.pool
    : new Pool({
        connectionString,
        max: process.env.NODE_ENV === "production" ? 1 : 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      });

if (process.env.NODE_ENV !== "production") {
  databaseGlobal.bazarAuthDatabase = { connectionString, pool: database };
}

export const auth = betterAuth({
  database,
  baseURL,
  secret,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders,
  plugins: [dash()],
});
