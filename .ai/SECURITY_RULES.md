# Security Policies

1. **Admin Auth**: Rely on the Bring Your Own Token (BYOT) model using the GitHub PAT for now. Store it securely in `sessionStorage`.
2. **XSS Prevention**: Sanitize or strictly control inputs that are rendered via `dangerouslySetInnerHTML`.
3. **API Keys**: NEVER commit sensitive API keys or PATs to the codebase.
