# System Rules

These are the immutable rules for maintaining and extending this project.

1. **Never bypass the Storage Layer**: The Admin Panel or any UI component MUST NOT make direct calls to the GitHub API or `src/lib/github.ts`. Always use `ContentService` or `MediaService`.
2. **Preserve backward compatibility**: Data schemas (`Post`, `Category`, `Tag`, `SiteSettings`) must be backward compatible. If adding a new field, make it optional.
3. **Do not modify the Public UI without permission**: Administrative or architecture tasks should not alter the visual design of the Public Website unless explicitly requested.
4. **Never delete user-generated content**: Ensure deletion logic has confirmation dialogues and soft-deletes where applicable, or at least double-checks before hard deletion via the Provider.
5. **Always update documentation**: Any structural change (new folder, new service, new schema field) MUST be reflected in this Documentation Framework immediately.
6. **No duplicate logic**: If a function exists (e.g., `cn` for Tailwind class merging), use it instead of recreating it.
7. **Keep Admin and Public isolated**: Admin components must live in `src/admin/`. Public components must live in `src/components/` and `src/pages/`.


## Dual-Repository Migration

This project now uses a dual-repository architecture. The Website Repository (this one) contains the source code, while all user-generated content (posts, images, settings) is stored in an external Content Repository via the configured Storage Provider in `src/config.ts`. This prevents content loss during AI Studio updates. Admin Panel communicates with the Content Service.
