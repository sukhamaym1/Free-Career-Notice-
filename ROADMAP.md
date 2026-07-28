# Roadmap

## Completed
- [x] Initial React + Vite setup.
- [x] Public UI with Tailwind CSS and Framer Motion.
- [x] Basic Admin Panel with GitHub integration.
- [x] Storage Layer abstraction (Decoupled Admin Panel from GitHub).
- [x] Comprehensive Documentation Framework.

## In Progress
- [ ] Stabilizing the Rich Text Editor extensions.
- [ ] Improving local filesystem sync during development.

## Planned
- [ ] **Cloudflare Storage Provider**: Implement a Cloudflare D1 (Database) and R2 (Media) provider.
- [ ] **JWT Authentication**: Replace GitHub PAT auth with standard email/password or OAuth when using Cloudflare backend.
- [ ] **Dynamic Server-Side Rendering (SSR)**: Migrate away from static JSON bundling if the dataset becomes too large, potentially using Cloudflare Pages Functions.
- [ ] **Pagination**: Add pagination to the public posts lists.
