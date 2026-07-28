# Installation Guide

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
