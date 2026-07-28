# Admin Guide

## Accessing the Admin Panel
1. Navigate to `/admin` in the browser.
2. You will be prompted to enter a **GitHub Personal Access Token (PAT)**, Repository URL, and Branch name.
3. This is because the CMS currently uses GitHub as its database (Storage Provider).

## Dashboard Features
- **Posts**: Create, edit, publish, and delete posts using the Rich Text Editor.
- **Media Library**: Upload, delete, and rename images. Copy URLs to use in posts.
- **Categories & Tags**: Manage taxonomy for the posts.
- **Website Settings**: Update SEO meta tags, Google Analytics IDs, and AdSense codes.
- **SEO Calculator**: Built into the post editor to analyze Keyword density and readability.

## Best Practices
- Save your posts as Drafts before publishing.
- Do not use special characters in Media file names (they will be auto-replaced).
- Ensure your GitHub PAT has `repo` permissions to read/write files.
