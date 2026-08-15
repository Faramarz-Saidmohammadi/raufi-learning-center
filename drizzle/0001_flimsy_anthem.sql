CREATE TABLE `class_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`course_title_fa` text NOT NULL,
	`course_title_en` text NOT NULL,
	`days_fa` text NOT NULL,
	`days_en` text NOT NULL,
	`time` text NOT NULL,
	`start_date` text DEFAULT '' NOT NULL,
	`seats_fa` text DEFAULT '' NOT NULL,
	`seats_en` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question_fa` text NOT NULL,
	`question_en` text NOT NULL,
	`answer_fa` text NOT NULL,
	`answer_en` text NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `courses` ADD `duration_fa` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `duration_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `level_fa` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `level_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `format_fa` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `format_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `accent` text DEFAULT '#1261a0' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `education_level` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `preferred_time` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به برنامه',`duration_en`='Programme based',`level_fa`='آمادگی کانکور',`level_en`='Kankor level',`format_fa`='حضوری',`format_en`='In person',`accent`='#0b5d8f',`featured`=1 WHERE `slug`='kankor-preparation';--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به سطح',`duration_en`='Level based',`level_fa`='سطوح مختلف',`level_en`='Multiple levels',`format_fa`='حضوری',`format_en`='In person',`accent`='#1d77a8',`featured`=1 WHERE `slug`='english-language';--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به برنامه',`duration_en`='Programme based',`level_fa`='مقدماتی تا کاربردی',`level_en`='Beginner to practical',`format_fa`='حضوری و عملی',`format_en`='In-person practical',`accent`='#176b87',`featured`=1 WHERE `slug`='computer-icdl';--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به مضمون',`duration_en`='Subject based',`level_fa`='مکتب و کانکور',`level_en`='School and Kankor',`format_fa`='حضوری',`format_en`='In person',`accent`='#287d6b' WHERE `slug`='science-subjects';--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به برنامه',`duration_en`='Programme based',`level_fa`='مقدماتی',`level_en`='Foundation',`format_fa`='حضوری و عملی',`format_en`='In-person practical',`accent`='#b7791f' WHERE `slug`='quickbooks';--> statement-breakpoint
UPDATE `courses` SET `duration_fa`='نظر به برنامه',`duration_en`='Programme based',`level_fa`='مقدماتی',`level_en`='Foundation',`format_fa`='حضوری و پروژه‌محور',`format_en`='In-person projects',`accent`='#6b5aa6' WHERE `slug`='web-design';--> statement-breakpoint
INSERT INTO `faqs` (`id`,`question_fa`,`question_en`,`answer_fa`,`answer_en`,`published`,`sort_order`) VALUES
('faq-register','چگونه نام‌نویسی کنم؟','How do I enrol?','فورم مشوره را در همین صفحه بفرستید یا با بخش معلومات تماس بگیرید. همکاران مرکز زمان‌بندی و مراحل نام‌نویسی را با شما شریک می‌کنند.','Submit the enquiry form on this page or call the information desk. The centre will share the current schedule and enrolment steps.',1,1),
('faq-schedule','زمان صنوف را از کجا بدانم؟','Where can I find class times?','جدول صنوف در وبسایت توسط مدیریت به‌روزرسانی می‌شود. برای تایید نهایی زمان و ظرفیت، پیش از مراجعه با مرکز تماس بگیرید.','Class times are updated by the centre. Call before visiting to confirm the final schedule and current availability.',1,2),
('faq-choice','کدام برنامه برای من مناسب است؟','Which programme is right for me?','از راهنمای انتخاب برنامه در وبسایت استفاده کنید یا برای بررسی هدف، سطح و زمان مناسب خود درخواست مشوره بفرستید.','Use the programme finder on the website or request guidance so the centre can consider your goal, level and preferred time.',1,3),
('faq-location','آموزشگاه در کجا موقعیت دارد؟','Where is the centre located?','آموزشگاه رؤفی در هرات، چهارراه آمریت، سمت جنوب موقعیت دارد. برای راهنمایی مسیر می‌توانید با مرکز تماس بگیرید.','Raufi Learning Center is south of Chaharrah-e-Amriat in Herat. Call the centre if you need directions.',1,4);
