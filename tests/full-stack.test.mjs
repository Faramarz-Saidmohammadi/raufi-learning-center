import assert from "node:assert/strict";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createTestBucket, createTestDatabase } from "./helpers/fake-d1.mjs";

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const workerUrl=pathToFileURL(resolve(projectRoot,"dist/server/index.js"));
workerUrl.searchParams.set("test",`full-stack-${process.pid}-${Date.now()}`);
const {default:worker}=await import(workerUrl.href);
const {sqlite,binding:DB}=createTestDatabase(projectRoot);
const {binding:BUCKET}=createTestBucket();
const env={DB,BUCKET,ADMIN_EMAILS:"admin@example.com",ADMIN_PASSWORD_HASH:"pbkdf2-sha256$210000$ABEiM0RVZneImaq7zN3u_w$c_55Y5IHurgALIePFi5oLvolNNHe9djR6Wyag3fHaTw",ADMIN_SESSION_SECRET:"test-session-secret-with-at-least-32-characters",ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
globalThis.__RAUFI_TEST_ENV__=env;
const ctx={waitUntil(){},passThroughOnException(){}};

function request(path,options={}){return worker.fetch(new Request(`http://localhost${path}`,options),env,ctx);}
async function json(response){const body=await response.json();return{response,body};}

const loginResponse=await request("/api/admin/session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"admin@example.com",password:"RaufiTestPassword!42"})});
const adminCookie=loginResponse.headers.get("set-cookie")?.split(";",1)[0]??"";
const adminHeaders={"content-type":"application/json",cookie:adminCookie};

test("public website renders portfolio-grade trilingual content and SEO",async()=>{
  const response=await request("/",{headers:{accept:"text/html"}});const html=await response.text();
  assert.equal(response.status,200);assert.match(html,/Raufi Learning Center/);assert.match(html,/د کانکور چمتووالی/);assert.match(html,/application\/ld\+json/);
});

test("public admission endpoint validates, normalises and stores consent",async()=>{
  let result=await json(await request("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:"Amina",phone:"۰۷۹۶۷۲۲۷۲۷",interest:"English Language"})}));
  assert.equal(result.response.status,400);assert.equal(result.body.code,"consent_required");
  result=await json(await request("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:"Amina Rahimi",phone:"۰۷۹۶۷۲۲۷۲۷",interest:"English Language",educationLevel:"School graduate",preferredTime:"Morning",message:"Please call me",sourceLanguage:"ps",consent:true})}));
  assert.equal(result.response.status,201);assert.equal(result.body.ok,true);
  const saved=sqlite.prepare("SELECT * FROM inquiries WHERE name=?").get("Amina Rahimi");assert.equal(saved.phone,"0796722727");assert.equal(saved.source_language,"ps");assert.ok(saved.consent_at);
});

test("admin API enforces authentication and authorization",async()=>{
  assert.equal((await request("/api/admin/content")).status,401);
  assert.equal((await request("/api/admin/session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"admin@example.com",password:"incorrect-password"})})).status,401);
  assert.equal((await request("/api/admin/content",{headers:{cookie:`${adminCookie}tampered`}})).status,401);
  assert.equal((await request("/api/admin/content",{headers:adminHeaders})).status,200);
});

test("CMS completes content CRUD, settings, admissions CRM and audit history",async()=>{
  const post=payload=>request("/api/admin/content",{method:"POST",headers:adminHeaders,body:JSON.stringify(payload)});
  let result=await json(await post({entity:"course",slug:"portfolio-lab",titleFa:"لابراتوار نمونه‌کار",titleEn:"Portfolio Lab",titlePs:"د پورټفولیو لابراتوار",descriptionFa:"توضیح",descriptionEn:"Description",descriptionPs:"تشریح",categoryFa:"تکنالوژی",categoryEn:"Technology",categoryPs:"ټکنالوژي",durationFa:"۸ هفته",durationEn:"8 weeks",durationPs:"۸ اوونۍ",levelFa:"مقدماتی",levelEn:"Foundation",levelPs:"مقدماتي",formatFa:"حضوری",formatEn:"In person",formatPs:"حضوري",outcomesFa:"نمونه‌کار|ارائه",outcomesEn:"Portfolio|Presentation",outcomesPs:"پورټفولیو|وړاندې کول",published:true,featured:true,sortOrder:10,accent:"#1261a0",icon:"code"}));
  assert.equal(result.response.status,200);const courseId=result.body.id;
  result=await json(await post({entity:"course",slug:"portfolio-lab",titleFa:"تکرار",titleEn:"Duplicate",titlePs:"تکرار",published:true}));assert.equal(result.response.status,409);
  result=await json(await post({entity:"announcement",titleFa:"آغاز صنف",titleEn:"Class opening",titlePs:"د صنف پیل",excerptFa:"جزئیات",excerptEn:"Details",excerptPs:"جزیات",publishedAt:"2026-09-01",published:true}));assert.equal(result.response.status,200);const announcementId=result.body.id;
  result=await json(await post({entity:"schedule",courseTitleFa:"زبان انگلیسی",courseTitleEn:"English Language",courseTitlePs:"انګلیسي ژبه",daysFa:"شنبه تا چهارشنبه",daysEn:"Saturday to Wednesday",daysPs:"شنبه تر چهارشنبې",time:"08:00",startDate:"2026-09-01",seatsFa:"ثبت‌نام باز",seatsEn:"Open",seatsPs:"خلاص",published:true,sortOrder:1}));assert.equal(result.response.status,200);const scheduleId=result.body.id;
  result=await json(await post({entity:"faq",questionFa:"هزینه؟",questionEn:"Fee?",questionPs:"فیس؟",answerFa:"تماس بگیرید",answerEn:"Please call",answerPs:"زنګ ووهئ",published:true,sortOrder:9}));assert.equal(result.response.status,200);const faqId=result.body.id;
  result=await json(await post({entity:"settings",heroTitlePs:"د آزموینې سرلیک",phone:"+93 79 672 2727",aboutTitleEn:"A verified learning centre"}));assert.equal(result.response.status,200);

  const inquiry=sqlite.prepare("SELECT id FROM inquiries WHERE name=?").get("Amina Rahimi");
  result=await json(await request("/api/admin/content",{method:"PATCH",headers:adminHeaders,body:JSON.stringify({entity:"inquiry",id:inquiry.id,status:"enrolled",adminNote:"Placement confirmed"})}));assert.equal(result.response.status,200);
  result=await json(await request("/api/admin/content",{headers:adminHeaders}));assert.equal(result.response.status,200);assert.ok(result.body.courses.some(item=>item.id===courseId&&item.titlePs));assert.ok(result.body.schedules.some(item=>item.id===scheduleId));assert.ok(result.body.faqs.some(item=>item.id===faqId));assert.equal(result.body.settings.heroTitlePs,"د آزموینې سرلیک");assert.equal(result.body.inquiries.find(item=>item.id===inquiry.id).status,"enrolled");assert.equal(result.body.inquiries.find(item=>item.id===inquiry.id).adminNote,"Placement confirmed");assert.ok(result.body.activity.length>=6);

  for(const [entity,id] of [["course",courseId],["announcement",announcementId],["schedule",scheduleId],["faq",faqId]]){const deleted=await json(await request(`/api/admin/content?entity=${entity}&id=${id}`,{method:"DELETE",headers:adminHeaders}));assert.equal(deleted.response.status,200);}
  result=await json(await request("/api/admin/content",{headers:adminHeaders}));assert.ok(!result.body.courses.some(item=>item.id===courseId));assert.ok(result.body.activity.some(item=>item.action==="deleted"&&item.entity==="course"));
});

test("page builder manages pages, sections, navigation copy and R2 media",async()=>{
  const post=payload=>request("/api/admin/content",{method:"POST",headers:adminHeaders,body:JSON.stringify(payload)});
  let result=await json(await post({entity:"page",slug:"student-life",titleFa:"زندگی شاگرد",titleEn:"Student Life",titlePs:"د زده‌کوونکي ژوند",descriptionFa:"فعالیت‌ها و محیط آموزشی",descriptionEn:"Activities and learning environment",descriptionPs:"فعالیتونه او ښوونیز چاپېریال",navLabelFa:"زندگی شاگرد",navLabelEn:"Student Life",navLabelPs:"د زده‌کوونکي ژوند",showInNav:true,published:true,sortOrder:20}));
  assert.equal(result.response.status,200);const pageId=result.body.id;
  result=await json(await post({entity:"section",pageId,type:"imageText",name:"Student support",sectionKey:"student-support",eyebrowFa:"پشتیبانی",eyebrowEn:"Support",eyebrowPs:"ملاتړ",headingFa:"همراه شاگردان در مسیر آموزش",headingEn:"Supporting every learning journey",headingPs:"د زده‌کړې په بهیر کې ملاتړ",bodyFa:"مشوره، تمرین و پیگیری.",bodyEn:"Advice, practice and follow-up.",bodyPs:"مشوره، تمرین او تعقیب.",itemsJson:"[]",theme:"soft",showInNav:true,published:true,sortOrder:10}));
  assert.equal(result.response.status,200);const sectionId=result.body.id;
  result=await json(await request("/api/admin/content",{method:"PATCH",headers:adminHeaders,body:JSON.stringify({entity:"sectionOrder",pageId,ids:[sectionId]})}));assert.equal(result.response.status,200);
  let publicPage=await request("/student-life",{headers:{accept:"text/html"}});assert.equal(publicPage.status,200);let html=await publicPage.text();assert.match(html,/زندگی شاگرد/);assert.match(html,/همراه شاگردان در مسیر آموزش/);

  const upload=new FormData();upload.set("file",new File([new Uint8Array([137,80,78,71,13,10,26,10])],"student-life.png",{type:"image/png"}));upload.set("altFa","محیط آموزشی");upload.set("altEn","Learning environment");upload.set("altPs","ښوونیز چاپېریال");
  result=await json(await request("/api/admin/media",{method:"POST",headers:{cookie:adminCookie},body:upload}));assert.equal(result.response.status,201);const mediaId=result.body.id;const mediaUrl=result.body.url;
  const mediaResponse=await request(mediaUrl);assert.equal(mediaResponse.status,200);assert.equal(mediaResponse.headers.get("content-type"),"image/png");assert.equal((await mediaResponse.arrayBuffer()).byteLength,8);
  result=await json(await post({entity:"section",id:sectionId,pageId,type:"imageText",name:"Student support",sectionKey:"student-support",headingFa:"همراه شاگردان در مسیر آموزش",headingEn:"Supporting every learning journey",headingPs:"د زده‌کړې په بهیر کې ملاتړ",bodyFa:"مشوره، تمرین و پیگیری.",bodyEn:"Advice, practice and follow-up.",bodyPs:"مشوره، تمرین او تعقیب.",imageUrl:mediaUrl,itemsJson:"[]",theme:"soft",showInNav:true,published:true,sortOrder:10}));assert.equal(result.response.status,200);
  result=await json(await request(`/api/admin/media?id=${mediaId}`,{method:"DELETE",headers:adminHeaders}));assert.equal(result.response.status,409);

  result=await json(await request(`/api/admin/content?entity=section&id=${sectionId}`,{method:"DELETE",headers:adminHeaders}));assert.equal(result.response.status,200);
  result=await json(await request(`/api/admin/media?id=${mediaId}`,{method:"DELETE",headers:adminHeaders}));assert.equal(result.response.status,200);
  result=await json(await request(`/api/admin/content?entity=page&id=${pageId}`,{method:"DELETE",headers:adminHeaders}));assert.equal(result.response.status,200);
  assert.equal((await request("/student-life",{headers:{accept:"text/html"}})).status,404);

  result=await json(await post({entity:"section",id:"home-hero",pageId:"home",type:"hero",name:"Hero",sectionKey:"hero",headingFa:"آموزش قابل مدیریت از یک مرکز واحد",headingEn:"Manage every part from one place",headingPs:"هره برخه له یوه ځایه اداره کړئ",imageUrl:"/images/raufi-hero.webp",itemsJson:"[]",theme:"dark",published:true,sortOrder:10}));assert.equal(result.response.status,200);
  const home=await request("/",{headers:{accept:"text/html"}});html=await home.text();assert.match(html,/آموزش قابل مدیریت از یک مرکز واحد/);
});
