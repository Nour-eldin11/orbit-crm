import {NextRequest,NextResponse} from 'next/server';
import {accessCookie,refreshCookie,saasConfig,supabaseRequest} from '@/lib/saas';

export const runtime='nodejs';
const headers={'Cache-Control':'no-store'};
const error=(message:string,status:number)=>NextResponse.json({error:message},{status,headers});
export async function POST(request:NextRequest){
  if(!saasConfig())return error('Customer accounts are not configured yet.',503);
  if(request.headers.get('origin')&&request.headers.get('origin')!==request.nextUrl.origin)return error('Invalid request.',403);
  let body:Record<string,unknown>;
  try{body=await request.json()}catch{return error('Invalid request.',400)}
  const {email,password,action}=body;
  if(typeof email!=='string'||typeof password!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||password.length<12||password.length>1024||!['signup','login'].includes(String(action)))return error('Enter a valid email and a password of at least 12 characters.',400);
  try{
    const signup=action==='signup';
    const response=await supabaseRequest(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim().toLowerCase(),password}),
    });
    const result=await response.json() as {access_token?:string;refresh_token?:string;expires_in?:number;msg?:string;error_description?:string};
    if(!response.ok)return error(result.msg||result.error_description||'Authentication failed.',response.status===429?429:400);
    if(!result.access_token||!result.refresh_token)return NextResponse.json({ok:true,confirmationRequired:true},{headers});
    const out=NextResponse.json({ok:true,confirmationRequired:false},{headers});
    const cookie={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/'};
    out.cookies.set(accessCookie,result.access_token,{...cookie,maxAge:result.expires_in||3600});
    out.cookies.set(refreshCookie,result.refresh_token,{...cookie,maxAge:60*60*24*30});
    return out;
  }catch{return error('Authentication service is unavailable.',502)}
}

export async function DELETE(request:NextRequest){
  if(request.headers.get('origin')&&request.headers.get('origin')!==request.nextUrl.origin)return error('Invalid request.',403);
  const response=NextResponse.json({ok:true},{headers});
  response.cookies.delete(accessCookie);response.cookies.delete(refreshCookie);
  return response;
}
