import {NextRequest,NextResponse} from 'next/server';
import {customerToken,saasConfig,supabaseRequest} from '@/lib/saas';
import {BillingCycle,PlanId} from '@/lib/plans';

export const runtime='nodejs';
const headers={'Cache-Control':'no-store'};
const reply=(data:unknown,status=200)=>NextResponse.json(data,{status,headers});
type Workspace={id:string;name:string;plan:PlanId;billing_cycle:BillingCycle;subscription_status:string};
async function workspace(token:string){
  const response=await supabaseRequest('/rest/v1/workspaces?select=id,name,plan,billing_cycle,subscription_status&order=created_at.asc&limit=1',{},token);
  if(!response.ok)throw new Error('Workspace lookup failed');
  return (await response.json() as Workspace[])[0]||null;
}
export async function GET(){
  if(!saasConfig())return reply({error:'Subscriptions are not configured yet.'},503);
  try{const token=await customerToken();if(!token)return reply({error:'Sign in to manage a subscription.'},401);return reply({workspace:await workspace(token)})}catch{return reply({error:'Could not load your subscription.'},502)}
}
export async function POST(request:NextRequest){
  if(!saasConfig())return reply({error:'Subscriptions are not configured yet.'},503);
  if(request.headers.get('origin')&&request.headers.get('origin')!==request.nextUrl.origin)return reply({error:'Invalid request.'},403);
  let data:Record<string,unknown>;
  try{data=await request.json()}catch{return reply({error:'Invalid request.'},400)}
  const {plan,cycle}=data;
  const name=typeof data.workspaceName==='string'?data.workspaceName.trim():'';
  if(!['starter','pro','business'].includes(String(plan))||!['monthly','yearly'].includes(String(cycle))||name.length>100)return reply({error:'Invalid plan or workspace name.'},400);
  try{
    const token=await customerToken();if(!token)return reply({error:'Sign in to choose a plan.'},401);
    let current=await workspace(token);
    if(!current){
      if(!name)return reply({error:'Enter a workspace name.'},400);
      const created=await supabaseRequest('/rest/v1/rpc/create_workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({workspace_name:name})},token);
      if(!created.ok)return reply({error:'Could not create your workspace.'},400);
      current=await workspace(token);
    }
    if(!current)return reply({error:'Could not find your workspace.'},502);
    const saved=await supabaseRequest('/rest/v1/rpc/choose_plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({target_workspace:current.id,new_plan:plan,new_cycle:cycle})},token);
    if(!saved.ok)return reply({error:'Only the workspace owner can change its plan.'},403);
    return reply({workspace:await workspace(token)});
  }catch{return reply({error:'Could not save your plan.'},502)}
}
