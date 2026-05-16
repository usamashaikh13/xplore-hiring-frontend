# Xplore Hiring Frontend

Recruiter-facing web console for the Xplore hiring platform.

## Tech Stack

- React 19
- Vite 7
- Lucide React
- Plain CSS

## Backend Services

Run these services before using the frontend:

```text
Interviewer Service:  http://localhost:8081
Recruitment Service:  http://localhost:8082
Frontend:             http://localhost:5173
```

## Features

- Dashboard cards for candidates, jobs, applications, interviews, and offers.
- Candidate, job, interviewer, and interview-slot creation forms.
- Application creation and interview scheduling workflow.
- Feedback submission, no-show marking, and offer create/send/accept flow.
- Tables for applications, interview slots, offers, and webhook events.
- Analytics strip for offer acceptance, time-to-hire, and funnel count.

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
