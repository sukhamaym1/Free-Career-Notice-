# Deployment Guide

This guide explains how to deploy the Free Career Notice platform using 100% free-tier services.

## Architecture Overview

- **Frontend Hosting**: Cloudflare Pages (Free)
- **Backend API**: Cloudflare Workers (Free)
- **Database**: Cloudflare D1 (Serverless SQLite - Free)
- **Media Storage**: Cloudflare R2 (S3-Compatible Object Storage - Free Tier)

## Prerequisites

1. A Cloudflare account (free)
2. Node.js installed locally
3. Wrangler CLI installed (`npm install -g wrangler`)
4. A GitHub account

## Step 1: Frontend Deployment (Cloudflare Pages)

We will use Cloudflare Pages with Direct GitHub Integration.

1. Push your code to a GitHub repository.
2. Log into the Cloudflare Dashboard.
3. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Select your GitHub repository.
5. Setup the build settings:
   - **Framework preset**: `Vite` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

Cloudflare will automatically deploy your frontend every time you push to the `main` branch.

## Step 2: Backend Deployment (Cloudflare Workers & D1)

*Note: The backend code resides in a separate directory or repository typically, but is conceptually described here.*

1. **Initialize a Worker Project**:
   ```bash
   npm create cloudflare@latest api-worker
   ```
   Choose "Hello World" or "Router" template.

2. **Create the D1 Database**:
   ```bash
   npx wrangler d1 create career-notice-db
   ```
   Take note of the `database_name` and `database_id` provided in the terminal.

3. **Configure `wrangler.toml`**:
   Add the D1 binding to your `wrangler.toml` in the worker project:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "career-notice-db"
   database_id = "<YOUR_DATABASE_ID>"
   ```

4. **Initialize the Schema**:
   Create a `schema.sql` file for your posts, categories, etc., and apply it:
   ```bash
   npx wrangler d1 execute career-notice-db --local --file=./schema.sql
   npx wrangler d1 execute career-notice-db --remote --file=./schema.sql
   ```

5. **Deploy the Worker**:
   ```bash
   npx wrangler deploy
   ```

## Step 3: Media Storage (Cloudflare R2)

1. **Create an R2 Bucket**:
   ```bash
   npx wrangler r2 bucket create career-notice-media
   ```

2. **Bind R2 to the Worker**:
   Update `wrangler.toml`:
   ```toml
   [[r2_buckets]]
   binding = "MEDIA_BUCKET"
   bucket_name = "career-notice-media"
   ```

3. **Public Access**:
   You can map a custom domain to your R2 bucket in the Cloudflare dashboard to serve images directly to the frontend.

## Step 4: Connecting Frontend to Backend

In your Cloudflare Pages settings (or your local `.env` file for testing), set the `VITE_API_URL` environment variable to your deployed Worker URL:

```
VITE_API_URL=https://api-worker.<your-subdomain>.workers.dev/api
```

## Zero Cost Assurance

As long as you stay within the generous Cloudflare free tiers (100k requests/day for Workers, 5 million reads/day for D1, 10GB storage for R2), this setup will cost exactly ₹0.
