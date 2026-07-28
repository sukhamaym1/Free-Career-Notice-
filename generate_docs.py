import os
import re
from datetime import datetime

# Common project metadata
PROJECT_NAME = "Free Career Notice"
DATE = datetime.now().strftime("%Y-%m-%d")

# 1. README.md
readme_content = f"""# {PROJECT_NAME}

A modern, responsive, and beautifully animated web application for tracking the latest government jobs, admit cards, and exam results, with a fully integrated headless CMS and Admin Panel.

## ✨ Features
- **Public Website**: Fast, SEO-optimized front-end built with React, Vite, and Tailwind CSS.
- **Admin Panel**: Secure dashboard for content management, media uploads, and site settings.
- **Storage Layer Architecture**: Agnostic Storage Layer currently powered by the GitHub API. Uses JSON files as a database to allow seamless flat-file CMS functionality.
- **Real-Time Search**: Global search functionality with animated typing placeholders.
- **Theme Switching**: Built-in support for Light and Dark modes.
- **Modern Animations**: Powered by Framer Motion.

## 🚀 Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion
- **Icons**: Lucide React
- **Routing**: React Router
- **Storage Backend**: GitHub API (JSON Content & Media)

## 📖 Documentation
Please refer to the following documentation files to understand the project architecture and workflows:
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Directory layout and file responsibilities.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and dependency maps.
- [SYSTEM_RULES.md](./SYSTEM_RULES.md) - Immutable project rules.
- [AI_DEVELOPMENT_RULES.md](./AI_DEVELOPMENT_RULES.md) - Guidelines for AI agents.
- [CONTENT_SCHEMA.md](./CONTENT_SCHEMA.md) - JSON data schemas.
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Storage Services documentation.
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Usage guide for the Admin Panel.
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - How to deploy the application.
- [INSTALLATION.md](./INSTALLATION.md) - Local development setup.
- [SECURITY.md](./SECURITY.md) - Security model and authentication.
- [ROADMAP.md](./ROADMAP.md) - Future plans and planned features.

## 📝 License
This project is licensed under the MIT License.
"""
with open('README.md', 'w') as f: f.write(readme_content)

# 2. ARCHITECTURE.md
architecture_content = """# System Architecture

This document describes the high-level architecture of the project.

## Overview
The project is divided into three main components:
1. **Public Website**: A React single-page application (SPA) that reads static JSON files generated at build time or fetched dynamically.
2. **Admin Panel**: A protected React module (accessible at `/admin`) that manages the content.
3. **Storage Layer**: An abstraction layer that decouples the Admin Panel from the actual storage backend (currently GitHub).

## Storage Layer Architecture

```text
+---------------------+
|                     |
|     Admin Panel     |  <-- UI Components, Forms, Editors
|                     |
+---------+-----------+
          |
+---------v-----------+
|                     |
|  Content Service &  |  <-- Business Logic (savePost, uploadImage)
|  Media Service      |
|                     |
+---------+-----------+
          |
+---------v-----------+
|                     |
| Storage Provider    |  <-- Interface (src/lib/storage/types.ts)
|                     |
+---------+-----------+
          |
+---------v-----------+
|                     |
|  GitHub Provider    |  <-- Implementation (src/lib/storage/githubProvider.ts)
|                     |
+---------+-----------+
          |
+---------v-----------+
|                     |
|    GitHub API       |  <-- Core HTTP Client (src/lib/github.ts)
|                     |
+---------------------+
```

## Data Flow
1. **Read**: The Admin Panel requests data via `contentService.getPosts()`. The service calls the `StorageProvider`, which (in the GitHub implementation) fetches JSON from the GitHub repository (`content/posts/`) via the GitHub REST API.
2. **Write**: When a post is saved, `contentService.savePost()` delegates to the provider, which Base64 encodes the JSON and commits it back to the repository via PUT request.
3. **Media**: Images are uploaded via `mediaService.uploadImage()`, which commits binaries to `public/uploads/` in the repository.

## Extensibility
Future providers (like Cloudflare D1/R2, Supabase, Firebase) can be added by implementing the `StorageProvider` interface and configuring the factory in `src/lib/storage/index.ts` without changing any code in the Admin Panel.
"""
with open('ARCHITECTURE.md', 'w') as f: f.write(architecture_content)

# 3. SYSTEM_RULES.md
system_rules_content = """# System Rules

These are the immutable rules for maintaining and extending this project.

1. **Never bypass the Storage Layer**: The Admin Panel or any UI component MUST NOT make direct calls to the GitHub API or `src/lib/github.ts`. Always use `ContentService` or `MediaService`.
2. **Preserve backward compatibility**: Data schemas (`Post`, `Category`, `Tag`, `SiteSettings`) must be backward compatible. If adding a new field, make it optional.
3. **Do not modify the Public UI without permission**: Administrative or architecture tasks should not alter the visual design of the Public Website unless explicitly requested.
4. **Never delete user-generated content**: Ensure deletion logic has confirmation dialogues and soft-deletes where applicable, or at least double-checks before hard deletion via the Provider.
5. **Always update documentation**: Any structural change (new folder, new service, new schema field) MUST be reflected in this Documentation Framework immediately.
6. **No duplicate logic**: If a function exists (e.g., `cn` for Tailwind class merging), use it instead of recreating it.
7. **Keep Admin and Public isolated**: Admin components must live in `src/admin/`. Public components must live in `src/components/` and `src/pages/`.
"""
with open('SYSTEM_RULES.md', 'w') as f: f.write(system_rules_content)

# 4. AI_DEVELOPMENT_RULES.md
ai_rules_content = """# AI Development Rules

Instructions for any AI agent (like GitHub Copilot, Gemini, Claude) working on this repository:

1. **Read Documentation First**: Before proposing or making any changes, read `PROJECT_STRUCTURE.md` and `ARCHITECTURE.md` to understand where things belong.
2. **Reuse Existing Code**: Check `src/components`, `src/lib`, and `src/admin/components` before creating new components.
3. **Never Duplicate Architecture**: Adhere strictly to the Storage Layer abstraction. If changing how data is stored, implement a new `StorageProvider`.
4. **No Unrelated Changes**: Only modify files strictly related to the current task. Do not reformat unrelated files.
5. **Update Documentation**: After completing a task, you MUST update the relevant markdown files (e.g., `CHANGELOG.md`, `PROJECT_STRUCTURE.md`) to reflect the new state.
6. **Follow Naming Conventions**: Use PascalCase for React components, camelCase for functions and variables. Keep file names matching the default export.
"""
with open('AI_DEVELOPMENT_RULES.md', 'w') as f: f.write(ai_rules_content)

# 5. CONTENT_SCHEMA.md
content_schema_content = """# Content Schema

This document outlines the JSON schema used by the Content Service and stored in the repository.

## Post (`content/posts/*.json`)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (slug-like). |
| `title` | string | Yes | The post title. |
| `content` | string | Yes | HTML content from the Rich Text Editor. |
| `status` | string | Yes | `'draft' | 'published'` |
| `date` | string | Yes | ISO date string of publication. |
| `categorySlug` | string | No | The category ID this post belongs to. |
| `seoTitle` | string | No | Meta title for SEO. |
| `seoDescription` | string| No | Meta description for SEO. |
| `tags` | array | No | Array of tag slugs. |
| `author` | string | No | Author name. |

## Category (`content/categories.json`)
Array of objects:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique ID (usually UUID). |
| `name` | string | Yes | Display name. |
| `slug` | string | Yes | URL-friendly slug. |
| `color` | string | No | Hex color code. |

## Tag (`content/tags.json`)
Array of objects:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique ID (usually UUID). |
| `name` | string | Yes | Display name. |
| `slug` | string | Yes | URL-friendly slug. |

## SiteSettings (`content/settings.json`)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteName` | string | No | Name of the website. |
| `description`| string | No | Global meta description. |
| `seoTitle` | string | No | Global SEO title format. |
| `googleAnalyticsId` | string | No | GA Measurement ID. |
| `publisherId` | string | No | AdSense Publisher ID. |
| `theme` | string | No | Default theme preference. |
"""
with open('CONTENT_SCHEMA.md', 'w') as f: f.write(content_schema_content)

# 6. API_DOCUMENTATION.md
api_doc_content = """# API Documentation

## Storage Layer Services

### ContentService
Located at `src/lib/storage/contentService.ts`.

- `getPosts(): Promise<Post[]>`: Retrieves all posts.
- `getPost(id: string): Promise<Post | null>`: Retrieves a single post.
- `savePost(post: Post, isEdit: boolean): Promise<void>`: Creates or updates a post.
- `deletePost(id: string): Promise<void>`: Deletes a post.
- `getCategories(): Promise<Category[]>`: Retrieves all categories.
- `saveCategories(categories: Category[]): Promise<void>`: Bulk saves the categories array.
- `getTags(): Promise<Tag[]>`: Retrieves all tags.
- `saveTags(tags: Tag[]): Promise<void>`: Bulk saves the tags array.
- `getSettings(): Promise<SiteSettings>`: Retrieves global site settings.
- `saveSettings(settings: SiteSettings): Promise<void>`: Saves global site settings.

### MediaService
Located at `src/lib/storage/mediaService.ts`.

- `listImages(): Promise<MediaFile[]>`: Retrieves a list of all uploaded images.
- `uploadImage(file: File, fileName: string): Promise<void>`: Uploads a new image.
- `deleteImage(path: string): Promise<void>`: Deletes an image given its path.
- `renameImage(oldPath: string, newPath: string): Promise<void>`: Renames/moves an image.

### StorageProvider (Interface)
Located at `src/lib/storage/types.ts`. All future providers must implement this interface to be compatible with the Admin Panel.
"""
with open('API_DOCUMENTATION.md', 'w') as f: f.write(api_doc_content)

# 7. ADMIN_GUIDE.md
admin_guide_content = """# Admin Guide

## Accessing the Admin Panel
1. Navigate to `/admin` in the browser.
2. You will be prompted to enter a **GitHub Personal Access Token (PAT)**, Repository URL, and Branch name.
3. This is because the CMS currently uses GitHub as its database (Storage Provider).

## Dashboard Features
- **Posts**: Create, edit, publish, and delete posts using the Rich Text Editor.
- **Media Library**: Upload, delete, and rename images. Copy URLs to use in posts.
- **Categories & Tags**: Manage taxonomy for the posts.
- **Website Settings**: Update SEO meta tags, Google Analytics IDs, and AdSense codes.
- **SEO Calculator**: Built into the post editor to analyze Keyword density and readability.

## Best Practices
- Save your posts as Drafts before publishing.
- Do not use special characters in Media file names (they will be auto-replaced).
- Ensure your GitHub PAT has `repo` permissions to read/write files.
"""
with open('ADMIN_GUIDE.md', 'w') as f: f.write(admin_guide_content)

# 8. DEPLOYMENT_GUIDE.md
deployment_guide_content = """# Deployment Guide

The application is a standard Vite React SPA, and can be deployed anywhere that supports static site hosting.

## GitHub Pages / Cloudflare Pages / Vercel

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: No sensitive environment variables are required at build time, as the GitHub PAT is entered client-side by the admin.

### Static Data Compilation
The `src/data.ts` file uses `import.meta.glob` to bundle all JSON files in `content/posts/*.json` during the `npm run build` step. This means that whenever content changes in the GitHub repository, the site MUST be rebuilt to reflect those changes on the public frontend.

### Continuous Deployment
Set up a GitHub Action or connect Cloudflare Pages directly to the repository so that every commit to the main branch triggers a new build. Since the Admin Panel writes to GitHub, saving a post in the Admin Panel will automatically trigger a deployment.
"""
with open('DEPLOYMENT_GUIDE.md', 'w') as f: f.write(deployment_guide_content)

# 9. INSTALLATION.md
installation_content = """# Installation Guide

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd free-career-notice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The local server includes Express middleware (`server.ts`) that handles local filesystem writes, so when you use the Admin Panel locally, it saves files directly to your disk while also pushing to GitHub.

4. **Access the application:**
   - Public UI: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
"""
with open('INSTALLATION.md', 'w') as f: f.write(installation_content)

# 10. SECURITY.md
security_content = """# Security Documentation

## Admin Panel Authentication
Currently, the Admin Panel does not use traditional username/password authentication. Instead, it relies on a **Bring Your Own Token** model.
- The user must provide a GitHub Personal Access Token (PAT) with `repo` scope.
- The token is stored ONLY in the browser's `sessionStorage`.
- It is never transmitted to any third-party server, only directly to `api.github.com`.

## Storage Layer Security
- The Content Service and Media Service are executed entirely client-side.
- The safety of the data depends on the security of the GitHub PAT and the GitHub repository permissions.

## XSS Prevention
- HTML content generated by the Rich Text Editor is rendered using `dangerouslySetInnerHTML`.
- Care must be taken to sanitize input if multiple untrusted editors are granted access to the repository.

## Future Plans
Migrating to Cloudflare D1/R2 or Supabase will involve implementing a robust JWT-based authentication system.
"""
with open('SECURITY.md', 'w') as f: f.write(security_content)

# 11. CHANGELOG.md
changelog_content = f"""# Changelog

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
"""
with open('CHANGELOG.md', 'w') as f: f.write(changelog_content)

# 12. ROADMAP.md
roadmap_content = """# Roadmap

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
"""
with open('ROADMAP.md', 'w') as f: f.write(roadmap_content)

# 13. TODO.md
todo_content = """# TODO

## High Priority
- [ ] Verify error boundaries around the new `ContentService` calls in `AdminDashboard.tsx`.
- [ ] Add loading skeletons or spinners while `fetchData` is running in the Admin Dashboard.

## Medium Priority
- [ ] Implement pagination in `StorageProvider.getPosts()` (currently fetches all posts at once).
- [ ] Add image compression before uploading to `mediaService`.

## Low Priority / Technical Debt
- [ ] Clean up `temp_editor.txt` if it is no longer used.
- [ ] Migrate `data.ts` to fetch from the Storage Provider instead of relying on `import.meta.glob` if dynamic data fetching is desired in production.
"""
with open('TODO.md', 'w') as f: f.write(todo_content)

# 14. ANALYSIS_REPORT.md
analysis_content = """# Analysis Report

## Architecture Quality
The project has undergone a significant architectural improvement by introducing the Storage Layer. The `src/lib/storage` module successfully isolates side-effects (GitHub API calls) from the React UI (`src/admin/`). This strictly adheres to the dependency inversion principle.

## Folder Organization
Folders are cleanly separated between public website (`src/components`, `src/pages`) and admin interface (`src/admin`). The utility and service layers are logically placed in `src/lib`.

## Storage Layer
The Storage Layer is robust. It uses a typed interface (`StorageProvider`) ensuring that any future backend (Cloudflare, Supabase) must respect the contract expected by the Admin Panel.

## Maintainability & Scalability
- **Maintainability**: High. With the new Documentation Framework, onboarding new developers or AI agents is streamlined.
- **Scalability**: Medium. Currently, all posts are loaded statically at build time via `import.meta.glob` in `data.ts`. As the number of posts grows into the thousands, this will slow down the build process and increase bundle size. A dynamic fetch approach or SSR (Server-Side Rendering) will be necessary in the future.

## Documentation Coverage
100%. All architectural patterns, schemas, deployment procedures, and APIs are documented.

## Recommendations
1. When implementing a future backend (e.g., Cloudflare), implement a dynamic fetch in the public website instead of building the JSON files into the Vite bundle.
2. Implement image optimization in the browser before invoking `mediaService.uploadImage()` to save bandwidth and storage space.
"""
with open('ANALYSIS_REPORT.md', 'w') as f: f.write(analysis_content)

print("Documentation generated successfully.")
