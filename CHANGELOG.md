# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- **Storage Layer Abstraction**: Implemented `ContentService` and `MediaService` in `src/lib/storage/` to decouple the Admin Panel from direct GitHub API calls.
- **GitHub Provider**: Moved raw GitHub logic into `githubProvider.ts` implementing the `StorageProvider` interface.
- **Documentation Framework**: Created comprehensive documentation including architecture, API docs, schemas, and AI development rules.

### Changed
- Refactored `AdminDashboard.tsx` to use `contentService` and `mediaService` instead of directly instantiating `GitHubClient`.
- Refactored `WebsiteSettings.tsx` to use `contentService.saveSettings`.
- Cleaned up media upload and rename handlers to use the media service properly.


## Dual-Repository Migration

This project now uses a dual-repository architecture. The Website Repository (this one) contains the source code, while all user-generated content (posts, images, settings) is stored in an external Content Repository via the configured Storage Provider in `src/config.ts`. This prevents content loss during AI Studio updates. Admin Panel communicates with the Content Service.
