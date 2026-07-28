# Permanent AI Memory

This file serves as the long-term memory for the AI.

## Key Facts
- The CMS uses a flat-file JSON structure stored in the `content/` folder on GitHub.
- The Admin Panel writes to GitHub via a Personal Access Token (PAT).
- The public site currently imports JSON statically using `import.meta.glob`.
- All styling must be done using Tailwind CSS v4 utility classes.
- UI components use Framer Motion for animations.
- Icons use `lucide-react`.

## Important Constraints
- Do NOT bypass the Storage Layer (`src/lib/storage/`).
- Do NOT rewrite working modules unless explicitly instructed.
- Do NOT delete user-generated content without soft-delete or confirmation.
