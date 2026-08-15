import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { announcements, classSchedules, courses, faqs, pageSections, sitePages, siteSettings } from "@/db/schema";

export type Course = typeof courses.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type ClassSchedule = typeof classSchedules.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type SitePage = typeof sitePages.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type PublicContent = {
  courses: Course[];
  announcements: Announcement[];
  schedules: ClassSchedule[];
  faqs: Faq[];
  pages: SitePage[];
  sections: PageSection[];
  settings: Record<string,string>;
};

const common={published:true,createdAt:"",updatedAt:""};

export const fallbackCourses: Course[] = [
  {
    ...common,id:"kankor",slug:"kankor-preparation",sortOrder:1,icon:"target",accent:"#0b5d8f",featured:true,
    titleFa:"آمادگی کانکور",titleEn:"Kankor Preparation",titlePs:"د کانکور چمتووالی",
    descriptionFa:"آمادگی هدفمند، حل سوالات معیاری، مرور منظم و آزمون‌های آزمایشی برای نتیجه بهتر در کانکور.",descriptionEn:"Focused preparation, standard question practice, structured revision and mock exams for stronger Kankor performance.",descriptionPs:"هدفمنده چمتووالی، د معیاري پوښتنو حل، منظم تکرار او آزمایښتي ازموینې د کانکور د غوره پایلې لپاره.",
    categoryFa:"کانکور",categoryEn:"Kankor",categoryPs:"کانکور",durationFa:"نظر به برنامه",durationEn:"Programme based",durationPs:"د پروګرام له مخې",levelFa:"آمادگی کانکور",levelEn:"Kankor level",levelPs:"د کانکور کچه",formatFa:"حضوری",formatEn:"In person",formatPs:"حضوري",
    outcomesFa:"حل سوالات معیاری|مرور هدفمند مضامین|آزمون و بررسی پیشرفت",outcomesEn:"Standard question practice|Focused subject revision|Mock exams and progress review",outcomesPs:"د معیاري پوښتنو تمرین|د مضمونونو هدفمند تکرار|آزمایښتي ازموینې او د پرمختګ ارزونه",
  },
  {
    ...common,id:"english",slug:"english-language",sortOrder:2,icon:"message",accent:"#1d77a8",featured:true,
    titleFa:"زبان انگلیسی",titleEn:"English Language",titlePs:"انګلیسي ژبه",
    descriptionFa:"تقویت گفتار، شنیدار، واژگان، گرامر و درک مطلب با تمرین‌های کاربردی و سطح‌بندی‌شده.",descriptionEn:"Develop speaking, listening, vocabulary, grammar and comprehension through practical level-based learning.",descriptionPs:"د خبرو، اورېدلو، لغتونو، ګرامر او لوست د پوهې وده د عملي او کچه‌بندۍ زده‌کړې له لارې.",
    categoryFa:"زبان",categoryEn:"Language",categoryPs:"ژبه",durationFa:"نظر به سطح",durationEn:"Level based",durationPs:"د کچې له مخې",levelFa:"سطح‌بندی‌شده",levelEn:"Multiple levels",levelPs:"بېلابېلې کچې",formatFa:"حضوری",formatEn:"In person",formatPs:"حضوري",
    outcomesFa:"گفتار و شنیدار کاربردی|واژگان و گرامر|درک مطلب و تمرین",outcomesEn:"Practical speaking and listening|Vocabulary and grammar|Comprehension and practice",outcomesPs:"عملي خبرې او اورېدنه|لغتونه او ګرامر|لوستل او تمرین",
  },
  {
    ...common,id:"computer",slug:"computer-icdl",sortOrder:3,icon:"computer",accent:"#176b87",featured:true,
    titleFa:"کمپیوتر و ICDL",titleEn:"Computer & ICDL",titlePs:"کمپیوټر او ICDL",
    descriptionFa:"مهارت‌های عملی کمپیوتر برای درس، وظیفه و استفاده مؤثر از ابزارهای دیجیتال.",descriptionEn:"Practical computer skills for study, work and confident use of essential digital tools.",descriptionPs:"د زده‌کړې، کار او ډیجیټلي وسایلو د اغېزمن استعمال لپاره عملي کمپیوټري مهارتونه.",
    categoryFa:"کمپیوتر",categoryEn:"Computer",categoryPs:"کمپیوټر",durationFa:"نظر به برنامه",durationEn:"Programme based",durationPs:"د پروګرام له مخې",levelFa:"مقدماتی تا کاربردی",levelEn:"Beginner to practical",levelPs:"له مقدماتي تر عملي",formatFa:"عملی و حضوری",formatEn:"Hands-on, in person",formatPs:"عملي او حضوري",
    outcomesFa:"اساسات کمپیوتر و تایپ|Word، Excel و PowerPoint|انترنت، ایمیل و مدیریت فایل",outcomesEn:"Computer foundations and typing|Word, Excel and PowerPoint|Internet, email and file management",outcomesPs:"د کمپیوټر اساسات او ټایپ|Word، Excel او PowerPoint|انټرنېټ، ایمیل او د فایلونو اداره",
  },
  {
    ...common,id:"science",slug:"science-subjects",sortOrder:4,icon:"science",accent:"#287d6b",featured:false,
    titleFa:"مضامین ساینسی",titleEn:"Science Subjects",titlePs:"ساینسي مضامین",
    descriptionFa:"آموزش مفهومی، حل تمرین و رفع اشکال در مضامین مهم ساینسی مکتب و کانکور.",descriptionEn:"Concept-led teaching, problem solving and academic support in key science subjects.",descriptionPs:"د مکتب او کانکور په مهمو ساینسي مضامینو کې مفهومي تدریس، د تمرینونو حل او علمي ملاتړ.",
    categoryFa:"مضامین مکتب",categoryEn:"School subjects",categoryPs:"د مکتب مضامین",durationFa:"نظر به مضمون",durationEn:"Subject based",durationPs:"د مضمون له مخې",levelFa:"مکتب و کانکور",levelEn:"School and Kankor",levelPs:"مکتب او کانکور",formatFa:"حضوری",formatEn:"In person",formatPs:"حضوري",
    outcomesFa:"فهم مفهومی درس|حل تمرین مرحله‌به‌مرحله|آمادگی بهتر برای آزمون",outcomesEn:"Conceptual understanding|Step-by-step problem solving|Stronger exam preparation",outcomesPs:"مفهومي پوهه|ګام په ګام د تمرین حل|د ازموینې غوره چمتووالی",
  },
  {
    ...common,id:"quickbooks",slug:"quickbooks",sortOrder:5,icon:"chart",accent:"#b7791f",featured:false,
    titleFa:"حسابداری QuickBooks",titleEn:"QuickBooks Accounting",titlePs:"د QuickBooks محاسبه",
    descriptionFa:"آموزش کاربردی حسابداری کمپیوترایز و ثبت معاملات روزمره برای محیط واقعی کار.",descriptionEn:"Practical computerised accounting and everyday transaction management for workplace readiness.",descriptionPs:"د کار چاپېریال لپاره عملي کمپیوټري محاسبه او د ورځنیو معاملو ثبت او اداره.",
    categoryFa:"مهارت مسلکی",categoryEn:"Professional skill",categoryPs:"مسلکي مهارت",durationFa:"نظر به برنامه",durationEn:"Programme based",durationPs:"د پروګرام له مخې",levelFa:"مقدماتی تا کاربردی",levelEn:"Beginner to practical",levelPs:"له مقدماتي تر عملي",formatFa:"عملی و حضوری",formatEn:"Hands-on, in person",formatPs:"عملي او حضوري",
    outcomesFa:"ایجاد و تنظیم شرکت|ثبت خرید، فروش و مصارف|گزارش‌های اساسی مالی",outcomesEn:"Company setup|Sales, purchases and expense entry|Essential financial reports",outcomesPs:"د شرکت جوړول او تنظیم|د پېر، پلور او لګښت ثبت|اساسي مالي راپورونه",
  },
  {
    ...common,id:"web",slug:"web-design",sortOrder:6,icon:"code",accent:"#6b5aa6",featured:false,
    titleFa:"طراحی وب",titleEn:"Web Design",titlePs:"وېب ډیزاین",
    descriptionFa:"آشنایی عملی با ساخت صفحات وب و مهارت‌های ابتدایی مورد نیاز بازار کار دیجیتال.",descriptionEn:"Hands-on website design foundations and entry-level skills for the digital job market.",descriptionPs:"د وېب پاڼو د جوړولو عملي اساسات او د ډیجیټلي کار بازار لومړني مهارتونه.",
    categoryFa:"تکنالوژی",categoryEn:"Technology",categoryPs:"ټکنالوژي",durationFa:"نظر به برنامه",durationEn:"Programme based",durationPs:"د پروګرام له مخې",levelFa:"مقدماتی",levelEn:"Foundation",levelPs:"مقدماتي",formatFa:"حضوری و پروژه‌محور",formatEn:"In-person projects",formatPs:"حضوري او پروژه‌محور",
    outcomesFa:"ساختار صفحات وب|طراحی واکنش‌گرا|پروژه ابتدایی قابل نمایش",outcomesEn:"Web page structure|Responsive design foundations|A presentable starter project",outcomesPs:"د وېب پاڼې جوړښت|د ځواب ویونکي ډیزاین اساسات|د ښودلو وړ لومړنۍ پروژه",
  },
];

export const fallbackAnnouncements: Announcement[] = [
  {...common,id:"registration",titleFa:"نام‌نویسی برنامه‌های آموزشی جریان دارد",titleEn:"Enrolment is open",titlePs:"د ښوونیزو پروګرامونو نوم‌لیکنه روانه ده",excerptFa:"برای دریافت زمان‌بندی تازه صنوف و مشوره انتخاب برنامه با بخش معلومات تماس بگیرید.",excerptEn:"Contact the information desk for current class schedules and programme guidance.",excerptPs:"د صنفونو تازه مهالوېش او د پروګرام د ټاکلو لارښوونې لپاره د معلوماتو څانګې سره اړیکه ونیسئ.",publishedAt:"2026-08-01"},
  {...common,id:"consultation",titleFa:"مشوره انتخاب برنامه آموزشی",titleEn:"Programme guidance",titlePs:"د ښوونیز پروګرام د ټاکلو مشوره",excerptFa:"پیش از نام‌نویسی، هدف و سطح خود را مشخص کرده و برنامه مناسب را انتخاب نمایید.",excerptEn:"Define your goal and current level before choosing the right programme.",excerptPs:"له نوم‌لیکنې مخکې خپل هدف او اوسنۍ کچه وټاکئ او مناسب پروګرام غوره کړئ.",publishedAt:"2026-07-20"},
];

export const fallbackFaqs: Faq[] = [
  {...common,id:"faq-register",sortOrder:1,questionFa:"چگونه در یک برنامه نام‌نویسی کنم؟",questionEn:"How do I enrol in a programme?",questionPs:"څنګه په یوه پروګرام کې نوم‌لیکنه وکړم؟",answerFa:"فورم مشوره را در وبسایت خانه‌پری کنید یا با شماره مرکز تماس بگیرید. همکاران مرکز، زمان‌بندی و مراحل نام‌نویسی را برای‌تان توضیح می‌دهند.",answerEn:"Complete the website enquiry form or call the centre. The team will explain the current schedule and enrolment steps.",answerPs:"د وېبپاڼې د مشورې فورم ډک کړئ یا مرکز ته زنګ ووهئ. د مرکز همکاران به مهالوېش او د نوم‌لیکنې پړاوونه درته تشریح کړي."},
  {...common,id:"faq-schedule",sortOrder:2,questionFa:"زمان‌بندی تازه صنوف را از کجا دریافت کنم؟",questionEn:"Where can I get the latest class schedule?",questionPs:"د صنفونو تازه مهالوېش له کومه ترلاسه کړم؟",answerFa:"زمان‌بندی و ظرفیت صنوف ممکن است تغییر کند. بخش زمان‌بندی وبسایت را ببینید یا برای معلومات قطعی با مرکز تماس بگیرید.",answerEn:"Schedules and availability may change. Check the schedule section or contact the centre for confirmation.",answerPs:"د صنفونو مهالوېش او ظرفیت بدلېدلی شي. د وېبپاڼې مهالوېش وګورئ یا د تایید لپاره مرکز سره اړیکه ونیسئ."},
  {...common,id:"faq-choice",sortOrder:3,questionFa:"کدام برنامه برای من مناسب است؟",questionEn:"Which programme is right for me?",questionPs:"کوم پروګرام زما لپاره مناسب دی؟",answerFa:"از بخش «برنامه مناسب من» استفاده کنید یا برای مشوره، هدف آموزشی و سطح فعلی خود را با مرکز شریک سازید.",answerEn:"Use the programme finder or speak with the centre about your learning goal and current level.",answerPs:"د پروګرام موندونکي څخه کار واخلئ یا خپل ښوونیز هدف او اوسنۍ کچه له مرکز سره شریکه کړئ."},
  {...common,id:"faq-location",sortOrder:4,questionFa:"آموزشگاه در کجا موقعیت دارد؟",questionEn:"Where is the centre located?",questionPs:"ښوونیز مرکز چېرته موقعیت لري؟",answerFa:"هرات، چهارراه آمریت، سمت جنوب. پیش از مراجعه می‌توانید برای راهنمایی تماس بگیرید.",answerEn:"South of Chaharrah-e-Amriat, Herat. Call the centre if you need directions before visiting.",answerPs:"هرات، د آمریت څلورلارې، جنوب لور ته. د تګلارې لپاره مرکز ته زنګ وهلی شئ."},
];

export const fallbackSettings: Record<string,string> = {
  phone:"+93 79 672 2727",
  addressFa:"هرات، چهارراه آمریت، سمت جنوب",
  addressEn:"South of Chaharrah-e-Amriat, Herat, Afghanistan",
  addressPs:"هرات، د آمریت څلورلارې، جنوب لور ته",
  telegram:"https://t.me/+QIzBaY9ZThllM2M1",
  instagram:"https://www.instagram.com/raufi_2727/",
  facebook:"https://www.facebook.com/rauficenter/",
  heroTitleFa:"آینده‌ات را با آموزش هدفمند بساز.",
  heroTitleEn:"Build your future through purposeful learning.",
  heroTitlePs:"خپل راتلونکی په هدفمندې زده‌کړې جوړ کړئ.",
  heroBodyFa:"از آمادگی کانکور تا زبان انگلیسی، کمپیوتر و مهارت‌های مسلکی؛ با مسیر روشن، تمرین منظم و راهنمایی دوام‌دار.",
  heroBodyEn:"From Kankor preparation to English, computer and professional skills — with a clear path, consistent practice and ongoing guidance.",
  heroBodyPs:"د کانکور له چمتووالي تر انګلیسي، کمپیوټر او مسلکي مهارتونو؛ له روښانه لارې، منظم تمرین او دوامدارې لارښوونې سره.",
  aboutTitleFa:"آموزش هدفمند برای مکتب، کانکور و بازار کار",
  aboutTitleEn:"Purposeful learning for school, Kankor and work",
  aboutTitlePs:"د مکتب، کانکور او کار لپاره هدفمنده زده‌کړه",
  aboutBodyFa:"آموزشگاه رؤفی در هرات برنامه‌های کانکور، زبان انگلیسی، کمپیوتر و مهارت‌های کاربردی را با تمرکز بر فهم، تمرین و پیگیری پیشرفت ارائه می‌کند.",
  aboutBodyEn:"Raufi Learning Center in Herat offers Kankor, English, computer and practical skills programmes focused on understanding, practice and progress follow-up.",
  aboutBodyPs:"په هرات کې د رؤفي ښوونیز مرکز د کانکور، انګلیسي، کمپیوټر او عملي مهارتونو پروګرامونه د پوهې، تمرین او پرمختګ د څارنې پر بنسټ وړاندې کوي.",
  registrationLabelFa:"نام‌نویسی برنامه‌های جدید جریان دارد",
  registrationLabelEn:"Enrolment for new programmes is open",
  registrationLabelPs:"د نویو پروګرامونو نوم‌لیکنه روانه ده",
};

const defaultPageBase={descriptionFa:"",descriptionEn:"",descriptionPs:"",isHome:true,showInNav:false,published:true,sortOrder:0,createdAt:"",updatedAt:""};
export const fallbackPages:SitePage[]=[{...defaultPageBase,id:"home",slug:"home",titleFa:"آموزشگاه رؤفی",titleEn:"Raufi Learning Center",titlePs:"د رؤفي ښوونیز مرکز",navLabelFa:"خانه",navLabelEn:"Home",navLabelPs:"کور"}];

const defaultSectionBase={pageId:"home",eyebrowFa:"",eyebrowEn:"",eyebrowPs:"",headingFa:"",headingEn:"",headingPs:"",bodyFa:"",bodyEn:"",bodyPs:"",imageUrl:"",secondaryImageUrl:"",imageAltFa:"",imageAltEn:"",imageAltPs:"",ctaLabelFa:"",ctaLabelEn:"",ctaLabelPs:"",ctaUrl:"",navLabelFa:"",navLabelEn:"",navLabelPs:"",itemsJson:"[]",theme:"light",showInNav:false,published:true,createdAt:"",updatedAt:""};
export const fallbackSections:PageSection[]=[
  {...defaultSectionBase,id:"home-hero",sectionKey:"hero",type:"hero",name:"Hero",imageUrl:"/images/raufi-hero.webp",sortOrder:10},
  {...defaultSectionBase,id:"home-facts",sectionKey:"facts",type:"stats",name:"Facts",sortOrder:20},
  {...defaultSectionBase,id:"home-programmes",sectionKey:"programmes",type:"programmes",name:"Programmes",showInNav:true,navLabelFa:"برنامه‌ها",navLabelEn:"Programmes",navLabelPs:"پروګرامونه",sortOrder:30},
  {...defaultSectionBase,id:"home-about",sectionKey:"about",type:"about",name:"About Raufi",imageUrl:"/images/raufi-classroom.webp",showInNav:true,navLabelFa:"درباره رؤفی",navLabelEn:"About Raufi",navLabelPs:"د رؤفي په اړه",sortOrder:40},
  {...defaultSectionBase,id:"home-finder",sectionKey:"finder",type:"finder",name:"Programme finder",sortOrder:50},
  {...defaultSectionBase,id:"home-advantages",sectionKey:"advantages",type:"advantages",name:"Learning model",imageUrl:"/images/raufi-classroom.webp",showInNav:true,navLabelFa:"روش آموزش",navLabelEn:"Learning model",navLabelPs:"د زده‌کړې طریقه",sortOrder:60},
  {...defaultSectionBase,id:"home-journey",sectionKey:"journey",type:"journey",name:"Student journey",sortOrder:70},
  {...defaultSectionBase,id:"home-support",sectionKey:"support",type:"support",name:"Student services",sortOrder:80},
  {...defaultSectionBase,id:"home-environment",sectionKey:"environment",type:"environment",name:"Learning environment",imageUrl:"/images/raufi-hero.webp",secondaryImageUrl:"/images/raufi-classroom.webp",sortOrder:90},
  {...defaultSectionBase,id:"home-schedule",sectionKey:"schedule",type:"schedule",name:"Class schedule",showInNav:true,navLabelFa:"زمان‌بندی",navLabelEn:"Schedule",navLabelPs:"مهالوېش",sortOrder:100},
  {...defaultSectionBase,id:"home-news",sectionKey:"news",type:"announcements",name:"Announcements",showInNav:true,navLabelFa:"اطلاعیه‌ها",navLabelEn:"Updates",navLabelPs:"خبرتیاوې",sortOrder:110},
  {...defaultSectionBase,id:"home-faq",sectionKey:"faq",type:"faq",name:"Frequently asked questions",showInNav:true,navLabelFa:"سوالات",navLabelEn:"FAQ",navLabelPs:"پوښتنې",sortOrder:120},
  {...defaultSectionBase,id:"home-enrolment",sectionKey:"enrolment",type:"contact",name:"Advice and enrolment",sortOrder:130},
];

export async function getPublicContent(): Promise<PublicContent> {
  try {
    const db=await getDb();
    const [courseRows,announcementRows,scheduleRows,faqRows,settingRows,pageRows,sectionRows]=await Promise.all([
      db.select().from(courses).where(eq(courses.published,true)).orderBy(asc(courses.sortOrder)),
      db.select().from(announcements).where(eq(announcements.published,true)).orderBy(desc(announcements.publishedAt)).limit(8),
      db.select().from(classSchedules).where(eq(classSchedules.published,true)).orderBy(asc(classSchedules.sortOrder)),
      db.select().from(faqs).where(eq(faqs.published,true)).orderBy(asc(faqs.sortOrder)),
      db.select().from(siteSettings),
      db.select().from(sitePages).where(eq(sitePages.published,true)).orderBy(asc(sitePages.sortOrder)),
      db.select().from(pageSections).where(eq(pageSections.published,true)).orderBy(asc(pageSections.sortOrder)),
    ]);
    const homeSections=sectionRows.filter(section=>section.pageId===(pageRows.find(page=>page.isHome)?.id??"home"));
    return {
      courses:courseRows.length?courseRows:fallbackCourses,
      announcements:announcementRows.length?announcementRows:fallbackAnnouncements,
      schedules:scheduleRows,
      faqs:faqRows.length?faqRows:fallbackFaqs,
      pages:pageRows.length?pageRows:fallbackPages,
      sections:homeSections.length?homeSections:fallbackSections,
      settings:{...fallbackSettings,...Object.fromEntries(settingRows.map(row=>[row.key,row.value]))},
    };
  } catch {
    return {courses:fallbackCourses,announcements:fallbackAnnouncements,schedules:[],faqs:fallbackFaqs,pages:fallbackPages,sections:fallbackSections,settings:fallbackSettings};
  }
}

export async function getPageBySlug(slug:string){
  try{
    const db=await getDb();
    const rows=await db.select().from(sitePages).where(eq(sitePages.slug,slug)).limit(1);
    const page=rows[0];if(!page?.published||page.isHome)return null;
    const [sections,allPages,settingRows]=await Promise.all([
      db.select().from(pageSections).where(eq(pageSections.pageId,page.id)).orderBy(asc(pageSections.sortOrder)),
      db.select().from(sitePages).where(eq(sitePages.published,true)).orderBy(asc(sitePages.sortOrder)),
      db.select().from(siteSettings),
    ]);
    return{page,sections:sections.filter(section=>section.published),pages:allPages,settings:{...fallbackSettings,...Object.fromEntries(settingRows.map(row=>[row.key,row.value]))}};
  }catch{return null;}
}
