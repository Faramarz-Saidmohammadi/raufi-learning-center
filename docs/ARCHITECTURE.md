# System Architecture

## Overview

Raufi Learning Center is a single Next.js application that serves three concerns from one deployable unit:

1. the multilingual public website;
2. the protected CMS and admissions workspace;
3. server-side application APIs and persistence workflows.

The design keeps deployment simple for a small organization while preserving clear boundaries between public content, administrative operations, persistence, authentication, and media storage.

## Runtime topology

```text
Browser
  |
  v
Next.js App Router on Vercel
  |-- Public pages and SEO routes
  |-- Protected admin UI
  |-- Route handlers / server actions
  |
  +--> Neon Postgres via Drizzle ORM
  |
  +--> Vercel Blob for managed media
```

## Application layers

### Presentation

The App Router renders the public and administrative experiences. Public pages support Dari, English, and Pashto content with RTL/LTR switching. Administrative interfaces expose publishing, content-management, media, and admissions workflows.

### Domain and application logic

Shared logic under `lib/` coordinates content retrieval, normalization, authentication/session checks, media references, and application rules. Protected mutations must validate both the administrator session and the configured administrator allowlist.

### Persistence

`db/schema.ts` defines the relational model and Drizzle provides typed access to Neon Postgres. Database initialization is centralized through `db/index.ts` and the bootstrap layer.

Production schema evolution should use generated, immutable migrations. Previously deployed migrations must not be rewritten.

### Media

Vercel Blob stores uploaded raster media. The application validates supported types and size limits, and checks references before allowing deletion.

## Trust boundaries

### Public boundary

Public forms and routes are untrusted input surfaces. Input is normalized and validated server-side before persistence or application processing.

### Administrative boundary

Administrative access depends on signed HTTP-only session state and an administrator email allowlist. UI visibility is not treated as authorization; protected writes must enforce authorization server-side.

### External services

Neon and Vercel Blob credentials are supplied only through deployment environment variables. Secrets must never be embedded in source, examples, client bundles, logs, or documentation.

## Data integrity rules

Important invariants include:

- unique normalized slugs where required;
- database-generated identifiers for new records;
- referenced media cannot be deleted;
- admissions internal notes are never exposed publicly;
- destructive CMS operations require explicit confirmation;
- administrative create/update/delete activity is recorded;
- multilingual fields remain aligned during schema evolution and backfills.

## Availability and failure behaviour

The public content layer contains controlled fallback content so the public experience can remain understandable when persistence is temporarily unavailable. Database-backed administrative operations should fail explicitly rather than pretending a write succeeded.

## Quality gates

Every pull request should pass:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Changes affecting persistence, authentication, publishing, admissions, or media must also be manually or automatically exercised against the relevant non-production service dependencies.

## Deployment

The intended production platform is Vercel with:

- Next.js runtime/functions;
- Neon Postgres;
- Vercel Blob;
- environment-specific secrets configured outside GitHub.

Production deployment should follow a reviewed commit on `main` and should not require committing environment-specific configuration.
