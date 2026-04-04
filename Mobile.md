# Mobile App (`/mobile`)

The consumer-facing mobile application for the E-Commerce platform. Built natively for iOS and Android using Expo and React Native, granting customers an intuitive application to browse products, manage their cart, place orders, and track deliveries.

## Tech Stack & Libraries

- **Framework**: ![Expo](https://img.shields.io/badge/Expo-1C1E24?style=flat&logo=expo&logoColor=white) Expo (~54.0.33) / ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) React Native
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript
- **Navigation**: Expo Router (`expo-router/entry`) & React Navigation
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) NativeWind & Tailwind CSS
- **Authentication**: @clerk/clerk-expo
- **Data Fetching & State**: @tanstack/react-query & Axios
- **Payments Processing**: @stripe/stripe-react-native
- **Monitoring & Crash Analytics**: @sentry/react-native

## Environment Variables

Create a `.env` file in the `/mobile` directory to configure SDK credentials:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SENTRY_DSN=https://...

# URL to connect to the custom Express backend
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the Expo development server:

   ```bash
   pnpm start
   ```

   _Alternatively, run on a specific platform:_
   - `pnpm run android`: Starts exactly on an emulator or connected Android device.
   - `pnpm run ios`: Starts directly on the iOS Simulator (macOS only).

3. To view it on your physical device, download the **Expo Go** app and scan the QR code outputted in your terminal.

## Scripts

- `pnpm start`: Runs the standard `expo start` command.
- `pnpm lint`: Runs `expo lint` to verify code quality.
- `pnpm reset-project`: A local script to purge setup data if starting over.
