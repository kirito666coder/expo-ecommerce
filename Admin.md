# Admin Web Dashboard (`/admin`)

The internal web-based dashboard for managing the E-Commerce platform. Features tools for tracking products, managing orders, viewing customers, and analyzing business statistics.

## Tech Stack & Libraries

- **Framework**: ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) Next.js (v16.1.6)
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) Tailwind CSS (v4) & DaisyUI
- **Icons**: Lucide React
- **Authentication**: @clerk/nextjs
- **HTTP Client**: Axios

## Environment Variables

Create a `.env.local` file in the `/admin` directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URL to connect to the custom Express backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `pnpm dev`: Starts the Next.js development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code issues.
