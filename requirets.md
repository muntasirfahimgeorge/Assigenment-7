# বাজার দর / BazarDor — Product Requirements

This document records the assignment PRD supplied by the project owner. The generated Next.js guidance in AGENTS.md remains applicable to implementation.

## API

- Primary: https://api.api-store.workers.dev/api/bazardor
- Alternative: https://api.abcz.workers.dev/api/bazardor
- All products: `/products`
- Filter products: `/products?category=chal`
- Single product: `/products/1`
- Categories: `/categories`
- Single category: `/categories/chal`

## Basic requirements

- Support mobile, tablet, and desktop screens.
- Make at least eight Git commits with clear, meaningful messages.
- Deploy the application and ensure it runs without errors.
- Include a README with project name, description, technologies, and at least five features.

## Main requirements — 50 marks

### Navbar

- Match the supplied Figma design.
- Place the cart logo and বাজার দর on the left, with a Bangla date underneath.
- Show category navigation in a second row and highlight the active category.
- Show সাইন ইন and সাইন আপ on the right; show profile and sign-out controls when logged in.
- Include an infinitely scrolling price ticker below the navbar with emoji, name, price per unit, and percentage change.

### Hero / banner

- Include eyebrow text, heading, subtitle, primary CTA, and a hero image on the right.
- The CTA must scroll to the সব পণ্য section on the same page through an anchor link, without changing routes.

### Home product sections

- আজ দাম বেড়েছে: show the top six price risers.
- আজ দাম কমেছে: show the top six price fallers.
- সব পণ্য: include a subtitle and display all API/JSON products.
- Use a responsive grid with three to four columns on large screens and fewer columns on mobile.
- Each card must show an emoji or illustration, Bangla product name, unit, আজকের দাম label, price in Bengali digits, and percentage change badge.
- The written PRD specifies green for up, red for down, and gray for flat; compare against Figma before resolving any design conflict.
- Clicking a card opens `/product/[slug]`.

### Product details — protected route

- Require login before displaying product details.
- Show emoji, title, description or market summary, category tags, and unit.
- Show minimum, maximum, and average prices.
- Show market-wise prices for all available bazaars, following Figma or a suitable custom design.

### Category page

- Show category title and icon.
- Include a sort control: ডিফল্ট, দাম: কম থেকে বেশি, দাম: বেশি থেকে কম.
- Show skeletons while fetching products.
- Use the same product card design as Home.
- Show a friendly 404-style empty state for invalid categories or categories with no products, with হোম পেজে ফিরে যান linking to `/`.

### Authentication — `/signin` and `/signup`

- Use Better Auth with email/password, Google, and GitHub.
- Sign-in form: title, email, password, login button, registration link, and social login buttons.
- Successful sign-in and social authentication navigate to Home; failures display a toast or form error.
- Sign-up form: title, name, email, password, register button, login link, and social login buttons.
- Successful email/password registration navigates to sign-in; successful social authentication navigates to Home.
- Show relevant success/error notifications for login, signup, logout, and validation.
- Include appropriate loading states and skeletons.
- Do not implement email verification or forgotten-password flows for assignment submission.

### Footer

- Match Figma.
- Left: বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে.
- Right: সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়.

### Responsive design

- Keep navigation, ticker, auth controls, hero, grids, and buttons usable on mobile, tablet, and desktop.
- Stack the hero appropriately and constrain page content to a centered container.

## Route and runtime requirements

- Provide a friendly 404 page for unknown routes and invalid product/category slugs, with a Home CTA.
- Show skeleton loading animations while Home and Category data is fetched.
- Use react-hot-toast or an equivalent for authentication and protected-route redirect notifications.
- Dynamic routes must work on direct navigation and refresh after deployment.
- With Next.js Cache Components enabled, put request-bound authentication and uncached data reads behind a meaningful Suspense fallback. Keep useful static page content outside that boundary.
- Never cache a user's session in a shared public cache or bypass authentication to hide database errors.
- PostgreSQL authentication requires a real DATABASE_URL, valid database credentials, and the Better Auth schema. Placeholder credentials are not a working configuration.

## Challenge requirements — 10 marks

### C1: Sorting

- Default to ডিফল্ট and include a chevron indicator.
- Sort by numeric price, not the displayed Bengali digit string.

### C2: README

- Include বাজার দর / BazarDor, short description, technologies, and five key features.

### C3: Update information

- My Profile must include an update button that navigates to a separate update route.
- That route must contain a Name input and an Update Information button.
- Use Better Auth's `authClient.updateUser({ name })` API.
- Reference: https://better-auth.com/docs/concepts/users-accounts#update-user

## Required technologies and deployment

- Next.js with App Router.
- Tailwind CSS and any suitable component library, such as DaisyUI or Hero UI.
- TypeScript or JavaScript.
- Better Auth.
- Deploy to Vercel, Netlify, Cloudflare, or another suitable hosting platform before submission.

## Acceptance evidence

- Verify the application in a real browser at mobile, tablet, and desktop sizes.
- Verify email/password signup, login, logout, social login, protected redirects, and profile updates against a configured database.
- Reload dynamic routes and check the visible shell, loading fallback, resolved content, and Next.js runtime diagnostics.
- Exact Figma matching requires the project's Figma reference.
