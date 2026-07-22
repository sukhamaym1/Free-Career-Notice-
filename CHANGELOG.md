# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - Zero-Cost GitHub CMS Architecture
### Added
- **GitHub CMS Core**: Built `src/lib/github.ts` to directly interact with the GitHub REST API from the browser.
- **Content Storage**: Migrated all hardcoded post arrays into individual JSON files under `/content/posts/*.json`.
- **Dynamic Vite Globbing**: Updated `src/data.ts` to use `import.meta.glob` to automatically discover and bundle all JSON files at build time, ensuring 100% backward compatibility for the public UI without routing changes.
- **Admin Dashboard**: Refactored `AdminDashboard.tsx` to read, write, and create files directly to the GitHub repository using the GitHub API.
- **Admin Authentication**: Updated `AdminLogin.tsx` to accept a GitHub PAT, Repository, and Branch name. Token is securely stored in `sessionStorage` (memory) and never hardcoded.
- **Documentation**: Generated `ADMIN_GUIDE.md`, `INSTALLATION.md`, and `PROJECT_STRUCTURE.md`.

### Removed
- **Cloudflare Dependencies**: Removed Cloudflare Worker, D1, R2, and JWT authentication logic as per the 100% free GitHub-only constraint.

### Changed
- No public-facing UI or routing changes were made. The public site remains fully static and SEO-friendly.
