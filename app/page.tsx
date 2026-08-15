import PublicSite from "@/components/PublicSite";
import { getPublicContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublicContent();
  const phone=content.settings.phone||"+93 79 672 2727";
  const siteUrl=getSiteUrl();
  const structuredData={
    "@context":"https://schema.org",
    "@type":"EducationalOrganization",
    name:"Raufi Learning Center",
    alternateName:["آموزشگاه رؤفی","د رؤفي ښوونیز مرکز"],
    url:siteUrl,
    logo:`${siteUrl}/images/raufi-logo.webp`,
    image:`${siteUrl}/images/raufi-hero.webp`,
    telephone:phone,
    address:{"@type":"PostalAddress",streetAddress:"South of Chaharrah-e-Amriat",addressLocality:"Herat",addressCountry:"AF"},
    sameAs:[content.settings.facebook,content.settings.instagram,content.settings.telegram].filter(Boolean),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><PublicSite initialContent={content}/></>;
}
