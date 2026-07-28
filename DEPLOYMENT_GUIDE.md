# Deployment Guide

The application is a standard Vite React SPA, and can be deployed anywhere that supports static site hosting.

## GitHub Pages / Cloudflare Pages / Vercel

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: No sensitive environment variables are required at build time, as the GitHub PAT is entered client-side by the admin.

### Static Data Compilation
The `src/data.ts` file uses `import.meta.glob` to bundle all JSON files in `content/posts/*.json` during the `npm run build` step. This means that whenever content changes in the GitHub repository, the site MUST be rebuilt to reflect those changes on the public frontend.

### Continuous Deployment
Set up a GitHub Action or connect Cloudflare Pages directly to the repository so that every commit to the main branch triggers a new build. Since the Admin Panel writes to GitHub, saving a post in the Admin Panel will automatically trigger a deployment.
