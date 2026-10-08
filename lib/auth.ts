import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.NODE_ENV === "production"
  ? path.join("/tmp", "auth.db")
  : path.join(process.cwd(), "auth.db");

if (process.env.NODE_ENV === "production" && !fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

const database = new Database(dbPath);

export const auth = betterAuth({
  database,

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  secret:
    process.env.BETTER_AUTH_SECRET ||
    "change-this-to-a-long-random-secret",

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});