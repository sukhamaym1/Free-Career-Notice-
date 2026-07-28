# AI Development Rules

Instructions for any AI agent (like GitHub Copilot, Gemini, Claude) working on this repository:

1. **Read Documentation First**: Before proposing or making any changes, read `PROJECT_STRUCTURE.md` and `ARCHITECTURE.md` to understand where things belong.
2. **Reuse Existing Code**: Check `src/components`, `src/lib`, and `src/admin/components` before creating new components.
3. **Never Duplicate Architecture**: Adhere strictly to the Storage Layer abstraction. If changing how data is stored, implement a new `StorageProvider`.
4. **No Unrelated Changes**: Only modify files strictly related to the current task. Do not reformat unrelated files.
5. **Update Documentation**: After completing a task, you MUST update the relevant markdown files (e.g., `CHANGELOG.md`, `PROJECT_STRUCTURE.md`) to reflect the new state.
6. **Follow Naming Conventions**: Use PascalCase for React components, camelCase for functions and variables. Keep file names matching the default export.
