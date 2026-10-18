# BuildPilot AI — AI Website Builder

BuildPilot creates a complete HTML website draft from a natural-language brief. The frontend calls a serverless backend, which uses Google's Gemini API to generate the website. The API key stays on the server and must never be added to browser JavaScript or committed to Git.

## Features
- Describe a business, portfolio, restaurant, school, shop showcase, agency, or event website
- Choose a visual theme
- Generate a complete responsive HTML page with a real AI model
- Preview, copy, and download generated HTML
- Server-side validation and helpful error messages

## Deploy the real AI backend

GitHub Pages only serves static files; it cannot run the `/api/generate` serverless function. Deploy this repository on Vercel to use the AI feature.

1. Create a Google Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
2. Keep the key private. Do not paste it into chat, the repository, `index.html`, or `app.js`.
3. Open Vercel and import the GitHub repository `bkamau779-debug/BuildPilot_AI_Starter`: https://vercel.com/new
4. In the Vercel project, open **Settings → Environment Variables**.
5. Add a variable named `GEMINI_API_KEY` and paste the key as its value. Enable it for Production (and Preview if desired), then save.
6. Redeploy the project so the environment variable is applied.
7. Open the Vercel deployment URL and try generating a website.

The frontend calls `/api/generate`, implemented in `api/generate.js`. The backend calls the Gemini `generateContent` API using the `gemini-2.5-flash-lite` model. Check Google's current model availability, API terms, and any free usage limits before use: https://ai.google.dev/gemini-api/docs/models

## Hosting notes
- The existing GitHub Pages workflow can still publish the static demo at `https://bkamau779-debug.github.io/BuildPilot_AI_Starter/`, but the AI endpoint will not run there.
- Use the Vercel URL for real AI generation unless you separately host the API function elsewhere.
- Do not commit secrets. If a key is exposed, revoke it and create a new one.
- AI output can contain mistakes. Review generated HTML and test it before publishing for a real business.
