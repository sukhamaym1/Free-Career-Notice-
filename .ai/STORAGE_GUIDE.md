# Storage Layer Guide

The Storage Layer abstracts the underlying database/storage mechanism.

## Components
- `types.ts`: Defines `StorageProvider` interface and data types (`Post`, `Category`, etc.).
- `githubProvider.ts`: Implementation of `StorageProvider` using the GitHub API.
- `contentService.ts`: Business logic wrapper for content.
- `mediaService.ts`: Business logic wrapper for media.
- `index.ts`: Provider factory.

## Adding a New Provider
1. Create `newProvider.ts`.
2. Implement the `StorageProvider` interface.
3. Update `createStorageProvider` in `index.ts`.
