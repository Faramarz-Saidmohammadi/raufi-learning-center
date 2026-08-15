# Raufi Learning Center

A production-oriented education website and admissions CMS for Raufi Learning Center in Herat. The project combines a conversion-focused public experience with a protected content and admissions workspace, and is designed to demonstrate senior full-stack product engineering rather than a static portfolio mockup.

## Product capabilities

### Public website

- Complete Dari, English and Pashto experience with live RTL/LTR switching
- CMS-created pages with their own slugs, navigation labels, SEO descriptions and publish state
- Reorderable page sections with reusable hero, rich text, image/text, statistics and gallery layouts
- Searchable and filterable programme catalogue
- Side-by-side comparison for up to three programmes
- Programme details with duration, level, format and learning outcomes
- Guided programme finder for students who are unsure where to start
- About, learning model, student journey, support services, environment, schedule, announcements and FAQ sections
- Accessible admissions form with consent, validation, spam honeypot and digit normalization
- Responsive navigation, persistent conversion actions and official logo treatment
- Dynamic SEO metadata, Open Graph, JSON-LD, sitemap and robots directives

### Protected CMS and admissions CRM

- Application-owned administrator sessions with PBKDF2 password verification and signed cookies
- Visual page builder for creating, editing, reordering, publishing and deleting pages and sections
- Trilingual section content, calls to action, navigation labels, themes and reusable JSON item collections
- Media library backed by Vercel Blob with file-type/size validation and protected deletion
- Uploaded-image references are checked before an asset can be removed
- Trilingual CRUD for programmes, announcements, schedules and FAQs
- Publish/draft controls, ordering, featured programmes and duplicate-slug protection
- Centralized trilingual homepage, about and contact settings
- Admissions search and status filters
- Pipeline stages: new, contacted, enrolled and closed
- Private administrator notes, consent/source tracking and CSV export
- Immutable activity feed for create, update and delete events

## Architecture

| Layer | Implementation |
| --- | --- |
| UI | Next.js App Router, React 19, responsive CSS |
| Runtime | Native Next.js App Router on Vercel Functions |
| Persistence | Neon Postgres with Drizzle ORM plus Vercel Blob media storage |
| Authentication | PBKDF2 password verification, signed HTTP-only sessions and administrator allowlist |
| Validation | Server-side parsing, normalization, length limits and explicit error codes |
| SEO | Metadata API, Open Graph, JSON-LD, sitemap and robots routes |
| Quality | TypeScript, ESLint and production Next.js build validation |

## Security and data integrity

- Public and administrator APIs validate all inputs server-side.
- CMS writes require both an authenticated identity and an allowed administrator email.
- Database-generated IDs are used for new records.
- Programme slugs are normalized and protected from collisions.
- Page slugs and per-page section keys are normalized and protected from collisions.
- Uploaded images are limited to supported raster formats and 5 MB per file.
- Referenced media cannot be deleted until its section references are removed.
- Contact details are stored only after explicit consent.
- Internal notes are never rendered by the public site.
- Destructive CMS actions require a confirmation in the interface and are recorded in the audit log.

## Local development

Requirements: Node.js `>=22.13.0`, a Neon Postgres database and a Vercel Blob store.

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local`, then configure the database, Blob store, administrator credentials and public site URL:

```text
ADMIN_EMAILS=admin@example.com,owner@example.com
ADMIN_PASSWORD_HASH=pbkdf2-sha256$210000$<salt>$<derived-key>
ADMIN_SESSION_SECRET=<at-least-32-random-characters>
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_<token>
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Generate a password hash without storing the password in the repository:

```bash
ADMIN_PASSWORD="your-strong-password" npm run admin:hash-password
```

## Database workflow

Schema definitions live in `db/schema.ts`. The application safely creates missing tables on the first database-backed request. Generate an immutable migration after changing the schema:

```bash
npm run db:generate
```

Never rewrite a migration that has already been deployed. Add data backfills to the newly generated migration when a non-null multilingual field is introduced.

## Verification

```bash
npm run lint
npm test
```

`npm test` runs TypeScript checking, ESLint and a production Next.js build. Production verification should also cover sign-in, content CRUD, page publishing, admissions updates and Vercel Blob upload/delete behaviour.
