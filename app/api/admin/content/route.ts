import { and, asc, desc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { announcements, auditLogs, classSchedules, courses, faqs, inquiries, mediaAssets, pageSections, sitePages, siteSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { fallbackAnnouncements, fallbackCourses, fallbackFaqs, fallbackPages, fallbackSections, fallbackSettings } from "@/lib/content";

const asText=(value:unknown,max=1000)=>String(value??"").trim().slice(0,max);
const asBool=(value:unknown)=>value===true||value==="true"||value===1;
const asOrder=(value:unknown)=>Math.max(-999,Math.min(999,Number.parseInt(String(value??0),10)||0));
const makeSlug=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,160);
const sectionTypes=["hero","richText","imageText","stats","gallery","programmes","about","finder","advantages","journey","support","environment","schedule","announcements","faq","contact"];
const validJsonArray=(value:unknown)=>{const raw=asText(value,12000)||"[]";try{return Array.isArray(JSON.parse(raw))?raw:null;}catch{return null;}};
type Db=Awaited<ReturnType<typeof getDb>>;

async function audit(db:Db,actorEmail:string,action:string,entity:string,entityId:string,summary:string){
  await db.insert(auditLogs).values({id:crypto.randomUUID(),action,entity,entityId,summary:summary.slice(0,240),actorEmail});
}

export async function GET(){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  const db=await getDb();
  const [courseRows,announcementRows,scheduleRows,faqRows,inquiryRows,settingRows,activityRows,pageRows,sectionRows,mediaRows]=await Promise.all([
    db.select().from(courses).orderBy(asc(courses.sortOrder)),
    db.select().from(announcements).orderBy(desc(announcements.publishedAt)),
    db.select().from(classSchedules).orderBy(asc(classSchedules.sortOrder)),
    db.select().from(faqs).orderBy(asc(faqs.sortOrder)),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(500),
    db.select().from(siteSettings),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100),
    db.select().from(sitePages).orderBy(asc(sitePages.sortOrder)),
    db.select().from(pageSections).orderBy(asc(pageSections.sortOrder)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(250),
  ]);
  return Response.json({courses:courseRows.length?courseRows:fallbackCourses,announcements:announcementRows.length?announcementRows:fallbackAnnouncements,schedules:scheduleRows,faqs:faqRows.length?faqRows:fallbackFaqs,inquiries:inquiryRows,activity:activityRows,pages:pageRows.length?pageRows:fallbackPages,sections:sectionRows.length?sectionRows:fallbackSections,media:mediaRows.map(row=>({...row,url:`/api/media/${row.id}`})),settings:{...fallbackSettings,...Object.fromEntries(settingRows.map(row=>[row.key,row.value]))}},{headers:{"cache-control":"no-store"}});
}

export async function POST(request:Request){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  try{
    const payload=await request.json() as Record<string,unknown>;
    const entity=asText(payload.entity,30);const db=await getDb();const now=new Date().toISOString();

    if(entity==="course"){
      const id=asText(payload.id,80)||crypto.randomUUID();
      const titleFa=asText(payload.titleFa,160),titleEn=asText(payload.titleEn,160),titlePs=asText(payload.titlePs,160);
      const slug=makeSlug(asText(payload.slug,160)||titleEn);
      if(!titleFa||!titleEn||!titlePs||!slug)return Response.json({error:"Dari, English and Pashto titles are required."},{status:400});
      const collision=await db.select({id:courses.id}).from(courses).where(and(eq(courses.slug,slug),ne(courses.id,id))).limit(1);
      if(collision.length)return Response.json({error:"This URL slug is already used by another programme."},{status:409});
      const values={slug,titleFa,titleEn,titlePs,descriptionFa:asText(payload.descriptionFa,1200),descriptionEn:asText(payload.descriptionEn,1200),descriptionPs:asText(payload.descriptionPs,1200),categoryFa:asText(payload.categoryFa,100),categoryEn:asText(payload.categoryEn,100),categoryPs:asText(payload.categoryPs,100),durationFa:asText(payload.durationFa,100),durationEn:asText(payload.durationEn,100),durationPs:asText(payload.durationPs,100),levelFa:asText(payload.levelFa,100),levelEn:asText(payload.levelEn,100),levelPs:asText(payload.levelPs,100),formatFa:asText(payload.formatFa,100),formatEn:asText(payload.formatEn,100),formatPs:asText(payload.formatPs,100),outcomesFa:asText(payload.outcomesFa,1400),outcomesEn:asText(payload.outcomesEn,1400),outcomesPs:asText(payload.outcomesPs,1400),icon:asText(payload.icon,30)||"book",accent:/^#[0-9a-f]{6}$/i.test(asText(payload.accent,20))?asText(payload.accent,20):"#1261a0",featured:asBool(payload.featured),published:asBool(payload.published),sortOrder:asOrder(payload.sortOrder),updatedAt:now};
      const existing=await db.select({id:courses.id}).from(courses).where(eq(courses.id,id)).limit(1);
      if(existing.length)await db.update(courses).set(values).where(eq(courses.id,id));else await db.insert(courses).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","course",id,titleEn);
      return Response.json({ok:true,id});
    }

    if(entity==="announcement"){
      const id=asText(payload.id,80)||crypto.randomUUID();
      const titleFa=asText(payload.titleFa,200),titleEn=asText(payload.titleEn,200),titlePs=asText(payload.titlePs,200);
      if(!titleFa||!titleEn||!titlePs)return Response.json({error:"Dari, English and Pashto titles are required."},{status:400});
      const date=asText(payload.publishedAt,40)||now;
      if(Number.isNaN(Date.parse(date)))return Response.json({error:"A valid publish date is required."},{status:400});
      const values={titleFa,titleEn,titlePs,excerptFa:asText(payload.excerptFa,1200),excerptEn:asText(payload.excerptEn,1200),excerptPs:asText(payload.excerptPs,1200),published:asBool(payload.published),publishedAt:date,updatedAt:now};
      const existing=await db.select({id:announcements.id}).from(announcements).where(eq(announcements.id,id)).limit(1);
      if(existing.length)await db.update(announcements).set(values).where(eq(announcements.id,id));else await db.insert(announcements).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","announcement",id,titleEn);
      return Response.json({ok:true,id});
    }

    if(entity==="schedule"){
      const id=asText(payload.id,80)||crypto.randomUUID();
      const courseTitleFa=asText(payload.courseTitleFa,160),courseTitleEn=asText(payload.courseTitleEn,160),courseTitlePs=asText(payload.courseTitlePs,160);
      const daysFa=asText(payload.daysFa,160),daysEn=asText(payload.daysEn,160),daysPs=asText(payload.daysPs,160),time=asText(payload.time,80);
      if(!courseTitleFa||!courseTitleEn||!courseTitlePs||!daysFa||!daysEn||!daysPs||!time)return Response.json({error:"Programme, days and time are required in all languages."},{status:400});
      const values={courseTitleFa,courseTitleEn,courseTitlePs,daysFa,daysEn,daysPs,time,startDate:asText(payload.startDate,40),seatsFa:asText(payload.seatsFa,100),seatsEn:asText(payload.seatsEn,100),seatsPs:asText(payload.seatsPs,100),published:asBool(payload.published),sortOrder:asOrder(payload.sortOrder),updatedAt:now};
      const existing=await db.select({id:classSchedules.id}).from(classSchedules).where(eq(classSchedules.id,id)).limit(1);
      if(existing.length)await db.update(classSchedules).set(values).where(eq(classSchedules.id,id));else await db.insert(classSchedules).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","schedule",id,courseTitleEn);
      return Response.json({ok:true,id});
    }

    if(entity==="faq"){
      const id=asText(payload.id,80)||crypto.randomUUID();
      const questionFa=asText(payload.questionFa,260),questionEn=asText(payload.questionEn,260),questionPs=asText(payload.questionPs,260);
      const answerFa=asText(payload.answerFa,1800),answerEn=asText(payload.answerEn,1800),answerPs=asText(payload.answerPs,1800);
      if(!questionFa||!questionEn||!questionPs||!answerFa||!answerEn||!answerPs)return Response.json({error:"Questions and answers are required in all languages."},{status:400});
      const values={questionFa,questionEn,questionPs,answerFa,answerEn,answerPs,published:asBool(payload.published),sortOrder:asOrder(payload.sortOrder),updatedAt:now};
      const existing=await db.select({id:faqs.id}).from(faqs).where(eq(faqs.id,id)).limit(1);
      if(existing.length)await db.update(faqs).set(values).where(eq(faqs.id,id));else await db.insert(faqs).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","faq",id,questionEn);
      return Response.json({ok:true,id});
    }

    if(entity==="settings"){
      const allowed=["phone","addressFa","addressEn","addressPs","telegram","instagram","facebook","heroTitleFa","heroTitleEn","heroTitlePs","heroBodyFa","heroBodyEn","heroBodyPs","aboutTitleFa","aboutTitleEn","aboutTitlePs","aboutBodyFa","aboutBodyEn","aboutBodyPs","registrationLabelFa","registrationLabelEn","registrationLabelPs"];
      await Promise.all(allowed.map(async key=>{
        if(typeof payload[key]!=="string")return;
        const value=asText(payload[key],1200);
        await db.insert(siteSettings).values({key,value,updatedAt:now}).onConflictDoUpdate({target:siteSettings.key,set:{value,updatedAt:now}});
      }));
      await audit(db,auth.user.email,"updated","settings","website","Website settings");
      return Response.json({ok:true});
    }

    if(entity==="page"){
      const id=asText(payload.id,80)||crypto.randomUUID();
      const titleFa=asText(payload.titleFa,160),titleEn=asText(payload.titleEn,160),titlePs=asText(payload.titlePs,160);
      if(!titleFa||!titleEn||!titlePs)return Response.json({error:"Dari, English and Pashto page titles are required."},{status:400});
      const existing=await db.select().from(sitePages).where(eq(sitePages.id,id)).limit(1);const isHome=Boolean(existing[0]?.isHome);
      const slug=isHome?"home":makeSlug(asText(payload.slug,160)||titleEn);if(!slug)return Response.json({error:"A valid page URL slug is required."},{status:400});
      const collision=await db.select({id:sitePages.id}).from(sitePages).where(and(eq(sitePages.slug,slug),ne(sitePages.id,id))).limit(1);if(collision.length)return Response.json({error:"This page URL is already in use."},{status:409});
      const values={slug,titleFa,titleEn,titlePs,descriptionFa:asText(payload.descriptionFa,500),descriptionEn:asText(payload.descriptionEn,500),descriptionPs:asText(payload.descriptionPs,500),navLabelFa:asText(payload.navLabelFa,80),navLabelEn:asText(payload.navLabelEn,80),navLabelPs:asText(payload.navLabelPs,80),isHome,showInNav:isHome?false:asBool(payload.showInNav),published:isHome?true:asBool(payload.published),sortOrder:asOrder(payload.sortOrder),updatedAt:now};
      if(existing.length)await db.update(sitePages).set(values).where(eq(sitePages.id,id));else await db.insert(sitePages).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","page",id,titleEn);return Response.json({ok:true,id});
    }

    if(entity==="section"){
      const id=asText(payload.id,80)||crypto.randomUUID(),pageId=asText(payload.pageId,80),name=asText(payload.name,120),type=asText(payload.type,30);
      if(!pageId||!name||!sectionTypes.includes(type))return Response.json({error:"Page, section name and a valid section type are required."},{status:400});
      const page=await db.select({id:sitePages.id}).from(sitePages).where(eq(sitePages.id,pageId)).limit(1);if(!page.length)return Response.json({error:"The selected page does not exist."},{status:404});
      const sectionKey=makeSlug(asText(payload.sectionKey,100)||name);if(!sectionKey)return Response.json({error:"A valid section key is required."},{status:400});
      const collision=await db.select({id:pageSections.id}).from(pageSections).where(and(eq(pageSections.pageId,pageId),eq(pageSections.sectionKey,sectionKey),ne(pageSections.id,id))).limit(1);if(collision.length)return Response.json({error:"This section key is already used on the page."},{status:409});
      const itemsJson=validJsonArray(payload.itemsJson);if(itemsJson===null)return Response.json({error:"Repeating items must be a valid JSON array."},{status:400});
      const values={pageId,sectionKey,type,name,eyebrowFa:asText(payload.eyebrowFa,120),eyebrowEn:asText(payload.eyebrowEn,120),eyebrowPs:asText(payload.eyebrowPs,120),headingFa:asText(payload.headingFa,240),headingEn:asText(payload.headingEn,240),headingPs:asText(payload.headingPs,240),bodyFa:asText(payload.bodyFa,4000),bodyEn:asText(payload.bodyEn,4000),bodyPs:asText(payload.bodyPs,4000),imageUrl:asText(payload.imageUrl,500),secondaryImageUrl:asText(payload.secondaryImageUrl,500),imageAltFa:asText(payload.imageAltFa,180),imageAltEn:asText(payload.imageAltEn,180),imageAltPs:asText(payload.imageAltPs,180),ctaLabelFa:asText(payload.ctaLabelFa,100),ctaLabelEn:asText(payload.ctaLabelEn,100),ctaLabelPs:asText(payload.ctaLabelPs,100),ctaUrl:asText(payload.ctaUrl,500),navLabelFa:asText(payload.navLabelFa,80),navLabelEn:asText(payload.navLabelEn,80),navLabelPs:asText(payload.navLabelPs,80),itemsJson,theme:["light","soft","dark"].includes(asText(payload.theme,20))?asText(payload.theme,20):"light",showInNav:asBool(payload.showInNav),published:asBool(payload.published),sortOrder:asOrder(payload.sortOrder),updatedAt:now};
      const existing=await db.select({id:pageSections.id}).from(pageSections).where(eq(pageSections.id,id)).limit(1);if(existing.length)await db.update(pageSections).set(values).where(eq(pageSections.id,id));else await db.insert(pageSections).values({id,...values});
      await audit(db,auth.user.email,existing.length?"updated":"created","section",id,`${name} · ${pageId}`);return Response.json({ok:true,id});
    }

    return Response.json({error:"Unsupported entity."},{status:400});
  }catch(error){
    console.error("CMS write failed",error);
    return Response.json({error:"The CMS could not save this change."},{status:500});
  }
}

export async function PATCH(request:Request){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  try{
    const payload=await request.json() as Record<string,unknown>;
    if(asText(payload.entity,30)==="sectionOrder"){
      const pageId=asText(payload.pageId,80),ids=Array.isArray(payload.ids)?payload.ids.map(value=>asText(value,80)).filter(Boolean).slice(0,100):[];
      if(!pageId||!ids.length)return Response.json({error:"A page and ordered section list are required."},{status:400});
      const db=await getDb();const rows=await db.select({id:pageSections.id}).from(pageSections).where(eq(pageSections.pageId,pageId));
      if(ids.some(id=>!rows.some(row=>row.id===id)))return Response.json({error:"The section order contains an invalid item."},{status:400});
      await Promise.all(ids.map((id,index)=>db.update(pageSections).set({sortOrder:(index+1)*10,updatedAt:new Date().toISOString()}).where(eq(pageSections.id,id))));
      await audit(db,auth.user.email,"reordered","section",pageId,"Page sections");return Response.json({ok:true});
    }
    if(asText(payload.entity,30)!=="inquiry")return Response.json({error:"Unsupported entity."},{status:400});
    const id=asText(payload.id,80);const status=asText(payload.status,20);const adminNote=asText(payload.adminNote,1600);
    if(!id||!["new","contacted","enrolled","closed"].includes(status))return Response.json({error:"Invalid enquiry update."},{status:400});
    const db=await getDb();const existing=await db.select({id:inquiries.id,name:inquiries.name}).from(inquiries).where(eq(inquiries.id,id)).limit(1);
    if(!existing.length)return Response.json({error:"Enquiry not found."},{status:404});
    await db.update(inquiries).set({status,adminNote,updatedAt:new Date().toISOString()}).where(eq(inquiries.id,id));
    await audit(db,auth.user.email,"updated","inquiry",id,`${existing[0].name}: ${status}`);
    return Response.json({ok:true});
  }catch(error){console.error("Enquiry update failed",error);return Response.json({error:"The enquiry could not be updated."},{status:500});}
}

export async function DELETE(request:Request){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  try{
    const url=new URL(request.url);const entity=url.searchParams.get("entity");const id=asText(url.searchParams.get("id"),80);const db=await getDb();
    if(!id)return Response.json({error:"Missing id."},{status:400});
    let summary="";
    if(entity==="course"){const rows=await db.select({title:courses.titleEn}).from(courses).where(eq(courses.id,id)).limit(1);if(!rows.length)return Response.json({error:"Programme not found."},{status:404});summary=rows[0].title;await db.delete(courses).where(eq(courses.id,id));}
    else if(entity==="announcement"){const rows=await db.select({title:announcements.titleEn}).from(announcements).where(eq(announcements.id,id)).limit(1);if(!rows.length)return Response.json({error:"Announcement not found."},{status:404});summary=rows[0].title;await db.delete(announcements).where(eq(announcements.id,id));}
    else if(entity==="schedule"){const rows=await db.select({title:classSchedules.courseTitleEn}).from(classSchedules).where(eq(classSchedules.id,id)).limit(1);if(!rows.length)return Response.json({error:"Schedule not found."},{status:404});summary=rows[0].title;await db.delete(classSchedules).where(eq(classSchedules.id,id));}
    else if(entity==="faq"){const rows=await db.select({title:faqs.questionEn}).from(faqs).where(eq(faqs.id,id)).limit(1);if(!rows.length)return Response.json({error:"FAQ not found."},{status:404});summary=rows[0].title;await db.delete(faqs).where(eq(faqs.id,id));}
    else if(entity==="section"){const rows=await db.select({title:pageSections.name}).from(pageSections).where(eq(pageSections.id,id)).limit(1);if(!rows.length)return Response.json({error:"Section not found."},{status:404});summary=rows[0].title;await db.delete(pageSections).where(eq(pageSections.id,id));}
    else if(entity==="page"){const rows=await db.select({title:sitePages.titleEn,isHome:sitePages.isHome}).from(sitePages).where(eq(sitePages.id,id)).limit(1);if(!rows.length)return Response.json({error:"Page not found."},{status:404});if(rows[0].isHome)return Response.json({error:"The homepage cannot be deleted."},{status:400});summary=rows[0].title;await db.delete(pageSections).where(eq(pageSections.pageId,id));await db.delete(sitePages).where(eq(sitePages.id,id));}
    else return Response.json({error:"Unsupported entity."},{status:400});
    await audit(db,auth.user.email,"deleted",entity,id,summary);
    return Response.json({ok:true});
  }catch(error){console.error("CMS delete failed",error);return Response.json({error:"The item could not be deleted."},{status:500});}
}
