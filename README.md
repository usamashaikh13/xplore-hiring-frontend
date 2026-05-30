# Xplore Frontend

Enterprise-grade frontend application for role-based career discovery, opportunity exploration, learning, resume building, profile management, administration, analytics, and entitlement-driven experiences.

## Tech Stack

- React 19
- Vite 7
- Lucide React
- Plain CSS design system

## Experience

- Premium responsive UI with dark and light themes.
- Authentication screens for splash, welcome, login, sign up, OTP, forgot password, reset password, and account recovery.
- Role previews for Super Admin, Admin, Recruiter, Hiring Manager, and Employee/User.
- Entitlement-driven navigation and access denied states.
- Dashboard, Opportunity Explorer, Learning Hub, Resume Builder, Profile, Notifications, Admin, Analytics, Security, Component Library, Blueprint, and Settings screens.
- Built-in product blueprint covering information architecture, user journeys, navigation, folder structure, component hierarchy, responsive screens, design system, role navigation, entitlements, wireframes, and high-fidelity mockups.

## Optional Backend Services

The current enterprise UI uses production-quality mock data and does not require backend services to render. Earlier hiring workflow APIs can still run locally:

```text
Interviewer Service:  http://localhost:8081
Recruitment Service:  http://localhost:8082
Frontend:             http://localhost:5173
```

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Notes

The app currently calls local backend URLs directly:

```text
http://localhost:8081
http://localhost:8082
```

For deployment, move these URLs into environment variables and configure CORS for the deployed frontend origin.
