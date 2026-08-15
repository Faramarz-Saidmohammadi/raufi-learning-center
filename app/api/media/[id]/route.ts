import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params;const rows=await (await getDb()).select().from(mediaAssets).where(eq(mediaAssets.id,id.slice(0,80))).limit(1);if(!rows.length)return new Response("Not found",{status:404});
    return Response.redirect(rows[0].objectKey,307);
  }catch{return new Response("Media unavailable",{status:500});}
}
