# General Rules

- **Keep the Root Directory Clean**: Never create temporary scripts, patch files, or loose components in the root directory. 
- **Script Management**: Any utility scripts (like data migrations, patch scripts, or generator scripts) MUST be placed in the `_scripts/` directory.
- **Admin Panel**: Any admin-related pages, components, or utilities MUST be placed inside the `src/admin/` directory (e.g., `src/admin/components/`).
- **Public Website**: Public-facing pages and components MUST go into their respective standard directories (`src/pages/`, `src/components/`, `src/lib/`).

By adhering to this structure, we ensure the workspace remains organized and maintainable.
