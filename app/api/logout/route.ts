import {NextRequest,NextResponse} from 'next/server';
import {sessionCookie} from '@/lib/admin-session';

export async function POST(request:NextRequest){
  const origin=request.headers.get('origin');
  if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:'Invalid request.'},{status:403});
  const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  response.cookies.delete(sessionCookie);
  return response;
}
