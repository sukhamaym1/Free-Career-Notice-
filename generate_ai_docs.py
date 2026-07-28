import os

os.makedirs('.ai', exist_ok=True)

docs = {
    "README.md": """# AI Workspace Overview

Welcome to the `.ai/` directory. This folder contains the permanent memory, context, and strict instructions for any AI agent interacting with this repository.

## Purpose
- To provide persistent context across sessions.
- To enforce coding, architectural, and documentation standards.
- To act as a centralized knowledge base for the AI agent.

See `INDEX.md` for a complete list of files in this directory.
""",
    
    "CONTEXT.md": """# Current Project Context

**Project Name**: Free Career Notice
**Type**: Web Application with Headless CMS (React + Vite + Tailwind CSS v4)
**Current State**: 
- Public UI completed.
- Admin Panel implemented with GitHub API as the Storage Provider.
- Storage Layer abstracted into `src/lib/storage/`.

**Primary Goal**: Maintain a robust, scalable, and fully documented architecture. Ensure any new features integrate seamlessly with the existing Storage Layer and Admin UI.
""",

    "AI_MEMORY.md": """# Permanent AI Memory

This file serves as the long-term memory for the AI.

## Key Facts
- The CMS uses a flat-file JSON structure stored in the `content/` folder on GitHub.
- The Admin Panel writes to GitHub via a Personal Access Token (PAT).
- The public site currently imports JSON statically using `import.meta.glob`.
- All styling must be done using Tailwind CSS v4 utility classes.
- UI components use Framer Motion for animations.
- Icons use `lucide-react`.

## Important Constraints
- Do NOT bypass the Storage Layer (`src/lib/storage/`).
- Do NOT rewrite working modules unless explicitly instructed.
- Do NOT delete user-generated content without soft-delete or confirmation.
""",

    "CODING_RULES.md": """# Coding Standards

1. **TypeScript**: Use strict typing. Avoid `any` where possible.
2. **React Components**: Use functional components and hooks.
3. **Styling**: Tailwind CSS only. No custom `.css` files unless absolutely necessary (like `index.css`).
4. **Imports**: Use absolute-like or clean relative imports. Order imports logically.
5. **State Management**: Use React state/context. Keep global state minimal.
6. **Error Handling**: Use try/catch blocks in async functions. Show user-friendly error messages in the UI.
""",

    "DOCUMENTATION_RULES.md": """# Documentation Rules

1. **Single Source of Truth**: The Markdown files in the root (like `PROJECT_STRUCTURE.md`) and `.ai/` directory are the source of truth.
2. **Always Update**: If you modify the codebase structurally, you MUST update the corresponding documentation.
3. **No Assumptions**: Document only what exists. Do not invent endpoints or features in the documentation.
4. **Format**: Use clean Markdown with headers, code blocks, and tables.
""",

    "TASK_TEMPLATE.md": """# Feature Request Template

**Feature Name**: [Name]
**Description**: [Brief description]
**Target Module**: [Frontend | Admin | API | Storage]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Technical Notes
- Consider impacts on [Module]
- Update [Documentation File]
""",

    "BUG_REPORT_TEMPLATE.md": """# Bug Report Template

**Bug Title**: [Title]
**Module**: [Frontend | Admin | API | Storage]

## Description
[Describe the bug]

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
[What should happen]

## Actual Behavior
[What happens]

## Possible Cause / Technical Notes
[Your hypothesis]
""",

    "PROMPT_LIBRARY.md": """# Frequently Used Prompts

1. **Refactor Component**: "Analyze `[Component.tsx]` and refactor it to improve readability and type safety without changing its external API."
2. **Add Storage Method**: "Implement a new method `[MethodName]` in the `StorageProvider` interface and its corresponding implementation in `githubProvider.ts`."
3. **Update Docs**: "Scan the project for changes and update `PROJECT_STRUCTURE.md` and `CHANGELOG.md`."
""",

    "WORKFLOW.md": """# Development Workflow

1. **Understand Request**: Read the user's prompt carefully.
2. **Context Gathering**: Read relevant files and `.ai/` documentation.
3. **Plan**: Formulate a technical plan.
4. **Execute**: Write the code, strictly adhering to `CODING_RULES.md`.
5. **Verify**: Ensure the build succeeds (`npm run build`).
6. **Document**: Update `CHANGELOG.md` and any other affected documentation.
7. **Report**: Provide a concise summary to the user.
""",

    "ARCHITECT_GUIDE.md": """# Architecture Principles

1. **Separation of Concerns**: Keep the Admin Panel completely isolated from the Public Website.
2. **Storage Abstraction**: The Admin UI must not know about GitHub. It must only interact with `ContentService` and `MediaService`.
3. **Static Generation (Current)**: The public site relies on build-time static generation for content.
4. **Modularity**: Break large components into smaller, reusable pieces.
""",

    "STORAGE_GUIDE.md": """# Storage Layer Guide

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
""",

    "DEPLOYMENT_RULES.md": """# Deployment Instructions

1. **Build Step**: The project is built using `npm run build` via Vite.
2. **Environment Variables**: Avoid requiring secrets at build time. The GitHub PAT is provided client-side by the admin.
3. **Hosting**: Deployable to any static host (Cloudflare Pages, Vercel, GitHub Pages) because the CMS uses a flat-file JSON structure.
""",

    "SECURITY_RULES.md": """# Security Policies

1. **Admin Auth**: Rely on the Bring Your Own Token (BYOT) model using the GitHub PAT for now. Store it securely in `sessionStorage`.
2. **XSS Prevention**: Sanitize or strictly control inputs that are rendered via `dangerouslySetInnerHTML`.
3. **API Keys**: NEVER commit sensitive API keys or PATs to the codebase.
""",

    "NAMING_CONVENTION.md": """# Naming Standards

- **React Components**: PascalCase (e.g., `AdminDashboard.tsx`).
- **Hooks**: camelCase starting with `use` (e.g., `useTheme.ts`).
- **Utility Functions**: camelCase (e.g., `formatDate.ts`).
- **Files**: Match the default export name.
- **Interfaces/Types**: PascalCase (e.g., `SiteSettings`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`).
""",

    "DIRECTORY_RULES.md": """# Folder Organization Rules

- `/src/admin`: Strictly for Admin Panel code.
- `/src/components`: Public UI components.
- `/src/pages`: Public route components.
- `/src/lib`: Utilities and services.
- `/src/lib/storage`: The Storage Layer.
- `/_scripts`: Node.js scripts for refactoring or tasks.
- `/content`: JSON data files.
- `/public/uploads`: Uploaded media files.
- `/.ai`: AI Workspace documentation.
""",

    "VERSION_POLICY.md": """# Versioning Rules

- Follow Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`.
- Increment **MAJOR** for incompatible API/architectural changes.
- Increment **MINOR** for new features added in a backward compatible manner.
- Increment **PATCH** for backward compatible bug fixes.
- Document all version changes in `CHANGELOG.md`.
""",

    "DECISIONS.md": """# Architecture Decision Record (ADR)

1. **Use JSON Flat-Files**: Decided to use JSON files in `/content` as the database to allow free hosting on GitHub Pages/Cloudflare Pages.
2. **Abstract Storage Layer**: Created `StorageProvider` to allow easy migration away from GitHub in the future (e.g., to Cloudflare D1/R2).
3. **Tailwind CSS v4**: Adopted for styling due to utility-first approach and performance.
""",

    "FEATURES.md": """# Implemented Features Index

- **Public Website**
  - Responsive Hero, List Sections, Footer
  - Real-time Global Search
  - Light/Dark Theme Toggle
- **Admin Panel**
  - GitHub PAT Authentication
  - Rich Text Editor (Tiptap) with SEO Calculator
  - Posts Management (CRUD)
  - Categories & Tags Management
  - Media Library (Upload, Delete, Rename)
  - Website Settings Management
- **Storage Layer**
  - GitHub API Provider
  - Content & Media Services
""",

    "FUTURE_PLANS.md": """# Planned Features

- **Cloudflare Integration**: Add Cloudflare D1 and R2 Storage Providers.
- **JWT Authentication**: Move away from GitHub PAT when using Cloudflare backend.
- **Pagination**: Implement pagination for public posts and admin lists.
- **Image Compression**: Client-side image compression before upload.
- **Dynamic SSR**: Server-Side Rendering if JSON payload becomes too large.
""",

    "KNOWN_LIMITATIONS.md": """# Current Limitations

1. **Static Data Import**: `src/data.ts` uses `import.meta.glob`. This means the site MUST be rebuilt for new posts to appear on the public site.
2. **GitHub API Rate Limits**: High usage in the Admin Panel might hit GitHub's REST API rate limits.
3. **File Size**: Uploading very large images might fail or slow down the GitHub API.
4. **Session Storage**: The GitHub PAT is lost if the user closes the browser tab.
""",

    "CHECKLISTS.md": """# Pre/Post Development Checklists

## Pre-Development
- [ ] Understand the objective.
- [ ] Review `PROJECT_STRUCTURE.md` and `ARCHITECTURE.md`.
- [ ] Identify files to modify.

## Post-Development
- [ ] Code compiles without errors (`npm run build`).
- [ ] No regression in unrelated features.
- [ ] Types are strict (no implicit `any`).
- [ ] `CHANGELOG.md` updated.
- [ ] Relevant `.ai/` documentation updated.
""",

    "INDEX.md": """# Master Index

Welcome to the `.ai/` Documentation Workspace.

## Files

1. [README.md](./README.md) - Overview
2. [CONTEXT.md](./CONTEXT.md) - Project context
3. [AI_MEMORY.md](./AI_MEMORY.md) - Permanent memory
4. [CODING_RULES.md](./CODING_RULES.md) - Code standards
5. [DOCUMENTATION_RULES.md](./DOCUMENTATION_RULES.md) - Doc standards
6. [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) - Task template
7. [BUG_REPORT_TEMPLATE.md](./BUG_REPORT_TEMPLATE.md) - Bug template
8. [PROMPT_LIBRARY.md](./PROMPT_LIBRARY.md) - Useful prompts
9. [WORKFLOW.md](./WORKFLOW.md) - AI workflow
10. [ARCHITECT_GUIDE.md](./ARCHITECT_GUIDE.md) - Architecture rules
11. [STORAGE_GUIDE.md](./STORAGE_GUIDE.md) - Storage rules
12. [DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md) - Deployment rules
13. [SECURITY_RULES.md](./SECURITY_RULES.md) - Security rules
14. [NAMING_CONVENTION.md](./NAMING_CONVENTION.md) - Naming conventions
15. [DIRECTORY_RULES.md](./DIRECTORY_RULES.md) - Folder rules
16. [VERSION_POLICY.md](./VERSION_POLICY.md) - Versioning rules
17. [DECISIONS.md](./DECISIONS.md) - ADRs
18. [FEATURES.md](./FEATURES.md) - Feature index
19. [FUTURE_PLANS.md](./FUTURE_PLANS.md) - Roadmap
20. [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) - Current limitations
21. [CHECKLISTS.md](./CHECKLISTS.md) - Development checklists
22. [INDEX.md](./INDEX.md) - This file
"""
}

for filename, content in docs.items():
    with open(os.path.join('.ai', filename), 'w') as f:
        f.write(content)

print("Created .ai/ directory with all required documentation files.")
