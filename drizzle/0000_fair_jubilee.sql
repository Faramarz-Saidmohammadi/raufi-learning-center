CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`title_fa` text NOT NULL,
	`title_en` text NOT NULL,
	`excerpt_fa` text NOT NULL,
	`excerpt_en` text NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`published_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title_fa` text NOT NULL,
	`title_en` text NOT NULL,
	`description_fa` text NOT NULL,
	`description_en` text NOT NULL,
	`category_fa` text NOT NULL,
	`category_en` text NOT NULL,
	`icon` text DEFAULT 'book' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`interest` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `courses` (`id`,`slug`,`title_fa`,`title_en`,`description_fa`,`description_en`,`category_fa`,`category_en`,`icon`,`published`,`sort_order`) VALUES
('kankor','kankor-preparation','آمادگی کانکور','Kankor Preparation','آمادگی هدفمند، تمرین منظم و آزمون‌های آزمایشی برای رسیدن به نتیجه بهتر در کانکور.','Focused preparation, structured practice and mock exams for stronger Kankor performance.','برنامه اصلی','Core programme','target',1,1),
('english','english-language','زبان انگلیسی','English Language','آموزش مرحله‌به‌مرحله مهارت‌های گفتاری، واژگان، گرامر و درک مطلب.','Step-by-step speaking, vocabulary, grammar and comprehension development.','زبان','Language','message',1,2),
('computer','computer-icdl','کمپیوتر و ICDL','Computer & ICDL','مهارت‌های عملی کمپیوتر برای درس، کار و استفاده مؤثر از ابزارهای دیجیتال.','Practical computer skills for study, work and confident use of digital tools.','مهارت مسلکی','Professional skill','computer',1,3),
('science','science-subjects','مضامین ساینسی','Science Subjects','آموزش مفهومی و حل تمرین در مضامین مهم ساینسی مکتب و آمادگی کانکور.','Concept-led teaching and problem solving in key school and Kankor science subjects.','تقویتی','Academic support','science',1,4),
('quickbooks','quickbooks','QuickBooks','QuickBooks','آموزش کاربردی حسابداری کمپیوترایز و مدیریت معاملات روزمره کسب‌وکار.','Practical computerised accounting and day-to-day business transaction management.','مهارت مسلکی','Professional skill','chart',1,5),
('web','web-design','Web Design','Web Design','آشنایی عملی با ساخت و طراحی صفحات وب و مهارت‌های ابتدایی بازار کار دیجیتال.','Hands-on website design foundations and entry-level digital career skills.','تکنالوژی','Technology','code',1,6);
--> statement-breakpoint
INSERT INTO `announcements` (`id`,`title_fa`,`title_en`,`excerpt_fa`,`excerpt_en`,`published`,`published_at`) VALUES
('registration','نام‌نویسی برنامه‌های آموزشی جریان دارد','Enrolment is open','برای دریافت زمان‌بندی جدید صنوف و مشوره رایگان با بخش معلومات تماس بگیرید.','Contact the information desk for current class schedules and enrolment guidance.',1,'2026-08-01'),
('consultation','مشوره انتخاب برنامه آموزشی','Programme guidance','برای انتخاب برنامه مناسب کانکور، زبان یا کمپیوتر می‌توانید به مرکز مراجعه نمایید.','Visit the centre for guidance on choosing a Kankor, English or computer programme.',1,'2026-07-20');
--> statement-breakpoint
INSERT INTO `site_settings` (`key`,`value`) VALUES
('phone','+93 79 672 2727'),
('addressFa','هرات، چهارراه آمریت، سمت جنوب'),
('addressEn','South of Chaharrah-e-Amriat, Herat, Afghanistan'),
('telegram','https://t.me/+QIzBaY9ZThllM2M1'),
('instagram','https://www.instagram.com/raufi_2727/'),
('facebook','https://www.facebook.com/rauficenter/');
