# System Architecture

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


## Dual-Repository Migration

This project now uses a dual-repository architecture. The Website Repository (this one) contains the source code, while all user-generated content (posts, images, settings) is stored in an external Content Repository via the configured Storage Provider in `src/config.ts`. This prevents content loss during AI Studio updates. Admin Panel communicates with the Content Service.
