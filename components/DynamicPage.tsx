"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BuilderSection from "@/components/BuilderSection";
import type { PageSection, SitePage } from "@/lib/content";
import { direction, Lang, publicCopy } from "@/lib/public-copy";

const suffix:Record<Lang,"Fa"|"En"|"Ps">={fa:"Fa",en:"En",ps:"Ps"};
const pageText=(page:SitePage,field:"title"|"description"|"navLabel",lang:Lang)=>String(page[`${field}${suffix[lang]}` as keyof SitePage]??"");

export default function DynamicPage({page,sections,pages,settings}:{page:SitePage;sections:PageSection[];pages:SitePage[];settings:Record<string,string>}){
  const [lang,setLang]=useState<Lang>("fa");const [languageOpen,setLanguageOpen]=useState(false);const t=publicCopy[lang];const dir=direction(lang);
  const nav=useMemo(()=>pages.filter(item=>item.showInNav&&item.published).sort((a,b)=>a.sortOrder-b.sortOrder),[pages]);
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=dir;},[lang,dir]);
  const address=settings[`address${suffix[lang]}`]||settings.addressEn;const phone=settings.phone||"";
  return <main className="site-shell" dir={dir}><header className="main-header"><div className="container header-inner"><Link className="brand" href="/"><img className="brand-logo" src="/images/raufi-logo.webp" alt="Raufi Learning Center logo"/><span className="brand-copy" dir="ltr"><strong>RAUFI</strong><small>LEARNING CENTER</small></span></Link><nav className="desktop-nav main-nav"><Link href="/">{lang==="en"?"Home":lang==="ps"?"کور":"خانه"}</Link>{nav.filter(item=>!item.isHome).map(item=><Link key={item.id} href={`/${item.slug}`}>{pageText(item,"navLabel",lang)||pageText(item,"title",lang)}</Link>)}</nav><div className="language-picker"><button type="button" className="lang-switch" aria-expanded={languageOpen} onClick={()=>setLanguageOpen(value=>!value)}>{t.language}⌄</button>{languageOpen?<div className="language-menu">{(["fa","ps","en"] as Lang[]).map(code=><button key={code} type="button" onClick={()=>{setLang(code);setLanguageOpen(false);}}>{t.languages[code]}</button>)}</div>:null}</div></div></header><div className="dynamic-page-title"><div className="container"><span>{pageText(page,"navLabel",lang)}</span><h1>{pageText(page,"title",lang)}</h1>{pageText(page,"description",lang)?<p>{pageText(page,"description",lang)}</p>:null}</div></div>{sections.sort((a,b)=>a.sortOrder-b.sortOrder).map(section=><BuilderSection key={section.id} section={section} lang={lang}/>) }<footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><div className="brand" dir="ltr"><img className="brand-logo brand-logo-large" src="/images/raufi-logo.webp" alt="Raufi Learning Center logo"/><span className="brand-copy"><strong className="text-white">RAUFI</strong><small className="text-blue-100">LEARNING CENTER</small></span></div><p>{t.footerBody}</p></div><div><h3>{t.quickLinks}</h3><nav><Link href="/">{lang==="en"?"Home":lang==="ps"?"کور":"خانه"}</Link>{nav.filter(item=>!item.isHome).map(item=><Link key={item.id} href={`/${item.slug}`}>{pageText(item,"navLabel",lang)||pageText(item,"title",lang)}</Link>)}</nav></div><div><h3>{t.contactTitle}</h3><p dir="ltr">{phone}</p><p>{address}</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Raufi Learning Center. {t.rights}</span><Link href="/admin">CMS</Link></div></footer></main>;
}
