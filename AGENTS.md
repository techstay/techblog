# AGENTS Rules — techblog

## Blog & Content Guidelines

- **Multilingual Support**: English content is located in `content/en/`, Simplified Chinese in `content/zh/`.
- **Theme**: FixIt v1.0 alpha (git submodule at `themes/FixIt`). Note that Dart Sass is required for scss/sass assets.
- **Content Integrity**: When updating or deleting posts, ensure no orphaned links exist in menus, taxonomies, or other articles.

## Version Control & Commit Guidelines

The repository is configured in co-located mode with both Git and **Jujutsu (`jj`)** (`--colocate`). Both `git` and `jj` commands can be used seamlessly.

### General Commit Conventions
- Use meaningful one-line messages; for complex updates, use multiple lines to detail changes.
- Prefix commit messages with standard Gitmoji / Conventional Commits (e.g., `✨ feat: ...`, `📝 docs: ...`, `🐛 fix: ...`, `🔥 remove: ...`, `chore: ...`).
- Keep atomic commits: standalone articles, theme updates, and configuration adjustments should have separate commits.
- All code, comments, and commit messages must be in standard English.

### Jujutsu (`jj`) Best Practices
- **Working with changes**:
  - Use `jj describe -m "<emoji> <type>: <message>"` to set or update the description of the current working change (`@`).
  - Use `jj new` to finalize the current change and open a clean working copy for the next task.
- **Incremental updates & absorption**:
  - When making secondary amendments to already committed changes, run `jj absorb` to automatically fold modifications back into their respective historical commits without manual rebasing.
  - To selectively assign files to a specific commit, use `jj squash --into <change-id> <path>`.
- **Syncing & Publishing**:
  - Update local bookmarks and push changes using `jj git push --bookmark main` or standard `git push`.
  - For safe experimentation and undoing mistakes, leverage `jj undo` and `jj op log`.
