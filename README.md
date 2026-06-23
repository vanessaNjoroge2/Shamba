# Shamba Platform Screens Refactored

This repository contains the refactored frontend React + Vite codebase for the Shamba agricultural platform, designed in Figma.

## 📁 Folder Structure

The project has been reorganized into a modular, scalable architecture following production standards:

```text
src/
├── assets/                  # Static assets (images, logos, etc.)
├── components/
│   ├── ui/                  # Reusable low-level primitives (Button, EyebrowPill, NumberedCard, InfoCallout, Modal)
│   ├── layout/              # Site layout containers (AppShell)
│   └── shared/              # Reusable shared features (StepBar, LogoutButton)
├── features/
│   ├── landing/             # Visit Website (Step 1 marketing landing screen)
│   ├── auth/                # Login and OTP verification logic & forms
│   ├── onboarding/          # Enter Farm Info (Step 2 inputs & adaptiveness)
│   ├── analysis/            # AI Analysis loading states & animations (Step 3)
│   ├── dashboard/           # View Dashboard AI farm reports (Step 4)
│   └── progress/            # Track Progress historical trends and empty states (Step 5)
├── hooks/                   # Custom hooks (useAuth, useStep)
├── lib/                     # Global constants and helpers
├── pages/                   # Route page wrappers mounting the respective features
├── routes/                  # React Router configuration & Protected Route wrapper
├── store/                   # React Context global state store (AppContext)
├── styles/                  # CSS files, design tokens (tokens.css), Tailwind classes
└── types/                   # TypeScript type declarations and interfaces
```

All subfolders utilize barrel `index.ts` files to simplify import paths.

---

## 🎨 Design Tokens

Extracts and maps Figma values under `src/styles/tokens.css` into global CSS variables:
* **Primary dark green**: `#1A3C2E`
* **Active green**: `#2D6A4F`
* **Muted/inactive green**: `#D8EBD8`
* **Typography**: *Playfair Display* for headers and *DM Sans* for body text.
* **Component variables**: Borders, radii (`4px` for steps), spacing.

---

## 🔒 Authentication Flow (Frontend Mocked)

1. **Login page**: Input a phone number AND email address. Submitting will simulate generating a 6-digit OTP code, trigger a toast notification (using `sonner`), and direct you to `/otp`.
2. **OTP Verification**: Enter the 6-digit code.
   - Successful match: Marks `isAuthenticated: true` in localStorage and navigates you to `/onboarding`.
   - Invalid code: Inline error states block access.
   - Cooldown resend: Includes a 60-second timer restriction.
3. **Route Guard**: Post-login views are wrapped with `<ProtectedRoute />`. Unauthorized visits redirect back to `/login`.

---

## 🚀 Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.