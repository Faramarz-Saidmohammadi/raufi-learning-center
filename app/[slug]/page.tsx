import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicPage from "@/components/DynamicPage";
import { getPageBySlug } from "@/lib/content";

export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const result=await getPageBySlug(slug);if(!result)return{};
  return{title:result.page.titleEn,description:result.page.descriptionEn||result.page.descriptionFa,alternates:{canonical:`/${result.page.slug}`}};
}

export default async function ManagedPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const result=await getPageBySlug(slug);if(!result)notFound();
  return <DynamicPage {...result}/>;
}
