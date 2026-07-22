# API Documentation

This document outlines the REST API design for the Cloudflare Worker backend. 

All endpoints require a valid JWT in the `Authorization: Bearer <token>` header, except for the login endpoint.

## Base URL
`https://api-worker.<your-subdomain>.workers.dev/api`

## Authentication

### `POST /auth/login`
Authenticates a user and returns a JWT.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "Admin User",
    "role": "admin"
  }
}
```

## Posts

### `GET /posts`
Retrieves a list of posts. Supports optional query parameters.

**Query Parameters:**
- `status`: filter by status (e.g., `published`, `draft`)
- `category`: filter by category slug
- `page`: pagination offset

**Response (200 OK):**
```json
[
  {
    "id": "post_1",
    "title": "SSC CGL 2026 Notification",
    "slug": "ssc-cgl-2026",
    "status": "published",
    "createdAt": "2026-05-15T10:00:00Z"
  }
]
```

### `POST /posts`
Creates a new post.

**Request:**
```json
{
  "title": "UPSC Prelims Admit Card",
  "slug": "upsc-prelims-admit-card",
  "content": "<p>Content here...</p>",
  "categoryId": "cat_1",
  "tags": ["tag_1", "tag_2"],
  "status": "draft"
}
```

### `PUT /posts/:id`
Updates an existing post.

### `DELETE /posts/:id`
Deletes a post (or moves it to trash).

## Media Library

### `POST /media/upload`
Uploads a file to Cloudflare R2 and returns the public URL.

**Request (FormData):**
- `file`: The file blob

**Response (200 OK):**
```json
{
  "id": "media_123",
  "url": "https://media.freecareernotice.com/file.jpg",
  "filename": "file.jpg"
}
```

### `GET /media`
Lists files stored in the R2 bucket.

## Role Based Access Control (RBAC)
- **Admin**: Full CRUD access on all endpoints, settings, and users.
- **Editor**: Can create and edit posts/categories/tags, but cannot modify settings or users.
- **Author**: Can only create and edit their own posts. Cannot publish directly if a review workflow is configured.
