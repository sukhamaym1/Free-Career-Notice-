# Installation & Deployment Guide

This guide explains how to run the Free Career Notice project locally, configure the Cloudflare infrastructure (D1, R2, Workers), and deploy the application.

## 1. Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Wrangler CLI (for Cloudflare Workers)

### Running the Frontend
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 2. Cloudflare Infrastructure Configuration

### A. Connecting Cloudflare D1 (Database)
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
2. Login to Cloudflare:
   ```bash
   wrangler login
   ```
3. Create a D1 database:
   ```bash
   wrangler d1 create free-career-notice-db
   ```
4. Bind the database to your Worker in `wrangler.toml`.

### B. Connecting Cloudflare R2 (Media Storage)
1. Create an R2 bucket:
   ```bash
   wrangler r2 bucket create free-career-media
   ```
2. Bind the bucket to your Worker in `wrangler.toml`.
3. Set up a custom domain or use the managed dev URL for public access to media files.

### C. Deploying Cloudflare Workers (API)
1. Navigate to the `api` directory (to be created for the backend).
2. Run the deployment:
   ```bash
   wrangler deploy
   ```

---

## 3. Frontend Deployment (Cloudflare Pages)

1. Push your code to a GitHub repository.
2. Go to the Cloudflare Dashboard -> Pages.
3. Connect your GitHub repository.
4. Set the build framework to **Vite**.
5. Set the build command to `npm run build`.
6. Set the build output directory to `dist`.
7. Add the environment variable `VITE_API_URL` pointing to your deployed Worker API URL.

---

## 4. Setting Up the Admin

1. Once the API is deployed, the first user to register via the API or a specific CLI command will become the Super Admin.
2. Navigate to `https://yourdomain.com/admin`.
3. Log in with the credentials established in the Worker setup.

## 5. Backups

- **JSON Export:** Inside the Admin Dashboard, navigate to Settings > Backup. Click "Export Database" to download a full JSON dump.
- **D1 Backups:** Cloudflare D1 supports automatic point-in-time recovery and snapshot exports via the Cloudflare dashboard or Wrangler CLI.
