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
