# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Local Filesystem Mirroring**: Implemented Express backend API routes (`/api/fs/write` and `/api/fs/delete`) in `server.ts` to sync GitHub CMS updates with the local container filesystem. This prevents newly created posts and uploaded images from disappearing locally when the development server reloads or before the GitHub push propagates.
- **Featured Image Support**: Enhanced `CategoryPage.tsx` and `PostPage.tsx` to dynamically display the `featuredImage` from the post JSON instead of a colored gradient, if one is provided via the admin panel.

### Changed
- **Post Details Redesign**: Re-engineered the layout in `PostPage.tsx` to present a more professional reading experience, utilizing a full-bleed hero section for the featured image and an elegant content and sidebar configuration.
- **Architectural Update**: Migrated the application from a client-side only Single Page App (SPA) to a Full-Stack application (Express + Vite) to support local synchronization API routes. Updated `package.json` build scripts accordingly.

## [Previous Updates] - Zero-Cost GitHub CMS Architecture
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
