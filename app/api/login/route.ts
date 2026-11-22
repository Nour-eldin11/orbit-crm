import {createHash,timingSafeEqual} from 'node:crypto';
import {NextRequest,NextResponse} from 'next/server';
import {makeSession,sessionCookie} from '@/lib/admin-session';

export const runtime='nodejs';

export async function POST(request:NextRequest){
  const adminEmail=process.env.ORBIT_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword=process.env.ORBIT_ADMIN_PASSWORD;
  const secret=process.env.ORBIT_SESSION_SECRET;
  const headers={'Cache-Control':'no-store'};
  if(!adminEmail||!adminPassword||!secret||secret.length<32)return NextResponse.json({error:'Admin access is not configured.'},{status:503,headers});
  const origin=request.headers.get('origin');
  if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:'Invalid request.'},{status:403,headers});
  let body:unknown;
  try {body=await request.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400,headers})}
  if(!body||typeof body!=='object')return NextResponse.json({error:'Invalid request.'},{status:400,headers});
  const {email,password}=body as Record<string,unknown>;
  if(typeof email!=='string'||typeof password!=='string'||email.length>254||password.length>1024)return NextResponse.json({error:'Invalid request.'},{status:400,headers});
  const digest=(value:string)=>createHash('sha256').update(value).digest();
  const matchingEmail=timingSafeEqual(digest(email.trim().toLowerCase()),digest(adminEmail));
  const matchingPassword=timingSafeEqual(digest(password),digest(adminPassword));
  if(!matchingEmail||!matchingPassword)return NextResponse.json({error:'Invalid credentials.'},{status:401,headers});
  const response=NextResponse.json({ok:true},{headers});
  response.cookies.set(sessionCookie,await makeSession(secret),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*8});
  return response;
}
