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
1. Open repository Settings → Pages.
2. Under Build and deployment, select Deploy from a branch.
3. Select the `main` branch and `/(root)`, then save.
4. Wait for GitHub Pages to publish and open the URL shown in Settings → Pages.

## Security for the future AI connection
Never put an AI API key in HTML, browser JavaScript, a public repository, or an Android app. Use a backend/serverless function and secret environment variables. Check current AI provider pricing and free quotas before enabling live requests.
