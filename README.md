# BuildPilot AI — Website Builder Prototype

A responsive website-builder prototype. Users can describe a business website, choose a type and visual theme, preview a generated draft, and copy or download the HTML.

## Current capabilities
- Responsive builder interface
- Business, portfolio, agency, restaurant, shop, school, and event templates
- Midnight, light, and earthy themes
- Isolated HTML preview
- Copy/download generated HTML

## Important limitation
This version uses local templates and is **not connected to a live AI model** yet. The next milestone is a secure backend that calls an AI model to generate and iteratively edit real projects.

## Publish with GitHub Pages
This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml` that deploys the site whenever `main` is updated.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions** (not “Deploy from a branch”).
3. Open the **Actions** tab and check the latest **Publish BuildPilot AI to GitHub Pages** run.
4. When it succeeds, the site should be available at `https://bkamau779-debug.github.io/BuildPilot_AI_Starter/`.

If GitHub Pages is not enabled for the repository, enable it in Settings → Pages first. A deployment can take a few minutes to appear.

## Security for the future AI connection
Never put an AI API key in HTML, browser JavaScript, a public repository, or an Android app. Use a backend/serverless function and secret environment variables. Check current AI provider pricing and free quotas before enabling live requests.
