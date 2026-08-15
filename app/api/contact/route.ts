import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { parseContactPayload } from "@/lib/contact-validation";

export async function POST(request:Request){
  try{
    const parsed=parseContactPayload(await request.json());
    if(!parsed.ok)return Response.json({error:parsed.error,code:parsed.code},{status:parsed.status});
    if(parsed.spam)return Response.json({ok:true});
    await (await getDb()).insert(inquiries).values({id:crypto.randomUUID(),...parsed.data,status:"new",adminNote:""});
    return Response.json({ok:true},{status:201,headers:{"cache-control":"no-store"}});
  }catch{
    return Response.json({error:"Unable to save enquiry"},{status:500});
  }
}
