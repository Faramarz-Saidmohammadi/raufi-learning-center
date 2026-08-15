import { eq, or } from "drizzle-orm";
import { del, put } from "@vercel/blob";
import { getDb } from "@/db";
import { auditLogs, mediaAssets, pageSections } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

const allowed:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif"};
const text=(value:FormDataEntryValue|null,max:number)=>String(value??"").trim().slice(0,max);

export async function POST(request:Request){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  try{
    const form=await request.formData();const file=form.get("file");
    if(!(file instanceof File)||!allowed[file.type])return Response.json({error:"Upload a JPG, PNG, WebP or GIF image."},{status:400});
    if(file.size<1||file.size>5*1024*1024)return Response.json({error:"Images must be between 1 byte and 5 MB."},{status:400});
    const id=crypto.randomUUID(),pathname=`media/${id}.${allowed[file.type]}`;
    const blob=await put(pathname,file,{access:"public",addRandomSuffix:false,contentType:file.type,cacheControlMaxAge:31536000});
    const db=await getDb();await db.insert(mediaAssets).values({id,objectKey:blob.url,filename:file.name.slice(0,180)||`image.${allowed[file.type]}`,contentType:file.type,size:file.size,altFa:text(form.get("altFa"),180),altEn:text(form.get("altEn"),180),altPs:text(form.get("altPs"),180),uploadedBy:auth.user.email});
    await db.insert(auditLogs).values({id:crypto.randomUUID(),action:"uploaded",entity:"media",entityId:id,summary:file.name.slice(0,240),actorEmail:auth.user.email});
    return Response.json({ok:true,id,url:`/api/media/${id}`},{status:201});
  }catch(error){console.error("Media upload failed",error);return Response.json({error:"The image could not be uploaded."},{status:500});}
}

export async function DELETE(request:Request){
  const auth=await requireAdminApi();if(!auth.ok)return auth.response;
  try{
    const id=new URL(request.url).searchParams.get("id")?.slice(0,80)||"";const db=await getDb();const rows=await db.select().from(mediaAssets).where(eq(mediaAssets.id,id)).limit(1);
    if(!rows.length)return Response.json({error:"Image not found."},{status:404});const url=`/api/media/${id}`;
    const used=await db.select({id:pageSections.id}).from(pageSections).where(or(eq(pageSections.imageUrl,url),eq(pageSections.secondaryImageUrl,url))).limit(1);
    if(used.length)return Response.json({error:"This image is used by a page section. Replace it there before deleting."},{status:409});
    await del(rows[0].objectKey);await db.delete(mediaAssets).where(eq(mediaAssets.id,id));
    await db.insert(auditLogs).values({id:crypto.randomUUID(),action:"deleted",entity:"media",entityId:id,summary:rows[0].filename,actorEmail:auth.user.email});
    return Response.json({ok:true});
  }catch(error){console.error("Media deletion failed",error);return Response.json({error:"The image could not be deleted."},{status:500});}
}
