# Architecture Principles

1. **Separation of Concerns**: Keep the Admin Panel completely isolated from the Public Website.
2. **Storage Abstraction**: The Admin UI must not know about GitHub. It must only interact with `ContentService` and `MediaService`.
3. **Static Generation (Current)**: The public site relies on build-time static generation for content.
4. **Modularity**: Break large components into smaller, reusable pieces.
