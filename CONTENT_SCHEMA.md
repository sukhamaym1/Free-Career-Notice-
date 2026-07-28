# Content Schema

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
