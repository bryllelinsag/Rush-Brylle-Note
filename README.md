# Notefolio

Responsive Next.js note application for Exercise 3. Uses React useState and useEffect, TypeScript, CSS, and a separate NoteItem component.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run typecheck
```

The build produces a static website in `out/`. To preview it, use `npx serve out`. This project uses static export, so `next start` is not used.

## Features

- Add notes with required title and description.
- View every created note, with full multiline text.
- Edit existing notes and choose a card color.
- Delete with a confirmation dialog; cancel keeps the note.
- `useEffect` checks for duplicate titles as you type. Matching ignores case, leading/trailing spaces, and repeated whitespace. Editing a note excludes its own ID.
- Submit handler also checks duplicates to prevent a timing race.
- `useEffect` loads and saves notes in localStorage; notes persist on reload on this browser/device.
- Separate `components/NoteItem.tsx` component.
- Responsive mobile, tablet, and desktop layouts.
- Keyboard-accessible native dialogs, focus handling, labeled controls, and status feedback.

No backend/account required. Data is local to this browser and device, not synced between devices. Font loading falls back to system fonts if Google Fonts is unavailable.

## Files

- `app/page.tsx`: state, effects, validation, CRUD, dialogs.
- `components/NoteItem.tsx`: reusable note card and Note type.
- `app/globals.css`: styling and responsive breakpoints.
- `app/layout.tsx`: root layout and metadata.
- `app/icon.svg`: application icon.

## Public GitHub submission

Create an empty PUBLIC GitHub repository named `notefolio`. In this extracted project folder run:

```bash
git init
git add .
git commit -m "Build responsive Next.js note application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/notefolio.git
git push -u origin main
```

Replace YOUR_USERNAME with your GitHub username. Submit the public repository URL. node_modules, build output, and private environment files are excluded by .gitignore.

## Screen recording checklist

1. Show desktop UI and create a note with title and description.
2. Create a second note; show all notes.
3. Try an existing title with different capitalization; show duplicate warning.
4. Edit a note and save changes.
5. Refresh; show notes remain saved.
6. Open delete dialog, cancel, then confirm deletion.
7. Switch to mobile viewport and create a note.

Include your own narration if your instructor requires it. Screen recording and GitHub publication must be completed from your own device/account.

## Rubric note

Listed criteria total 90 (30 + 40 + 20), while assignment says 100. Bonus points are not assigned an explicit value in the provided prompt.
