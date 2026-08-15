import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getMediaBucket } from "@/lib/media-storage";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params;const rows=await (await getDb()).select().from(mediaAssets).where(eq(mediaAssets.id,id.slice(0,80))).limit(1);if(!rows.length)return new Response("Not found",{status:404});
    const object=await (await getMediaBucket()).get(rows[0].objectKey);if(!object)return new Response("Not found",{status:404});
    const headers=new Headers({"content-type":rows[0].contentType,"cache-control":"public, max-age=31536000, immutable","x-content-type-options":"nosniff"});object.writeHttpMetadata?.(headers);if(object.httpEtag)headers.set("etag",object.httpEtag);
    return new Response(object.body,{headers});
  }catch{return new Response("Media unavailable",{status:500});}
}
