# Security Architecture

The Free Career Notice enterprise CMS implements a multi-layered security architecture designed for production readiness, migrating away from client-side GitHub PAT storage to a secure Cloudflare ecosystem.

## 1. Authentication & Authorization

### JWT Authentication
- The application uses **JSON Web Tokens (JWT)** for stateless, secure authentication.
- Upon successful login, the Worker API issues an access token and an HTTP-only refresh token cookie.
- The frontend includes the access token in the `Authorization: Bearer <token>` header for all API requests.

### Role-Based Access Control (RBAC)
User roles govern actions across the CMS:
- **Admin**: Full access to all settings, users, and content.
- **Editor**: Can publish, edit, and manage all posts and categories, but cannot manage users or site settings.
- **Author**: Can write and manage their own posts, but cannot publish without approval (draft mode only).
- **Viewer**: Read-only access to internal data.

## 2. API Security (Cloudflare Workers)

### Secret Management
- **No secrets in the browser**: The frontend never exposes API keys or Personal Access Tokens.
- All secrets (JWT secret, third-party API keys) are stored securely as encrypted environment variables in Cloudflare Workers.

### Data Protection
- **CSRF Protection**: State-changing requests validate origins and implement anti-CSRF tokens where cookies are used.
- **Rate Limiting**: Cloudflare's edge rate limiting prevents brute-force login attempts and DDoS attacks on the API.
- **Password Hashing**: User passwords are encrypted using bcrypt or Argon2id inside the Worker before being stored in D1.

## 3. Infrastructure Security

### Cloudflare D1 (Database)
- Database access is strictly confined to the Cloudflare Worker via internal bindings.
- The database is not exposed to the public internet directly.

### Cloudflare R2 (Storage)
- File uploads are validated in the Worker API (MIME type checking, size limits) before being pushed to R2.
- Uploaded objects can be scanned or sanitized, and directory traversals are prevented.

## 4. Audit & Sessions
- **Audit Logs**: Critical actions (post deletion, user role changes, settings updates) are logged in a dedicated D1 table with timestamps and user IDs.
- **Session Expiration**: JWTs have a short expiration window, requiring periodic refresh. Admin sessions expire securely.
