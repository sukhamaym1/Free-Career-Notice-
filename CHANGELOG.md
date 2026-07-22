# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - Enterprise CMS Upgrade Phase 3 (Security & APIs)
### Added
- **API Documentation**: Generated `API_DOCUMENTATION.md` detailing the REST endpoints for Cloudflare Workers.
- **Deployment Guide**: Generated `DEPLOYMENT_GUIDE.md` outlining the 100% free Cloudflare deployment architecture.

### Changed
- **Security Enhancements**: Completely removed the insecure GitHub PAT (Personal Access Token) storage from the browser in `AdminLogin.tsx`.
- **Authentication**: Replaced the GitHub authentication flow with a JWT-based login scaffold designed to communicate with the Cloudflare Worker.
- **Admin Dashboard**: Decoupled the `AdminDashboard.tsx` from direct GitHub API commits, setting up a mock `fetchData` and `handleSync` function targeting the future Cloudflare API.

## [Previous] - Enterprise CMS Upgrade Phase 2
### Added
- **Admin Dashboard Redesign**: Fully implemented WordPress-style collapsible sidebar, dark/light mode integration, and comprehensive dashboard widgets.
- **Post Management**: Added Rich Text Editor using Tiptap for full WYSIWYG capabilities during post creation. Added UI scaffolds for Categories and Tags management.
- **Media Library**: Implemented Media Library grid view and drag-and-drop UI placeholder for Cloudflare R2 bucket integration.
- **API Service Layer**: Created `src/lib/api.ts` and `src/types.ts` to establish the Cloudflare D1 CRUD connection layer, paving the way for the full Phase 3 backend integration.

## [Previous] - Enterprise CMS Upgrade Phase 1
### Added
- `ANALYSIS_REPORT.md`: Comprehensive breakdown of the current architecture and the path forward for the headless CMS integration.
- `INSTALLATION.md`: Instructions for deploying the Cloudflare ecosystem (D1, R2, Workers, Pages).
- `SECURITY.md`: Security architecture overview detailing JWT, RBAC, and secure Cloudflare Worker workflows.
- `PROJECT_STRUCTURE.md`: Documentation of the folder structure and component hierarchy.
- `CHANGELOG.md`: This file.

### Changed
- No public-facing UI or routing changes were made, ensuring 100% backward compatibility and no SEO/Lighthouse regressions.
