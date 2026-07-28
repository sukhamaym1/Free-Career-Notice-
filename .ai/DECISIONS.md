# Architecture Decision Record (ADR)

1. **Use JSON Flat-Files**: Decided to use JSON files in `/content` as the database to allow free hosting on GitHub Pages/Cloudflare Pages.
2. **Abstract Storage Layer**: Created `StorageProvider` to allow easy migration away from GitHub in the future (e.g., to Cloudflare D1/R2).
3. **Tailwind CSS v4**: Adopted for styling due to utility-first approach and performance.
