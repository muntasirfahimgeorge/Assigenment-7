# বাজার দর — BazarDor

A responsive Bangla market price web application that helps users quickly view the latest prices of essential daily products.

## Project Description

**বাজার দর (BazarDor)** displays current market prices of essential products such as rice, lentils, oil, vegetables, fish, meat, eggs, milk, and spices.

Users can:

- Browse all products
- See products whose prices increased today
- See products whose prices decreased today
- Browse products by category
- View detailed product and market information
- Sort category products by price
- Create an account and sign in
- Update profile information
- Access protected product details after authentication

## Technologies

For database and authentication configuration, follow [PostgreSQL setup](POSTGRES_SETUP.md). The assignment requirements are recorded in [requirets.md](requirets.md).

For pre-commit hooks, linting, formatting, and deployment tests, follow [Code quality and tests](QUALITY.md).

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- PostgreSQL / node-postgres (pg)
- React Hot Toast
- Lucide React
- REST API
- Vercel

## Features

### 1. Responsive Navbar

- BazarDor logo and Bangla date
- Product category navigation
- Active category highlighting
- Sign in and Sign up buttons
- Logged-in profile and sign-out options

### 2. Live Price Ticker

- Displays product names and current prices
- Shows price increase/decrease indicators
- Infinite horizontal scrolling ticker

### 3. Product Price Sections

- Today's price increases
- Today's price decreases
- Complete product list
- Responsive product cards
- Bangla number formatting

### 4. Product Details

Each product has a dedicated dynamic page containing:

- Product information
- Category
- Unit
- Today's price
- Price change
- Minimum price
- Maximum price
- Average price
- Market-wise prices

### 5. Category Pages

Products can be browsed by category:

- চাল
- ডাল
- তেল
- সবজি
- মাছ
- মাংস
- ডিম-দুধ
- মসলা

Category products can be sorted by:

- ডিফল্ট
- দাম: কম থেকে বেশি
- দাম: বেশি থেকে কম

### 6. Authentication

Authentication is implemented with Better Auth.

Supported features:

- Email/password sign up
- Email/password sign in
- Google authentication configuration
- GitHub authentication configuration
- Protected product details
- Profile page
- Profile name update
- Sign out
- Authentication success/error toast messages

### 7. Loading and Error States

- Home page loading skeleton
- Category page loading skeleton
- Authentication loading states
- Custom 404 page
- Invalid category handling
- Protected route redirect

## API

The project uses the BazarDor REST API.

Base API:

`https://api.api-store.workers.dev/api/bazardor`

Available endpoints:

- `/products`
- `/products?category=chal`
- `/products/1`
- `/categories`
- `/categories/chal`

## Project Structure

```text
bazar-dor/
├── app/
│   ├── components/
│   │   └── BazarHeader.tsx
│   ├── category/
│   │   └── [slug]/
│   ├── product/
│   │   └── [slug]/
│   ├── profile/
│   ├── signin/
│   ├── signup/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── auth-client.ts
├── public/
│   ├── bazar-hero.png
│   └── logo-icon.png
├── .env.local
├── package.json
└── README.md
```
