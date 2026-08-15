export type ContactInput={
  name:string;
  phone:string;
  interest:string;
  educationLevel:string;
  preferredTime:string;
  message:string;
  sourceLanguage:"fa"|"en"|"ps";
  consentAt:string;
};

export type ContactResult=
  |{ok:true;spam:boolean;data:ContactInput}
  |{ok:false;status:400;code:string;error:string};

const digitMap:Record<string,string>={"۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"};
const text=(value:unknown,max:number)=>String(value??"").trim().slice(0,max);

export function normalizePhone(value:unknown){
  return text(value,40).replace(/[۰-۹٠-٩]/g,char=>digitMap[char]??char).replace(/[^+0-9\s()-]/g,"").replace(/\s+/g," ");
}

export function parseContactPayload(payload:unknown,now=new Date()):ContactResult{
  if(!payload||typeof payload!=="object")return{ok:false,status:400,code:"invalid_payload",error:"Invalid form data."};
  const input=payload as Record<string,unknown>;
  const website=text(input.website,120);
  const name=text(input.name,80);
  const phone=normalizePhone(input.phone);
  const interest=text(input.interest,120);
  const educationLevel=text(input.educationLevel,80);
  const preferredTime=text(input.preferredTime,80);
  const message=text(input.message,1000);
  const language=text(input.sourceLanguage,2);
  const sourceLanguage:ContactInput["sourceLanguage"]=language==="en"||language==="ps"?language:"fa";
  const consent=input.consent===true||input.consent==="true"||input.consent==="on"||input.consent===1;
  const data={name,phone,interest,educationLevel,preferredTime,message,sourceLanguage,consentAt:now.toISOString()};
  if(website)return{ok:true,spam:true,data};
  if(name.length<2)return{ok:false,status:400,code:"invalid_name",error:"A valid name is required."};
  if(!/^\+?[0-9][0-9\s()-]{6,29}$/.test(phone))return{ok:false,status:400,code:"invalid_phone",error:"A valid phone number is required."};
  if(!interest)return{ok:false,status:400,code:"missing_programme",error:"Select a programme."};
  if(!consent)return{ok:false,status:400,code:"consent_required",error:"Consent is required before submitting contact information."};
  return{ok:true,spam:false,data};
}
