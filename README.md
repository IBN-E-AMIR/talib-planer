# Talib Planner

Bilingual (English / Urdu) study planner. It builds a daily timetable around the five prayer times and tracks
Dars-e-Nizami books and embedded-systems work.

**Stack:** React + TypeScript + Vite + Tailwind CSS, served by nginx in a Docker container.
**Data:** saved in the browser (localStorage). Prayer times come from the free Aladhan API (Hanafi Asr, Karachi method) and the last result is cached, so the site still works offline.

## Run in the browser without installing anything
1. Create a GitHub repository and upload all these files (drag and drop works).
2. Open it in **GitHub Codespaces** (Code button > Codespaces), then run:
   ```
   npm install
   npm run dev
   ```

## Run on a computer with Node.js 20+
```
npm install
npm run dev        # development
npm run build      # production build into dist/
```

## Run with Docker
```
docker build -t talib-planner .
docker run -p 8080:8080 talib-planner
```
Open http://localhost:8080

## Deploy (cloud-native)
**Render (easiest):** New > Blueprint (or Web Service) > pick your GitHub repo. Render finds `render.yaml` / `Dockerfile`, builds the container, and redeploys on every push.

**Google Cloud Run:** add the secrets `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_SA_KEY` in the repo settings, then run the "Deploy to Cloud Run" workflow.

`.github/workflows/ci.yml` builds the app and the Docker image on every push.

## Architecture (for your report)
- Presentation layer: React pages and components (`src/pages`, `src/components`)
- Business logic: timetable and countdown rules (`src/hooks.ts`), progress and streak calculations (`src/pages/Progress.tsx`)
- Data layer: state and localStorage (`src/store.tsx`), prayer-times API call (`src/hooks.ts`)
- Deployment: multi-stage Dockerfile (build with Node, serve with nginx), GitHub Actions CI, auto-scaling container platform

## Files
`src/i18n.tsx` holds all English and Urdu text. `src/data.ts` holds the Dars-e-Nizami subjects and book catalog (edit it to add books).
