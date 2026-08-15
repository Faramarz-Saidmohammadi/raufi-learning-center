type RuntimeEnv=Record<string,unknown>;

declare global{
  var __RAUFI_TEST_ENV__:RuntimeEnv|undefined;
}

export async function getRuntimeEnv():Promise<RuntimeEnv>{
  if(globalThis.__RAUFI_TEST_ENV__)return globalThis.__RAUFI_TEST_ENV__;
  const {env}=await import("cloudflare:workers");
  return env as unknown as RuntimeEnv;
}
