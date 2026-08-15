/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getAdminState } from "@/lib/admin-auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic="force-dynamic";

export default async function AdminPage({searchParams}:{searchParams:Promise<{error?:string}>}){
  const state=await getAdminState();
  if(!state.configured){
    return <main className="grid min-h-screen place-items-center bg-[#f3f7fa] p-6" dir="ltr"><section className="admin-card w-full max-w-lg text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-3xl">🔒</div><h1 className="mt-5 text-2xl font-extrabold">CMS setup required</h1><p className="mt-3 leading-7 text-[#60758a]">Configure the administrator email, password hash and session secret before using the CMS.</p><Link className="btn-primary mt-6 inline-block" href="/">View website</Link></section></main>;
  }
  if(!state.user){
    const {error}=await searchParams;
    return <main className="grid min-h-screen place-items-center bg-[#f3f7fa] p-6" dir="ltr"><section className="admin-card w-full max-w-md"><div className="text-center"><img className="mx-auto h-20 w-20 rounded-full" src="/images/raufi-logo.webp" alt="Raufi Learning Center logo"/><h1 className="mt-5 text-2xl font-extrabold">Administrator sign in</h1><p className="mt-2 text-sm text-[#60758a]">Enter your authorized CMS credentials.</p></div>{error?<p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error==="configuration"?"CMS authentication is not configured.":"The email or password is incorrect."}</p>:null}<form className="mt-6 grid gap-4" action="/api/admin/session" method="post"><label className="grid gap-2 text-sm font-bold">Email<input className="admin-input" type="email" name="email" autoComplete="username" required/></label><label className="grid gap-2 text-sm font-bold">Password<input className="admin-input" type="password" name="password" autoComplete="current-password" required/></label><button className="btn-primary" type="submit">Sign in securely</button></form><Link className="mt-5 block text-center text-sm font-bold text-[#0b6298]" href="/">Return to website</Link></section></main>;
  }
  return <AdminDashboard displayName={state.user.displayName} email={state.user.email}/>;
}
