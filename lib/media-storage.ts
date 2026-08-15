import { getRuntimeEnv } from "@/lib/runtime-env";

export type StoredObject={body:ReadableStream<Uint8Array>|ArrayBuffer;httpEtag?:string;writeHttpMetadata?:(headers:Headers)=>void};
export type MediaBucket={
  put:(key:string,value:ArrayBuffer,options?:{httpMetadata?:{contentType?:string;cacheControl?:string}})=>Promise<unknown>;
  get:(key:string)=>Promise<StoredObject|null>;
  delete:(key:string)=>Promise<void>;
};

export async function getMediaBucket(){
  const env=await getRuntimeEnv();const bucket=env.BUCKET as MediaBucket|undefined;
  if(!bucket)throw new Error("Media storage is unavailable.");
  return bucket;
}
