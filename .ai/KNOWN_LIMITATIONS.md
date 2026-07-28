# Current Limitations

1. **Static Data Import**: `src/data.ts` uses `import.meta.glob`. This means the site MUST be rebuilt for new posts to appear on the public site.
2. **GitHub API Rate Limits**: High usage in the Admin Panel might hit GitHub's REST API rate limits.
3. **File Size**: Uploading very large images might fail or slow down the GitHub API.
4. **Session Storage**: The GitHub PAT is lost if the user closes the browser tab.
