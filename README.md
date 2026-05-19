# ER Triage Game

ER Triage Game is a browser-based mock triage decision game built around short fictional patient cases.

## Problem / Use Case

This repo is a playable prototype for practicing fast pattern recognition in a deliberately simplified ER triage scenario. The player chooses between `Send Home with Meds`, `Urgent Care`, `Emergency Room`, and `ICU` while the game tracks outcomes and cost impact.

The cases are fictional and the tone is parody. This is not medical advice, clinical training, or a triage tool.

## Key Features

- Fictional patient cases with complaint, symptoms, and lab cues
- Timed triage decisions
- Four care-level choices with acceptable and ideal answers
- Feedback after each decision, including cost impact
- Lives-saved and money-wasted scoring
- Game-over and replay flow
- Cartoon-style patient avatars built in the UI

## Tech Stack

- Static HTML
- React 18 loaded from a CDN
- ReactDOM loaded from a CDN
- Babel Standalone loaded from a CDN for in-browser JSX
- Tailwind CSS loaded from a CDN
- `App.jsx` component source is also present in the repo

There is no npm package, build step, backend, or database in the current repo.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with a simple static server:

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000`.

Because the page loads React, Babel, and Tailwind from CDNs, it needs network access unless those assets are already cached by the browser.

## Current Status

This is a standalone MVP. Case data and scoring are hard-coded, there are no automated tests, and the repo does not include a production build pipeline.
