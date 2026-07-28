# TODO

## High PriorityPriority
- [ ] Verify error boundaries around the new `ContentService` calls in `AdminDashboard.tsx`.
- [ ] Add loading skeletons or spinners while `fetchData` is running in the Admin Dashboard.

## Medium Priority
- [ ] Implement pagination in `StorageProvider.getPosts()` (currently fetches all posts at once).
- [ ] Add image compression before uploading to `mediaService`.

## Low Priority / Technical Debt
- [ ] Clean up `temp_editor.txt` if it is no longer used.
- [ ] Migrate `data.ts` to fetch from the Storage Provider instead of relying on `import.meta.glob` if dynamic data fetching is desired in production.
