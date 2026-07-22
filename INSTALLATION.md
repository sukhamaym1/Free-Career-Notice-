# Installation Guide

This project is a 100% free, purely frontend application that uses the GitHub REST API to act as its own headless CMS. It requires zero backend servers, zero databases, and zero ongoing costs.

## Requirements
- GitHub Account
- Node.js (v18+) for local development
- Cloudflare Pages, Vercel, or Netlify (for free hosting)

## Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/free-career-notice.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Cloudflare Pages - Recommended)
1. Log in to [Cloudflare](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
3. Select this repository.
4. Set the **Build Command** to `npm run build`.
5. Set the **Build Output Directory** to `dist`.
6. Click **Save and Deploy**.

## Using the Admin Panel
Once deployed, navigate to `https://your-site.com/admin`. Use a GitHub Personal Access Token (PAT) with `repo` permissions to log in and manage your content directly!
