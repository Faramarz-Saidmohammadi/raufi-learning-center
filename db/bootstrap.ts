import { sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS courses (
    id text PRIMARY KEY, slug text NOT NULL UNIQUE, title_fa text NOT NULL, title_en text NOT NULL,
    title_ps text NOT NULL DEFAULT '', description_fa text NOT NULL, description_en text NOT NULL,
    description_ps text NOT NULL DEFAULT '', category_fa text NOT NULL, category_en text NOT NULL,
    category_ps text NOT NULL DEFAULT '', duration_fa text NOT NULL DEFAULT '', duration_en text NOT NULL DEFAULT '',
    duration_ps text NOT NULL DEFAULT '', level_fa text NOT NULL DEFAULT '', level_en text NOT NULL DEFAULT '',
    level_ps text NOT NULL DEFAULT '', format_fa text NOT NULL DEFAULT '', format_en text NOT NULL DEFAULT '',
    format_ps text NOT NULL DEFAULT '', outcomes_fa text NOT NULL DEFAULT '', outcomes_en text NOT NULL DEFAULT '',
    outcomes_ps text NOT NULL DEFAULT '', icon text NOT NULL DEFAULT 'book', accent text NOT NULL DEFAULT '#1261a0',
    featured boolean NOT NULL DEFAULT false, published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id text PRIMARY KEY, title_fa text NOT NULL, title_en text NOT NULL, title_ps text NOT NULL DEFAULT '',
    excerpt_fa text NOT NULL, excerpt_en text NOT NULL, excerpt_ps text NOT NULL DEFAULT '',
    published boolean NOT NULL DEFAULT true, published_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id text PRIMARY KEY, name text NOT NULL, phone text NOT NULL, interest text NOT NULL,
    education_level text NOT NULL DEFAULT '', preferred_time text NOT NULL DEFAULT '', message text NOT NULL DEFAULT '',
    source_language text NOT NULL DEFAULT 'fa', consent_at text NOT NULL DEFAULT '', admin_note text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS class_schedules (
    id text PRIMARY KEY, course_title_fa text NOT NULL, course_title_en text NOT NULL, course_title_ps text NOT NULL DEFAULT '',
    days_fa text NOT NULL, days_en text NOT NULL, days_ps text NOT NULL DEFAULT '', time text NOT NULL,
    start_date text NOT NULL DEFAULT '', seats_fa text NOT NULL DEFAULT '', seats_en text NOT NULL DEFAULT '',
    seats_ps text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id text PRIMARY KEY, question_fa text NOT NULL, question_en text NOT NULL, question_ps text NOT NULL DEFAULT '',
    answer_fa text NOT NULL, answer_en text NOT NULL, answer_ps text NOT NULL DEFAULT '',
    published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    key text PRIMARY KEY, value text NOT NULL, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id text PRIMARY KEY, action text NOT NULL, entity text NOT NULL, entity_id text NOT NULL DEFAULT '',
    summary text NOT NULL DEFAULT '', actor_email text NOT NULL, created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS site_pages (
    id text PRIMARY KEY, slug text NOT NULL UNIQUE, title_fa text NOT NULL, title_en text NOT NULL, title_ps text NOT NULL,
    description_fa text NOT NULL DEFAULT '', description_en text NOT NULL DEFAULT '', description_ps text NOT NULL DEFAULT '',
    nav_label_fa text NOT NULL DEFAULT '', nav_label_en text NOT NULL DEFAULT '', nav_label_ps text NOT NULL DEFAULT '',
    is_home boolean NOT NULL DEFAULT false, show_in_nav boolean NOT NULL DEFAULT true, published boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS page_sections (
    id text PRIMARY KEY, page_id text NOT NULL, section_key text NOT NULL, type text NOT NULL DEFAULT 'richText', name text NOT NULL,
    eyebrow_fa text NOT NULL DEFAULT '', eyebrow_en text NOT NULL DEFAULT '', eyebrow_ps text NOT NULL DEFAULT '',
    heading_fa text NOT NULL DEFAULT '', heading_en text NOT NULL DEFAULT '', heading_ps text NOT NULL DEFAULT '',
    body_fa text NOT NULL DEFAULT '', body_en text NOT NULL DEFAULT '', body_ps text NOT NULL DEFAULT '',
    image_url text NOT NULL DEFAULT '', secondary_image_url text NOT NULL DEFAULT '', image_alt_fa text NOT NULL DEFAULT '',
    image_alt_en text NOT NULL DEFAULT '', image_alt_ps text NOT NULL DEFAULT '', cta_label_fa text NOT NULL DEFAULT '',
    cta_label_en text NOT NULL DEFAULT '', cta_label_ps text NOT NULL DEFAULT '', cta_url text NOT NULL DEFAULT '',
    nav_label_fa text NOT NULL DEFAULT '', nav_label_en text NOT NULL DEFAULT '', nav_label_ps text NOT NULL DEFAULT '',
    items_json text NOT NULL DEFAULT '[]', theme text NOT NULL DEFAULT 'light', show_in_nav boolean NOT NULL DEFAULT false,
    published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS page_sections_page_key_unique ON page_sections (page_id, section_key)`,
  `CREATE TABLE IF NOT EXISTS media_assets (
    id text PRIMARY KEY, object_key text NOT NULL UNIQUE, filename text NOT NULL, content_type text NOT NULL,
    size integer NOT NULL, alt_fa text NOT NULL DEFAULT '', alt_en text NOT NULL DEFAULT '', alt_ps text NOT NULL DEFAULT '',
    uploaded_by text NOT NULL, created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `INSERT INTO site_pages (
    id, slug, title_fa, title_en, title_ps, nav_label_fa, nav_label_en, nav_label_ps,
    is_home, show_in_nav, published, sort_order
  ) VALUES (
    'home', 'home', 'آموزشگاه رؤفی', 'Raufi Learning Center', 'د رؤفي ښوونیز مرکز',
    'خانه', 'Home', 'کور', true, false, true, 0
  ) ON CONFLICT (id) DO NOTHING`,
];

export async function initializeDatabase(database: Database) {
  for (const statement of schemaStatements) {
    await database.execute(sql.raw(statement));
  }
}
