# Raufi Learning Center

Production-oriented multilingual education website, CMS, and admissions CRM for Raufi Learning Center in Herat, Afghanistan.

The project combines a public student-facing experience with a protected administrative workspace and a typed server-side persistence layer. It is designed as a deployable product rather than a static marketing site.

## Product scope

### Public website

- Dari, English, and Pashto content with live RTL/LTR switching
- CMS-managed pages, navigation labels, SEO descriptions, and publish state
- Reorderable page sections with reusable hero, rich-text, image/text, statistics, and gallery layouts
- Searchable and filterable programme catalogue
- Programme comparison and guided programme finder
- Programme details with duration, level, format, and learning outcomes
- Schedule, announcements, FAQs, student journey, learning model, and support content
- Accessible admissions form with consent, validation, spam honeypot, and digit normalization
- Responsive navigation and conversion-focused student actions
- Dynamic metadata, Open Graph, JSON-LD, sitemap, and robots directives

### CMS and admissions CRM

- PBKDF2 administrator password verification and signed HTTP-only sessions
- Administrator email allowlist for protected writes
- Visual page and section management
- Trilingual CRUD for programmes, announcements, schedules, and FAQs
- Publish/draft controls, ordering, featured content, and duplicate-slug protection
- Vercel Blob media library with file validation and reference-aware deletion
- Admissions pipeline: `new → contacted → enrolled → closed`
- Search, filters, private administrator notes, consent/source tracking, and CSV export
- Activity history for administrative create, update, and delete operations

## Engineering stack

| Layer | Technology |
| --- | --- |
| Application | Next.js App Router, React 19, TypeScript |
| Persistence | Neon Postgres, Drizzle ORM |
| Media | Vercel Blob |
| Authentication | PBKDF2 password verification, signed HTTP-only sessions, administrator allowlist |
| Validation | Server-side parsing, normalization, limits, and explicit error responses |
| SEO | Next.js Metadata API, Open Graph, JSON-LD, sitemap, robots |
| Quality | TypeScript, ESLint, production build validation, GitHub Actions |

## Architecture and security

The application is deployed as a single Next.js system with explicit boundaries between public rendering, protected administration, persistence, and external media storage.

- [System architecture](docs/ARCHITECTURE.md)
- [Security policy](SECURITY.md)
- [Contribution workflow](CONTRIBUTING.md)

Core integrity rules include server-side authorization for protected writes, normalized unique slugs, database-generated identifiers, reference-aware media deletion, private admissions notes, and explicit confirmation for destructive administrative actions.

## Local development

Requirements:

- Node.js `>=22.13.0`
- Neon Postgres database
- Vercel Blob store

Install dependencies:

```bash
npm ci
```

Copy `.env.example` to `.env.local` and configure the required services:

```dotenv
ADMIN_EMAILS=admin@example.com,owner@example.com
ADMIN_PASSWORD_HASH=pbkdf2-sha256$210000$<salt>$<derived-key>
ADMIN_SESSION_SECRET=<at-least-32-random-characters>
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_<token>
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Generate an administrator password hash without storing the plaintext password in the repository:

```bash
ADMIN_PASSWORD="your-strong-password" npm run admin:hash-password
```

Start development:

```bash
npm run dev
```

## Database workflow

Schema definitions live in `db/schema.ts`.

After changing the schema:

```bash
npm run db:generate
```

Treat deployed migrations as immutable. Introduce a new migration and explicit backfill when an existing production schema must evolve.

## Quality gate

Before merge:

```bash
npm run typecheck
npm run lint
npm run build
```

The GitHub Actions workflow runs the same core quality checks for pull requests and updates to `main`.

Changes affecting database persistence, authentication, publishing, admissions, or Vercel Blob should additionally be exercised against the corresponding non-production service dependencies.

## Repository workflow

Development changes should be made on focused branches and reviewed through pull requests. The repository includes a pull-request checklist covering verification, security, migration impact, and deployment risk.

## Deployment

The intended production platform is Vercel with Neon Postgres and Vercel Blob. Production secrets belong in the deployment environment and must never be committed to GitHub.
