# CampusCare — Intelligent College Complaint Redressal & Analytics

A polished React + Vite academic demonstration for ML & Data Analytics. It combines a complaint desk, local explainable NLP triage, operational workflow, SLA monitoring, and live analytics. The default build has no backend, API key, or external model dependency.

## Run locally

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production build and preview:

```bash
npm run build
npm run preview
```

## Features

- Complaint Desk with search, sorting, category/status/priority/department filters, pagination, ticket details, assignments, internal notes, status history, and resolution remarks.
- Complaint lifecycle: Submitted, Under Review, In Progress, On Hold, Resolved, Closed; reopen resolved/closed records. Hold requires a reason and resolution requires remarks.
- Local deterministic NLP: normalization, synonym mapping, weighted category phrase similarity, evidence terms, heuristic confidence, keyword extraction, sentiment, urgency, and safety-first priority prediction. Staff can override predicted category/priority.
- Live KPI cards and Recharts visualizations: volume trend, category mix, department workload, category/status stack, priority mix, resolution time, and SLA compliance.
- Data-derived insights, activity feed, session-only demo data, and confirmed reset to seed data.
- Responsive desktop/tablet/mobile UI; Vercel-ready static SPA configuration.

## Architecture

`src/App.jsx` contains the modular page and reusable UI components, with a centralized `useReducer` state. `src/data/seed.js` creates fictional seed records. `src/services/nlp.js` implements the local classification and triage pipeline. `src/utils/analytics.js` contains derived KPI and aggregation selectors. Charts always read the same complaint collection.

Pipeline: Complaint input → text normalization/tokenization → weighted phrase features & synonym mapping → category/priority/sentiment/urgency predictions → structured complaint record → centralized state → analytics selectors → dashboard.

Logical entities: Complaint, Department, Staff/Complainant, and StatusHistory. Raw title/description remain separate from derived keywords/evidence, ML predictions, and human-confirmed category/priority/status/resolution fields.

## ML methodology & limitations

This is a lightweight deterministic NLP heuristic, not a trained transformer or large language model. It uses category phrase dictionaries, token/synonym normalization, weighted phrase matches and term evidence, score-separation confidence, lexicon sentiment/urgency, and safety-first priority rules. The confidence is not a calibrated probability; evaluate on a labeled dataset before real-world use. Priority SLA targets are illustrative only: Critical 4h, High 24h, Medium 72h, Low 168h. On-hold time continues to count toward SLA.

The app stores records in React memory. A full browser refresh intentionally restores the original seed dataset; user-entered data is not persisted. All names and records are fictional. Do not enter real sensitive student information. A production deployment would require secure authentication/authorization, a database, audit logs, data-retention controls, institution-approved SLAs, and a validated classifier.

## Vercel deployment

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`; output directory: `dist`.
4. Deploy. `vercel.json` includes SPA fallback routing. No environment variables are required.

## Scripts

- `npm run dev` — local development server
- `npm run build` — optimized production build
- `npm run preview` — serve production build locally
