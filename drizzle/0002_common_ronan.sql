CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`actor_email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `announcements` ADD `title_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `announcements` ADD `excerpt_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `class_schedules` ADD `course_title_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `class_schedules` ADD `days_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `class_schedules` ADD `seats_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `title_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `description_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `category_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `duration_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `level_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `format_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `outcomes_fa` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `outcomes_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `outcomes_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `faqs` ADD `question_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `faqs` ADD `answer_ps` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `source_language` text DEFAULT 'fa' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `consent_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `admin_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
UPDATE `courses` SET `title_ps`='د کانکور چمتووالی',`description_ps`='هدفمنده چمتووالی، د معیاري پوښتنو حل، منظم تکرار او آزمایښتي ازموینې د کانکور د غوره پایلې لپاره.',`category_ps`='کانکور',`duration_ps`='د پروګرام له مخې',`level_ps`='د کانکور کچه',`format_ps`='حضوري',`outcomes_fa`='حل سوالات معیاری|مرور هدفمند مضامین|آزمون و بررسی پیشرفت',`outcomes_en`='Standard question practice|Focused subject revision|Mock exams and progress review',`outcomes_ps`='د معیاري پوښتنو تمرین|د مضمونونو هدفمند تکرار|آزمایښتي ازموینې او د پرمختګ ارزونه' WHERE `slug`='kankor-preparation';--> statement-breakpoint
UPDATE `courses` SET `title_ps`='انګلیسي ژبه',`description_ps`='د خبرو، اورېدلو، لغتونو، ګرامر او لوست د پوهې وده د عملي او کچه‌بندۍ زده‌کړې له لارې.',`category_ps`='ژبه',`duration_ps`='د کچې له مخې',`level_ps`='بېلابېلې کچې',`format_ps`='حضوري',`outcomes_fa`='گفتار و شنیدار کاربردی|واژگان و گرامر|درک مطلب و تمرین',`outcomes_en`='Practical speaking and listening|Vocabulary and grammar|Comprehension and practice',`outcomes_ps`='عملي خبرې او اورېدنه|لغتونه او ګرامر|لوستل او تمرین' WHERE `slug`='english-language';--> statement-breakpoint
UPDATE `courses` SET `title_ps`='کمپیوټر او ICDL',`description_ps`='د زده‌کړې، کار او ډیجیټلي وسایلو د اغېزمن استعمال لپاره عملي کمپیوټري مهارتونه.',`category_ps`='کمپیوټر',`duration_ps`='د پروګرام له مخې',`level_ps`='له مقدماتي تر عملي',`format_ps`='عملي او حضوري',`outcomes_fa`='اساسات کمپیوتر و تایپ|Word، Excel و PowerPoint|انترنت، ایمیل و مدیریت فایل',`outcomes_en`='Computer foundations and typing|Word, Excel and PowerPoint|Internet, email and file management',`outcomes_ps`='د کمپیوټر اساسات او ټایپ|Word، Excel او PowerPoint|انټرنېټ، ایمیل او د فایلونو اداره' WHERE `slug`='computer-icdl';--> statement-breakpoint
UPDATE `courses` SET `title_ps`='ساینسي مضامین',`description_ps`='د مکتب او کانکور په مهمو ساینسي مضامینو کې مفهومي تدریس، د تمرینونو حل او علمي ملاتړ.',`category_ps`='د مکتب مضامین',`duration_ps`='د مضمون له مخې',`level_ps`='مکتب او کانکور',`format_ps`='حضوري',`outcomes_fa`='فهم مفهومی درس|حل تمرین مرحله‌به‌مرحله|آمادگی بهتر برای آزمون',`outcomes_en`='Conceptual understanding|Step-by-step problem solving|Stronger exam preparation',`outcomes_ps`='مفهومي پوهه|ګام په ګام د تمرین حل|د ازموینې غوره چمتووالی' WHERE `slug`='science-subjects';--> statement-breakpoint
UPDATE `courses` SET `title_ps`='د QuickBooks محاسبه',`description_ps`='د کار چاپېریال لپاره عملي کمپیوټري محاسبه او د ورځنیو معاملو ثبت او اداره.',`category_ps`='مسلکي مهارت',`duration_ps`='د پروګرام له مخې',`level_ps`='له مقدماتي تر عملي',`format_ps`='عملي او حضوري',`outcomes_fa`='ایجاد و تنظیم شرکت|ثبت خرید، فروش و مصارف|گزارش‌های اساسی مالی',`outcomes_en`='Company setup|Sales, purchases and expense entry|Essential financial reports',`outcomes_ps`='د شرکت جوړول او تنظیم|د پېر، پلور او لګښت ثبت|اساسي مالي راپورونه' WHERE `slug`='quickbooks';--> statement-breakpoint
UPDATE `courses` SET `title_ps`='وېب ډیزاین',`description_ps`='د وېب پاڼو د جوړولو عملي اساسات او د ډیجیټلي کار بازار لومړني مهارتونه.',`category_ps`='ټکنالوژي',`duration_ps`='د پروګرام له مخې',`level_ps`='مقدماتي',`format_ps`='حضوري او پروژه‌محور',`outcomes_fa`='ساختار صفحات وب|طراحی واکنش‌گرا|پروژه ابتدایی قابل نمایش',`outcomes_en`='Web page structure|Responsive design foundations|A presentable starter project',`outcomes_ps`='د وېب پاڼې جوړښت|د ځواب ویونکي ډیزاین اساسات|د ښودلو وړ لومړنۍ پروژه' WHERE `slug`='web-design';--> statement-breakpoint
UPDATE `announcements` SET `title_ps`='د ښوونیزو پروګرامونو نوم‌لیکنه روانه ده',`excerpt_ps`='د صنفونو تازه مهالوېش او د پروګرام د ټاکلو لارښوونې لپاره د معلوماتو څانګې سره اړیکه ونیسئ.' WHERE `id`='registration';--> statement-breakpoint
UPDATE `announcements` SET `title_ps`='د ښوونیز پروګرام د ټاکلو مشوره',`excerpt_ps`='له نوم‌لیکنې مخکې خپل هدف او اوسنۍ کچه وټاکئ او مناسب پروګرام غوره کړئ.' WHERE `id`='consultation';--> statement-breakpoint
UPDATE `faqs` SET `question_ps`='څنګه په یوه پروګرام کې نوم‌لیکنه وکړم؟',`answer_ps`='د وېبپاڼې د مشورې فورم ډک کړئ یا مرکز ته زنګ ووهئ. د مرکز همکاران به مهالوېش او د نوم‌لیکنې پړاوونه درته تشریح کړي.' WHERE `id`='faq-register';--> statement-breakpoint
UPDATE `faqs` SET `question_ps`='د صنفونو تازه مهالوېش له کومه ترلاسه کړم؟',`answer_ps`='د صنفونو مهالوېش او ظرفیت بدلېدلی شي. د وېبپاڼې مهالوېش وګورئ یا د تایید لپاره مرکز سره اړیکه ونیسئ.' WHERE `id`='faq-schedule';--> statement-breakpoint
UPDATE `faqs` SET `question_ps`='کوم پروګرام زما لپاره مناسب دی؟',`answer_ps`='د پروګرام موندونکي څخه کار واخلئ یا خپل ښوونیز هدف او اوسنۍ کچه له مرکز سره شریکه کړئ.' WHERE `id`='faq-choice';--> statement-breakpoint
UPDATE `faqs` SET `question_ps`='ښوونیز مرکز چېرته موقعیت لري؟',`answer_ps`='هرات، د آمریت څلورلارې، جنوب لور ته. د تګلارې لپاره مرکز ته زنګ وهلی شئ.' WHERE `id`='faq-location';--> statement-breakpoint
INSERT OR IGNORE INTO `site_settings` (`key`,`value`) VALUES
('addressPs','هرات، د آمریت څلورلارې، جنوب لور ته'),
('heroTitleFa','آینده‌ات را با آموزش هدفمند بساز.'),
('heroTitleEn','Build your future through purposeful learning.'),
('heroTitlePs','خپل راتلونکی په هدفمندې زده‌کړې جوړ کړئ.'),
('heroBodyFa','از آمادگی کانکور تا زبان انگلیسی، کمپیوتر و مهارت‌های مسلکی؛ با مسیر روشن، تمرین منظم و راهنمایی دوام‌دار.'),
('heroBodyEn','From Kankor preparation to English, computer and professional skills — with a clear path, consistent practice and ongoing guidance.'),
('heroBodyPs','د کانکور له چمتووالي تر انګلیسي، کمپیوټر او مسلکي مهارتونو؛ له روښانه لارې، منظم تمرین او دوامدارې لارښوونې سره.'),
('aboutTitleFa','آموزش هدفمند برای مکتب، کانکور و بازار کار'),
('aboutTitleEn','Purposeful learning for school, Kankor and work'),
('aboutTitlePs','د مکتب، کانکور او کار لپاره هدفمنده زده‌کړه'),
('aboutBodyFa','آموزشگاه رؤفی در هرات برنامه‌های کانکور، زبان انگلیسی، کمپیوتر و مهارت‌های کاربردی را با تمرکز بر فهم، تمرین و پیگیری پیشرفت ارائه می‌کند.'),
('aboutBodyEn','Raufi Learning Center in Herat offers Kankor, English, computer and practical skills programmes focused on understanding, practice and progress follow-up.'),
('aboutBodyPs','په هرات کې د رؤفي ښوونیز مرکز د کانکور، انګلیسي، کمپیوټر او عملي مهارتونو پروګرامونه د پوهې، تمرین او پرمختګ د څارنې پر بنسټ وړاندې کوي.'),
('registrationLabelFa','نام‌نویسی برنامه‌های جدید جریان دارد'),
('registrationLabelEn','Enrolment for new programmes is open'),
('registrationLabelPs','د نویو پروګرامونو نوم‌لیکنه روانه ده');
