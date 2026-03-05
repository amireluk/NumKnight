# NumKnight — Dev Notes for Claude

## ⚠️ Always bump the version after making changes
The version is in `package.json` (field: `"version"`).
Increment the **patch** digit (third number) after every session that changes code.
Example: 1.1.4 → 1.1.5

`npm run build` bumps it automatically, but if the user is only running `npm run dev`
(no build), update `package.json` manually before ending the session.

## Config file
All level tuning lives in one place:
`src/game/campaign.config.js`
Flip `const DEBUG = true/false` at the top to switch between test and production values.
