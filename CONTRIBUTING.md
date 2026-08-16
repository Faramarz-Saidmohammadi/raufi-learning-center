# Contributing

## Development workflow

1. Create a focused branch from the latest `main`.
2. Keep each change set scoped to one feature, fix, or maintenance concern.
3. Update tests, validation, documentation, and migrations when behaviour changes.
4. Run the local quality gate before opening a pull request.
5. Open a pull request and merge only after the diff and automated checks have been reviewed.

## Local quality gate

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Database-backed behaviour must also be exercised against a non-production Neon database when the change affects persistence, migrations, admissions, CMS CRUD, or publishing.

## Pull requests

A pull request should explain:

- what changed and why;
- user-visible impact;
- data/schema impact;
- security impact;
- verification performed;
- deployment or rollback considerations when relevant.

Prefer small, reviewable pull requests. Do not mix unrelated refactors with product changes.

## Database changes

Schema definitions live in `db/schema.ts`.

After a schema change:

```bash
npm run db:generate
```

Do not rewrite a migration that has already been deployed. Add a new migration and explicit backfill when required.

## Security and secrets

Never commit real credentials or production data. Use placeholders in examples and environment templates. Follow `SECURITY.md` for vulnerability handling.

## Commit messages

Use concise, imperative messages that describe the change, for example:

```text
feat: add admissions status filter
fix: prevent deletion of referenced media
ci: add production build check
docs: document migration workflow
```
