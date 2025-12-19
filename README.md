# EV Charge - Electric Vehicle Charging App

A React-based EV charging application with login flow, user profile management, and charge point discovery.

## Features

- Phone/Email login with OTP verification
- Indian mobile number validation (10 digits starting with 6-9)
- User profile setup with vehicle selection
- Charge point discovery with list and map views
- Dark/Light theme toggle
- Logout confirmation
- Persistent user sessions with localStorage

## Tech Stack

- React 19
- React Router v6
- Tailwind CSS v3
- Vite
- Vitest + React Testing Library

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm

## Installation

```bash
# Navigate to project
cd project-name

# Install dependencies
npm install
```

## Running the App

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (no watch mode)
npm test -- --run

# Run tests with coverage
npm run coverage
```

## Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Test Credentials

- **Phone**: Any valid Indian mobile number (e.g., 9876543210)
- **OTP**: Any 4-digit code except `0000` (which simulates invalid OTP)
- **Email**: Any valid email format

## Available Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm test`         | Run tests in watch mode  |
| `npm run coverage` | Run tests with coverage  |
