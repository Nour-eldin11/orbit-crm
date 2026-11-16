import {NextRequest,NextResponse} from 'next/server';
import {sessionCookie,validSession} from './lib/admin-session';

export async function middleware(request:NextRequest){
  const authenticated=await validSession(request.cookies.get(sessionCookie)?.value,process.env.ORBIT_SESSION_SECRET);
  if(!authenticated){
    const url=new URL('/login/',request.url);
    return NextResponse.redirect(url);
  }
  const response=NextResponse.next();
  response.headers.set('Cache-Control','private, no-store');
  return response;
}

export const config={matcher:['/dashboard/:path*','/customers/:path*','/deals/:path*','/tasks/:path*','/settings/:path*','/reports/:path*','/calendar/:path*']};
