import { getAdminConfiguration, getAdminUser } from "@/lib/admin-session";

export async function getAdminState() {
  const [user, configuration] = await Promise.all([getAdminUser(), getAdminConfiguration()]);
  return { user, configured: configuration.configured, authorized: Boolean(user) };
}

export async function requireAdminApi() {
  const state=await getAdminState();
  if(!state.user)return{ok:false as const,response:Response.json({error:"Sign in required"},{status:401})};
  if(!state.configured)return{ok:false as const,response:Response.json({error:"Administrator email is not configured"},{status:503})};
  if(!state.authorized)return{ok:false as const,response:Response.json({error:"Access denied"},{status:403})};
  return{ok:true as const,user:state.user};
}
