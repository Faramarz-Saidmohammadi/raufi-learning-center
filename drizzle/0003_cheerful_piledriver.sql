CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt_fa` text DEFAULT '' NOT NULL,
	`alt_en` text DEFAULT '' NOT NULL,
	`alt_ps` text DEFAULT '' NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_object_key_unique` ON `media_assets` (`object_key`);--> statement-breakpoint
CREATE TABLE `page_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`section_key` text NOT NULL,
	`type` text DEFAULT 'richText' NOT NULL,
	`name` text NOT NULL,
	`eyebrow_fa` text DEFAULT '' NOT NULL,
	`eyebrow_en` text DEFAULT '' NOT NULL,
	`eyebrow_ps` text DEFAULT '' NOT NULL,
	`heading_fa` text DEFAULT '' NOT NULL,
	`heading_en` text DEFAULT '' NOT NULL,
	`heading_ps` text DEFAULT '' NOT NULL,
	`body_fa` text DEFAULT '' NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`body_ps` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`secondary_image_url` text DEFAULT '' NOT NULL,
	`image_alt_fa` text DEFAULT '' NOT NULL,
	`image_alt_en` text DEFAULT '' NOT NULL,
	`image_alt_ps` text DEFAULT '' NOT NULL,
	`cta_label_fa` text DEFAULT '' NOT NULL,
	`cta_label_en` text DEFAULT '' NOT NULL,
	`cta_label_ps` text DEFAULT '' NOT NULL,
	`cta_url` text DEFAULT '' NOT NULL,
	`nav_label_fa` text DEFAULT '' NOT NULL,
	`nav_label_en` text DEFAULT '' NOT NULL,
	`nav_label_ps` text DEFAULT '' NOT NULL,
	`items_json` text DEFAULT '[]' NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`show_in_nav` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_sections_page_key_unique` ON `page_sections` (`page_id`,`section_key`);--> statement-breakpoint
CREATE TABLE `site_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title_fa` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ps` text NOT NULL,
	`description_fa` text DEFAULT '' NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`description_ps` text DEFAULT '' NOT NULL,
	`nav_label_fa` text DEFAULT '' NOT NULL,
	`nav_label_en` text DEFAULT '' NOT NULL,
	`nav_label_ps` text DEFAULT '' NOT NULL,
	`is_home` integer DEFAULT false NOT NULL,
	`show_in_nav` integer DEFAULT true NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_pages_slug_unique` ON `site_pages` (`slug`);--> statement-breakpoint
INSERT INTO `site_pages` (`id`,`slug`,`title_fa`,`title_en`,`title_ps`,`nav_label_fa`,`nav_label_en`,`nav_label_ps`,`is_home`,`show_in_nav`,`published`,`sort_order`) VALUES
('home','home','آموزشگاه رؤفی','Raufi Learning Center','د رؤفي ښوونیز مرکز','خانه','Home','کور',1,0,1,0);--> statement-breakpoint
INSERT INTO `page_sections` (`id`,`page_id`,`section_key`,`type`,`name`,`image_url`,`secondary_image_url`,`nav_label_fa`,`nav_label_en`,`nav_label_ps`,`show_in_nav`,`published`,`sort_order`) VALUES
('home-hero','home','hero','hero','Hero','/images/raufi-hero.webp','','','','',0,1,10),
('home-facts','home','facts','stats','Facts','','','','','',0,1,20),
('home-programmes','home','programmes','programmes','Programmes','','','برنامه‌ها','Programmes','پروګرامونه',1,1,30),
('home-about','home','about','about','About Raufi','/images/raufi-classroom.webp','','درباره رؤفی','About Raufi','د رؤفي په اړه',1,1,40),
('home-finder','home','finder','finder','Programme finder','','','','','',0,1,50),
('home-advantages','home','advantages','advantages','Learning model','/images/raufi-classroom.webp','','روش آموزش','Learning model','د زده‌کړې طریقه',1,1,60),
('home-journey','home','journey','journey','Student journey','','','','','',0,1,70),
('home-support','home','support','support','Student services','','','','','',0,1,80),
('home-environment','home','environment','environment','Learning environment','/images/raufi-hero.webp','/images/raufi-classroom.webp','','','',0,1,90),
('home-schedule','home','schedule','schedule','Class schedule','','','زمان‌بندی','Schedule','مهالوېش',1,1,100),
('home-news','home','news','announcements','Announcements','','','اطلاعیه‌ها','Updates','خبرتیاوې',1,1,110),
('home-faq','home','faq','faq','Frequently asked questions','','','سوالات','FAQ','پوښتنې',1,1,120),
('home-enrolment','home','enrolment','contact','Advice and enrolment','','','','','',0,1,130);
