# Expo E-Commerce Platform

![Expo E-Commerce Banner](./expo-ecommerce.png)

A full-stack e-commerce solution built with Expo (React Native), Next.js, and Express.js. This repository is structured as a monorepo containing three main applications: a mobile client, an admin dashboard, and a backend API.

<p align="center">
  <img src="https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <br />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Inngest-E24A8D?style=for-the-badge&logo=inngest&logoColor=white" alt="Inngest" />
</p>

## Project Structure

- `/mobile` - The consumer-facing mobile application built with Expo and React Native.
- `/admin` - The web-based admin dashboard to manage the platform built with Next.js.
- `/backend` - The RESTful backend API built with Express.js and MongoDB.

---

## Tech Stack & Libraries

### Mobile App (`/mobile`)

- **Framework**: ![Expo](https://img.shields.io/badge/Expo-1C1E24?style=flat&logo=expo&logoColor=white) Expo (~54.0.33) / ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) React Native
- **Navigation**: Expo Router & React Navigation
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) NativeWind & Tailwind CSS
- **Authentication**: ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white) Clerk Expo
- **Data Fetching**: React Query & Axios
- **Payments**: Stripe React Native
- **Monitoring**: Sentry React Native
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript

### Admin Dashboard (`/admin`)

- **Framework**: ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) Next.js (v16.1.6)
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) Tailwind CSS (v4) & DaisyUI
- **Authentication**: ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white) Clerk Next.js
- **Icons**: Lucide React
- **Data Fetching**: Axios
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript

### Backend API (`/backend`)

- **Runtime**: ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) Node.js
- **Framework**: ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) Express.js (v5.2.1)
- **Database**: ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) MongoDB via Mongoose
- **Authentication**: ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white) Clerk Express
- **Background Jobs**: ![Inngest](https://img.shields.io/badge/Inngest-E24A8D?style=flat&logo=inngest&logoColor=white) Inngest
- **Media Storage**: ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) Cloudinary & Multer
- **Security & Logging**: Helmet, CORS, Morgan, Winston
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript

### Root Utilities

- **Linting & Formatting**: ESLint, Prettier
- **Git Hooks**: Husky, Lint-staged

---

## Environment Variables

You need to set up `.env` files for each workspace. Refer to the respective READMEs in `/mobile`, `/admin`, and `/backend` for specific variable details.

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- **pnpm** (Package manager)
- MongoDB instance (local or MongoDB Atlas)
- Expo Go app on your mobile device (if testing physically)

### 1. Clone the repository

```bash
git clone <repository-url>
cd Expo-ecommerce
```

### 2. Install Dependencies

We use `pnpm` exclusively in this project. Run the installation in the root and each respective folder:

```bash
pnpm install
cd backend && pnpm install
cd ../admin && pnpm install
cd ../mobile && pnpm install
```

### 3. Start the Applications

**Backend API:**

```bash
cd backend
pnpm dev
```

**Admin Web Dashboard:**

```bash
cd admin
pnpm dev
```

**Mobile App:**

```bash
cd mobile
pnpm start
```

---

## Scripts

- `pnpm run lint`: Lints the entire project.
- `pnpm run lint:{mobile|web|server}`: Lints a specific application.
- `pnpm run format`: Automatically formats code in the project using Prettier.

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
