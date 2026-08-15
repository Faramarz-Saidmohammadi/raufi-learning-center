/* eslint-disable @next/next/no-img-element */
import type { PageSection } from "@/lib/content";
import type { Lang } from "@/lib/public-copy";

const suffix:Record<Lang,"Fa"|"En"|"Ps">={fa:"Fa",en:"En",ps:"Ps"};
const text=(section:PageSection,field:"eyebrow"|"heading"|"body"|"imageAlt"|"ctaLabel"|"navLabel",lang:Lang)=>String(section[`${field}${suffix[lang]}` as keyof PageSection]??"");

type Item={value?:string;title?:string;titleFa?:string;titleEn?:string;titlePs?:string;body?:string;bodyFa?:string;bodyEn?:string;bodyPs?:string};
function items(section:PageSection):Item[]{try{const value=JSON.parse(section.itemsJson);return Array.isArray(value)?value.slice(0,12):[];}catch{return[];}}
function itemText(item:Item,field:"title"|"body",lang:Lang){return String(item[`${field}${suffix[lang]}` as keyof Item]??item[field]??"");}

export default function BuilderSection({section,lang,home=false}:{section:PageSection;lang:Lang;home?:boolean}){
  const eyebrow=text(section,"eyebrow",lang),heading=text(section,"heading",lang),body=text(section,"body",lang),alt=text(section,"imageAlt",lang)||heading;
  const cta=text(section,"ctaLabel",lang);const list=items(section);const dark=section.theme==="dark";
  if(section.type==="stats")return <section id={section.sectionKey} className={`builder-stats ${dark?"dark":""}`} style={{order:section.sortOrder}}><div className="container builder-stats-grid">{list.map((item,index)=><article key={`${item.value}-${index}`}><strong>{item.value||"—"}</strong><span>{itemText(item,"title",lang)}</span></article>)}</div></section>;
  if(section.type==="gallery")return <section id={section.sectionKey} className={`section builder-section ${dark?"dark":""}`} style={{order:section.sortOrder}}><div className="container"><BuilderHeading eyebrow={eyebrow} heading={heading} body={body}/><div className="builder-gallery">{section.imageUrl?<img src={section.imageUrl} alt={alt}/>:null}{section.secondaryImageUrl?<img src={section.secondaryImageUrl} alt={alt}/>:null}</div></div></section>;
  if(section.type==="hero")return <section id={section.sectionKey} className="builder-hero" style={{order:section.sortOrder}}><div className="container builder-hero-grid"><div><span className="section-kicker light"><span/>{eyebrow}</span><h1>{heading}</h1><p>{body}</p>{cta&&section.ctaUrl?<a className="gold-button" href={section.ctaUrl}>{cta} →</a>:null}</div>{section.imageUrl?<img src={section.imageUrl} alt={alt}/>:null}</div></section>;
  return <section id={section.sectionKey} className={`section builder-section ${dark?"dark":""}`} style={{order:section.sortOrder}}><div className={`container builder-content ${section.type==="imageText"&&section.imageUrl?"has-image":""}`}><div><BuilderHeading eyebrow={eyebrow} heading={heading} body={body}/>{list.length?<div className="builder-item-grid">{list.map((item,index)=><article key={index}><span>{String(index+1).padStart(2,"0")}</span><h3>{itemText(item,"title",lang)}</h3><p>{itemText(item,"body",lang)}</p></article>)}</div>:null}{cta&&section.ctaUrl?<a className={dark?"gold-button":"primary-button"} href={section.ctaUrl}>{cta} →</a>:null}</div>{section.imageUrl?<img className="builder-content-image" src={section.imageUrl} alt={alt}/>:null}</div>{home?null:null}</section>;
}

function BuilderHeading({eyebrow,heading,body}:{eyebrow:string;heading:string;body:string}){return <header className="section-heading"><span className="section-kicker"><span/>{eyebrow}</span><h2>{heading}</h2>{body?<p className="builder-body">{body}</p>:null}</header>;}
