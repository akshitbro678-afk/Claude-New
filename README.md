# Claude Study Lab

A student-built learning companion that explores a simple idea: AI should help students **understand**, not merely produce answers.

## What it does

- Explains difficult concepts in plain language
- Guides students with Socratic questions
- Helps students inspect their own mistakes
- Generates self-check quizzes and practice challenges
- Uses a "teach it back" reflection step
- Tracks lightweight study streaks locally in the browser

## Current demo

This version runs fully client-side with simulated responses, so it can be deployed without an API key.

It is an independent student project and is **not affiliated with or endorsed by Anthropic**.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are emitted to `dist/`.

## Next step

The response layer is intentionally isolated in `src/lib/mockEngine.ts`, making it straightforward to replace the simulated response engine with a secure server-side Claude API integration later.
