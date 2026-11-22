export const sessionCookie='orbit_admin';
const encoder=new TextEncoder();

async function signature(payload:string,secret:string){
  const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(payload)));
  return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}

export async function makeSession(secret:string){
  const expires=Math.floor(Date.now()/1000)+60*60*8;
  const payload=`${expires}.${crypto.randomUUID()}`;
  return `${payload}.${await signature(payload,secret)}`;
}

export async function validSession(value:string|undefined,secret:string|undefined){
  if(!value||!secret||secret.length<32)return false;
  const parts=value.split('.');
  if(parts.length!==3||!/^[a-f0-9]{64}$/.test(parts[2]))return false;
  const expires=Number(parts[0]);
  if(!Number.isSafeInteger(expires)||expires<=Date.now()/1000)return false;
  const expected=await signature(`${parts[0]}.${parts[1]}`,secret);
  let difference=0;
  for(let i=0;i<64;i++)difference|=expected.charCodeAt(i)^parts[2].charCodeAt(i);
  return difference===0;
}
