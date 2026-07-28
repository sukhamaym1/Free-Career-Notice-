# Deployment Instructions

1. **Build Step**: The project is built using `npm run build` via Vite.
2. **Environment Variables**: Avoid requiring secrets at build time. The GitHub PAT is provided client-side by the admin.
3. **Hosting**: Deployable to any static host (Cloudflare Pages, Vercel, GitHub Pages) because the CMS uses a flat-file JSON structure.
