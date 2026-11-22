import {cookies} from 'next/headers';

export const accessCookie='orbit_customer_access';
export const refreshCookie='orbit_customer_refresh';

export function saasConfig(){
  const base=process.env.SUPABASE_URL?.replace(/\/$/,'');
  const key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!base||!/^https:\/\//.test(base)||!key)return null;
  return {base,key};
}

export async function supabaseRequest(path:string,options:RequestInit={},token?:string){
  const config=saasConfig();
  if(!config)throw new Error('SaaS database is not configured');
  return fetch(config.base+path,{
    ...options,cache:'no-store',
    headers:{apikey:config.key,Authorization:`Bearer ${token||config.key}`,...options.headers},
  });
}

export async function customerToken(){
  const jar=await cookies();
  const token=jar.get(accessCookie)?.value;
  if(!token)return null;
  const response=await supabaseRequest('/auth/v1/user',{},token);
  if(!response.ok)return null;
  const user=await response.json() as {id?:string};
  return user.id?token:null;
}
