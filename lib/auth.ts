import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const database = new Database("auth.db");

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
      clientId:
        process.env.GOOGLE_CLIENT_ID || "",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "",
    },

    github: {
      clientId:
        process.env.GITHUB_CLIENT_ID || "",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});