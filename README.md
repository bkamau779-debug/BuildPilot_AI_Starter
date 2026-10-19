# BuildPilot AI — AI Website Builder

BuildPilot creates a responsive HTML website draft from a natural-language brief. The frontend calls a Netlify Function, which uses Google's Gemini API to generate the website. The API key stays on the server and must never be added to browser JavaScript or committed to Git.

## Features

- Create drafts for business, portfolio, restaurant, school, shop, agency, and event websites
- Choose a visual theme
- Generate a complete responsive HTML page with Gemini
- Preview, copy, and download generated HTML
- Server-side validation and useful error messages

## Deploy on Netlify

The repository is configured for Netlify in `netlify.toml`. The build publishes only the static website files to `dist` and deploys the AI backend from `netlify/functions/generate.mjs`.

1. Open https://app.netlify.com/ and sign in or create an account.
2. Choose **Add new project** → **Import an existing project**.
3. Connect GitHub if asked, then select `bkamau779-debug/BuildPilot_AI_Starter`.
4. Check the build settings picked up from `netlify.toml`:
   - Build command: `mkdir -p dist && cp index.html styles.css app.js dist/`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Before or after the first deploy, open **Site configuration** (or **Project configuration**) → **Environment variables**.
6. Add an environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: your private Gemini API key from https://aistudio.google.com/app/apikey
   - Scope: Functions/runtime (if Netlify shows scopes); enable it for the deploy contexts you use.
7. Save the variable and trigger a fresh deploy. Environment variable changes generally require a new deploy to take effect.
8. Open the Netlify site URL and try generating a website.

## Keep your API key private

- Never paste your API key into ChatGPT, `index.html`, `app.js`, or any committed source file.
- Add it only in Netlify's environment-variable settings.
- If the key is ever exposed, revoke it in Google AI Studio and create a replacement.
- Review generated HTML before publishing it for a real business.

## How it works

The browser sends the website brief to `/.netlify/functions/generate`. The Netlify Function reads `GEMINI_API_KEY` from the server environment and calls Google's Gemini `generateContent` API using `gemini-2.5-flash-lite`.

Check Google's current model availability, API terms, and usage limits: https://ai.google.dev/gemini-api/docs/models

## Notes

- The GitHub Pages demo at https://bkamau779-debug.github.io/BuildPilot_AI_Starter/ is static hosting and does not run the AI function. Use the Netlify URL for real AI generation.
- The previous Vercel function file remains in the repository but is not used by the Netlify configuration.
- Gemini usage may be subject to rate limits or charges depending on your Google AI account and current terms.
