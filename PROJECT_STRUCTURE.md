# Project Structure

This document provides a single source of truth for the architecture, directory structure, and file responsibilities of the project. It reflects the exact current state of the codebase, ensuring new developers or AI agents can understand the structure quickly.

## Project Tree

```text
├── ADMIN_GUIDE.md
├── AGENTS.md
├── ANALYSIS_REPORT.md
├── API_DOCUMENTATION.md
├── CHANGELOG.md
├── DEPLOYMENT_GUIDE.md
├── INSTALLATION.md
├── PROJECT_STRUCTURE.md
├── README.md
├── SECURITY.md
├── bun.lock
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── server.ts
├── temp_editor.txt
├── tsconfig.json
├── vite.config.ts
├── content/
│   ├── categories.json
│   ├── homepage.json
│   ├── menu.json
│   ├── settings.json
│   ├── tags.json
│   └── posts/
│       ├── post-007.json
│       ├── post-013.json
│       ├── post-018.json
│       └── post-022.json
└── src/
    ├── App.tsx
    ├── data.ts
    ├── index.css
    ├── main.tsx
    ├── types.ts
    ├── vite-env.d.ts
    ├── admin/
    │   ├── AdminDashboard.tsx
    │   ├── AdminLogin.tsx
    │   ├── AdminPage.tsx
    │   ├── components/
    │   │   ├── AdminHeader.tsx
    │   │   ├── AdminLayout.tsx
    │   │   ├── AdminSidebar.tsx
    │   │   ├── ComingSoon.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   ├── SEOCalculator.tsx
    │   │   ├── WebsiteSettings.tsx
    │   │   └── editor/
    │   │       ├── EditorFooter.tsx
    │   │       ├── EditorToolbar.tsx
    │   │       ├── Extensions.ts
    │   │       └── FloatingAndBubbleMenus.tsx
    │   └── pages/
    │       ├── AdsPage.tsx
    │       ├── AppearancePage.tsx
    │       ├── CategoriesPage.tsx
    │       ├── CommentsPage.tsx
    │       ├── DashboardPage.tsx
    │       ├── EditorPage.tsx
    │       ├── MediaLibraryPage.tsx
    │       ├── PagesPage.tsx
    │       ├── PostsPage.tsx
    │       ├── TagsPage.tsx
    │       ├── ToolsPage.tsx
    │       └── UsersPage.tsx
    ├── pages/
    │   ├── CategoryPage.tsx
    │   ├── HomePage.tsx
    │   ├── PostPage.tsx
    │   ├── QuizPage.tsx
    │   ├── SearchPage.tsx
    │   └── TextPage.tsx
    ├── lib/
    │   ├── github.ts
    │   ├── utils.ts
    │   └── storage/
    │       ├── contentService.ts
    │       ├── githubProvider.ts
    │       ├── index.ts
    │       ├── mediaService.ts
    │       └── types.ts
    ├── components/
    │   ├── ActionGroup.tsx
    │   ├── BackToTop.tsx
    │   ├── ColorfulGrid.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── Hero.tsx
    │   ├── JobFilterSidebar.tsx
    │   ├── ListSection.tsx
    │   └── ScrollToTop.tsx
    └── hooks/
        ├── useTheme.ts
        └── useTypingPlaceholder.ts
```

## Dependency Map (Architecture)

The CMS now implements a clean Storage Layer abstraction for all content interactions, ensuring the Admin Panel is agnostic of the underlying storage mechanism.

```text
Admin Panel (src/admin)
        │
        ▼
Content / Media Services (src/lib/storage/*Service.ts)
        │
        ▼
Storage Provider Interface (src/lib/storage/types.ts)
        │
        ▼
GitHub Provider (src/lib/storage/githubProvider.ts)
        │
        ▼
GitHub API (src/lib/github.ts)
```

## Directory Documentation

### `content/`
**Purpose**: The central database/CMS storage containing JSON files.
**Responsibility**: Acts as the flat-file database when using the GitHub Storage Provider.
**Dependencies**: `src/data.ts`, `src/lib/storage/githubProvider.ts`
**Files**: `categories.json`, `tags.json`, `settings.json`, `menu.json`, `homepage.json`, and individual posts in `posts/`.

### `src/`
**Purpose**: The root of the React source code for both the Public Website and Admin Panel.

### `src/admin/`
**Purpose**: The isolated Admin Panel module.
**Responsibility**: Managing authentication, rendering the dashboard layout, handling CMS edits, settings, media, and communicating with the Storage Layer.
**Dependencies**: `src/lib/storage`, `src/lib/github.ts`

### `src/admin/components/`
**Purpose**: Reusable UI components specific to the Admin Panel.
**Responsibility**: Provides complex specialized UI elements like `RichTextEditor`, `SEOCalculator`, `WebsiteSettings`, and structural components like `AdminLayout` and `AdminSidebar`.

### `src/admin/components/editor/`
**Purpose**: Modularized subcomponents for the Tiptap-based Rich Text Editor.
**Responsibility**: Toolbar configuration, floating menus, extensions, and footer stats.

### `src/admin/pages/`
**Purpose**: Specific page views inside the Admin Dashboard.
**Responsibility**: Splits the Admin Dashboard monolithic UI into modular tabs (e.g., `PostsPage`, `EditorPage`, `MediaLibraryPage`).

### `src/components/`
**Purpose**: Reusable UI components for the Public Website.
**Responsibility**: Site layout and interactive elements (Header, Footer, Hero, ActionGroup, etc.).

### `src/pages/`
**Purpose**: Public website page views.
**Responsibility**: Renders routes like the `HomePage`, `PostPage`, `CategoryPage`.

### `src/hooks/`
**Purpose**: Custom React hooks.
**Responsibility**: Shared state logic like `useTheme` and `useTypingPlaceholder`.

### `src/lib/`
**Purpose**: Core application utilities and API clients.
**Responsibility**: Contains general utilities (`utils.ts`) and the raw GitHub API client (`github.ts`).

### `src/lib/storage/`
**Purpose**: The Storage Layer and Content Service.
**Responsibility**: Decouples the Admin UI from the raw GitHub API. Provides abstract Services (`contentService.ts`, `mediaService.ts`) and a Provider implementation (`githubProvider.ts`).

## File Documentation Format

### `server.ts`
**Purpose**: The Express server entry point.
**Responsibilities**:
- Handles local filesystem writes during development and AI Studio exports (`/api/fs/write`, `/api/fs/delete`).
- Mounts Vite middleware for development HMR and serves production builds.
**Belongs to**: API / Build System

### `src/App.tsx`
**Purpose**: The main React routing component.
**Responsibilities**: Sets up `react-router-dom` routes and switching between public pages and the `/admin` path.
**Belongs to**: Frontend / Configuration

### `src/main.tsx`
**Purpose**: Vite application entry point.
**Responsibilities**: Mounts React into the DOM, provides `BrowserRouter` and `HelmetProvider`.
**Belongs to**: Frontend

### `src/data.ts`
**Purpose**: Dynamic static data compiler.
**Responsibilities**: Uses Vite's `import.meta.glob` to synchronously load all JSON files from `content/posts/` at build time for the public website.
**Belongs to**: Frontend / Data

### `src/lib/github.ts`
**Purpose**: Raw GitHub REST API client.
**Responsibilities**: Basic HTTP fetch wrappers for GitHub API (GET, PUT, DELETE). Writes locally via `/api/fs/` while pushing to GitHub.
**Belongs to**: API / CMS

### `src/lib/storage/types.ts`
**Purpose**: Storage interfaces.
**Responsibilities**: Defines the `StorageProvider` interface and TypeScript types (`Post`, `Category`, `Tag`, `SiteSettings`, `MediaFile`) that all providers must adhere to.
**Belongs to**: Storage

### `src/lib/storage/githubProvider.ts`
**Purpose**: GitHub implementation of the Storage Layer.
**Responsibilities**: Wraps `github.ts` and maps the raw API responses into typed arrays and objects defined in `types.ts`.
**Belongs to**: Storage

### `src/lib/storage/contentService.ts`
**Purpose**: Content business logic layer.
**Responsibilities**: Proxies standard CMS calls (getPosts, savePost, etc.) to the underlying Provider.
**Belongs to**: Storage / Admin Panel

### `src/lib/storage/mediaService.ts`
**Purpose**: Media business logic layer.
**Responsibilities**: Proxies media tasks (uploadImage, deleteImage, renameImage, listImages) to the Provider.
**Belongs to**: Storage / Admin Panel

### `src/lib/storage/index.ts`
**Purpose**: Storage dependency injection and configuration.
**Responsibilities**: Exports the `createStorageProvider` factory function to initialize the correct provider based on configuration.
**Belongs to**: Storage

### `src/admin/AdminDashboard.tsx`
**Purpose**: Main Admin Dashboard component.
**Responsibilities**: Orchestrates the state, data fetching (via `ContentService` and `MediaService`), and switching between admin page views.
**Belongs to**: Admin Panel

### `src/admin/AdminPage.tsx`
**Purpose**: Admin route wrapper.
**Responsibilities**: Protects the admin route, handles the session storage for the GitHub Personal Access Token (PAT), and renders `AdminLogin` or `AdminDashboard`.
**Belongs to**: Admin Panel

## Configuration Files

- **`package.json`**: Node dependencies, run scripts (`dev`, `build`, `start`).
- **`vite.config.ts`**: Vite bundler configuration, handles React plugins.
- **`tsconfig.json`**: TypeScript compiler configuration, ensuring strict type checking and correct module resolution.

## Public Assets

Currently, the project expects assets to be uploaded to a `public/uploads/` directory, managed via the Media Library. The actual static assets (favicons, etc.) may be placed directly in `public/`.

## Storage Layer

The storage architecture is designed to be easily extensible. 

1. **Current Provider**: **GitHub** (via `githubProvider.ts`). Stores files in the `content/` and `public/uploads/` directories and commits them via the GitHub REST API.
2. **Future Providers**: Cloudflare D1, Cloudflare R2, Supabase, Firebase. To add a new provider, one only needs to implement the `StorageProvider` interface in `types.ts` and update the factory in `index.ts`. No Admin UI changes are required.

## Project Statistics

- **Total Folders**: 14
- **Total Source Files**: 59
- **Total React Components**: 42
- **Total Pages**: 18
- **Total Hooks**: 2
- **Total Services**: 2
- **Total Utility Files**: 2

## Warnings & Observations

- **Dead Code / Refactoring Note**: `temp_editor.txt` is present in the root directory and may be a leftover scratchpad file.
- **Tailwind CSS**: The project uses Tailwind CSS V4 via `@import "tailwindcss";` in `src/index.css`. There is no `tailwind.config.js` file (which is correct for V4).
- **Public Directory**: The `public/uploads` directory is created implicitly when the first file is uploaded, and may not appear in the repository if empty.
