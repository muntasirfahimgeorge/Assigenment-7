# BazarDor PostgreSQL setup

Authentication needs PostgreSQL credentials and the Better Auth schema. Suspense does not fix a rejected database password.

## Hosted database (local development and deployment)

1. Create a PostgreSQL project with your preferred provider, such as Neon.
2. Copy its connection string from the provider's dashboard. For serverless hosting, use the provider's pooled connection string when supported. Preserve its SSL parameters.
3. Replace only `DATABASE_URL` in `.env.local` with that connection string. Keep passwords out of Git and chat.
4. Set `BETTER_AUTH_URL=http://localhost:3000` for development and set a random `BETTER_AUTH_SECRET` of at least 32 characters.
5. Run `npm run db:check`, then `npm run db:migrate` to initialize the Better Auth tables.
6. Restart development if necessary and test signup, login, and a protected product page.
7. For deployment, configure the same database URL and secret in the hosting environment and change `BETTER_AUTH_URL` to the application's public HTTPS origin.

Neon connection instructions: https://neon.com/docs/get-started/connect-neon

## Supabase deployment for this project

Supabase hosts the PostgreSQL database; Better Auth runs in the Next.js server. Google and GitHub credentials belong in the app's environment variables.

- Local development: copy the Session pooler URL from Supabase Connect (port 5432).
- Vercel runtime: copy the Transaction pooler URL from Supabase Connect (port 6543). The pg adapter uses unnamed queries, so no prepared-statement names are configured.
- A persistent Botkeep Node.js server can use the Session pooler URL. Set its assigned port in the startup command: `npm run start -- --hostname 0.0.0.0 --port "$SERVER_PORT"`. Build with `npm ci` and `npm run build` first.
- Set the seven authentication variables from `.env.example` in the hosting dashboard, plus `BETTER_AUTH_API_KEY` to connect the dashboard plugin. Set `BETTER_AUTH_URL` to the exact public HTTPS origin, without a path. A fixed domain is required for OAuth callbacks; Vercel preview URLs are not automatically authorized.
- Register `https://YOUR_DOMAIN/api/auth/callback/google` with Google and `https://YOUR_DOMAIN/api/auth/callback/github` with GitHub. Preserve the localhost callbacks for development when the provider supports multiple URLs; otherwise use separate development and production OAuth apps.
- If Google's OAuth app is in Testing, only allowed test users can sign in. Configure its audience for examiner access before submission.
- Redeploy after changing hosting environment variables. Local `.env.local` changes do not update the hosting dashboard.
- Use Node.js 24 for the supplied TypeScript-importing database setup scripts.
- Turn off Supabase's unused Data API so Better Auth tables are not exposed through REST/GraphQL endpoints.

The Supabase pooler connection defaults to encrypted TLS in this app. This default uses PostgreSQL's `require` semantics, which encrypt traffic without checking the certificate identity. For certificate verification, download your database CA certificate from Supabase Database Settings and supply `sslmode=verify-full` plus `sslrootcert` pointing to that certificate in your deployment. Do not put the database password or OAuth secrets in public environment variables.

References: https://supabase.com/docs/guides/database/connecting-to-postgres and https://supabase.com/docs/guides/platform/ssl-enforcement

## Existing local PostgreSQL

PostgreSQL 16 was detected running on this machine. Open pgAdmin and connect with the administrator credentials chosen when PostgreSQL was installed.

1. Create a dedicated login role named `bazardor_app` with a new password. Do not grant superuser privileges.
2. Create a database named `bazardor`, owned by `bazardor_app`.
3. Set `.env.local` to `DATABASE_URL=postgresql://bazardor_app:YOUR_URL_ENCODED_PASSWORD@localhost:5432/bazardor`.
4. Follow steps 4–6 above. A deployed application cannot use this machine's `localhost` database; use a hosted database for deployment.

## Commands

- `npm run db:check` tests the configured connection without changing the schema.
- `npm run db:migrate` uses the installed Better Auth migration API to create missing tables, fields, and indexes. It refuses unsafe schema changes. Review and back up existing production data before migrations.

Migration reference: https://better-auth.com/docs/concepts/database

## Social authentication

Google and GitHub require their own OAuth applications. Set the corresponding client IDs and secrets in `.env.local` and the hosting environment. Register `/api/auth/callback/google` and `/api/auth/callback/github` on the application's origin as the callback URLs.

`.env.example` lists the configuration keys. It contains examples only, not working credentials.

## Better Auth dashboard plugin

The app includes `@better-auth/infra` and registers `dash()` in `lib/auth.ts`. To install the dependency in another checkout, run `npm i @better-auth/infra` (or `npm ci` to restore the locked dependencies).

1. Sign in to https://dash.better-auth.com and create a project.
2. Copy the project's infrastructure API key into `.env.local` as `BETTER_AUTH_API_KEY`.
3. Add the same key in Vercel Project Settings → Environment Variables for Production, using the Secret type.
4. Restart the local dev server after updating its environment and redeploy Vercel after updating production settings. Follow the dashboard's connection instructions for your app URL.

`dash()` reads `BETTER_AUTH_API_KEY` automatically. This key connects the infrastructure dashboard; keep the existing `BETTER_AUTH_SECRET` for signing app sessions. Never prefix the dashboard key with `NEXT_PUBLIC_`.

Reference: https://better-auth.com/docs/infrastructure/getting-started
