# Admin Guide

Welcome to the Free Career Notice CMS Admin Panel!

This panel uses your GitHub repository directly as its database. No external servers or paid databases are required.

## 1. How to Login
1. Go to your Admin Panel URL (e.g. `your-website.com/admin`).
2. Enter your **GitHub Personal Access Token (PAT)**. You can generate one in your GitHub Settings (Developer Settings -> Personal Access Tokens). Make sure it has the `repo` scope.
3. Enter your **Repository** (e.g., `your-username/free-career-notice`).
4. Enter your **Branch** (usually `main`).
5. Click **Sign In**.

## 2. Dashboard Overview
The dashboard shows you a quick summary of total jobs, admit cards, results, and updates. You can see your recent posts and quickly navigate to the "Create Post" screen.

## 3. How to Create a Post
1. Click **Create Post** in the sidebar or the quick actions.
2. Fill out the Title, Author, Date, and other details.
3. Select the proper **Category (Slug)**. The category determines where the post appears on the public website (e.g., "New Updates", "Job Notifications").
4. Write your content in the **Content** text editor.
5. Click **Publish Post**. The system will save this directly to your GitHub repository under `content/posts/`. Wait a few minutes for your website to rebuild.

## 4. How to Edit a Post (Coming Soon)
1. Go to **All Posts**.
2. Click **Edit** next to a post.
3. Make your changes and save. The changes will be pushed to GitHub.

## 5. Media Library (Placeholder)
You can upload images here. Currently, images should be uploaded directly to `public/uploads/` via GitHub, or use the drag-and-drop tool to generate Markdown links.

## 6. Backup & Restore
Since your database is completely inside the GitHub repository (`content/posts/`), your data is always backed up automatically by Git! You can clone the repository to your local computer for an offline backup.

## 7. How to Deploy
Whenever you add or update a post, the Admin Panel pushes the file directly to GitHub. If you have connected your GitHub repository to Cloudflare Pages or Vercel, the website will **automatically rebuild and deploy** within 1-2 minutes. You don't need to do anything else!
