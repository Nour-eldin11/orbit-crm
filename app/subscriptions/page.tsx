'use client';

import {FormEvent,useEffect,useState} from 'react';
import Link from 'next/link';
import {Orbit,ArrowLeft,CheckCircle2} from 'lucide-react';
import SubscriptionsView from '@/components/subscriptions-view';
import type {BillingCycle,PlanId} from '@/lib/plans';

type Workspace={name:string;plan:PlanId;billing_cycle:BillingCycle;subscription_status:string};
export default function SubscriptionsPage(){
  const [workspace,setWorkspace]=useState<Workspace|null>(null);
  const [selection,setSelection]=useState<{plan:PlanId;cycle:BillingCycle}|null>(null);
  const [mode,setMode]=useState<'signup'|'login'>('signup');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [signedIn,setSignedIn]=useState(false);
  useEffect(()=>{try{const saved=localStorage.getItem('orbit-pending-plan');if(saved){const parsed=JSON.parse(saved);if(['starter','pro','business'].includes(parsed.plan)&&['monthly','yearly'].includes(parsed.cycle))setSelection(parsed)}}catch{}fetch('/api/subscription',{cache:'no-store'}).then(async response=>{
    if(response.ok){setSignedIn(true);setWorkspace((await response.json()).workspace)}
  }).catch(()=>{})},[]);
  async function choose(plan:PlanId,cycle:BillingCycle){
    setMessage('');setError('');
    if(!signedIn||!workspace&&!name.trim()){setSelection({plan,cycle});localStorage.setItem('orbit-pending-plan',JSON.stringify({plan,cycle}));return}
    await save(plan,cycle);
  }
  async function save(plan:PlanId,cycle:BillingCycle){
    const response=await fetch('/api/subscription',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan,cycle,workspaceName:name.trim()})});
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||'Could not save your choice.');
    setWorkspace(result.workspace);setSelection(null);localStorage.removeItem('orbit-pending-plan');
    setMessage(result.workspace.subscription_status==='active'?'Your Starter plan is active.':'Your plan choice is saved. No payment is collected at this time.');
  }
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError('');setMessage('');
    try{
      if(!signedIn){
        const response=await fetch('/api/customer-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:mode,email,password})});
        const result=await response.json();
        if(!response.ok)throw new Error(result.error||'Could not continue.');
        if(result.confirmationRequired){setMode('login');setMessage('Check your email to confirm the account, then sign in to finish choosing your plan.');return}
        setSignedIn(true);setPassword('');
        const current=await fetch('/api/subscription',{cache:'no-store'});
        if(current.ok){const data=await current.json();setWorkspace(data.workspace);if(!data.workspace&&!name.trim())return}
      }
      if(selection)await save(selection.plan,selection.cycle);
    }catch(reason){setError(reason instanceof Error?reason.message:'Could not continue.')}finally{setBusy(false)}
  }
  async function signOut(){await fetch('/api/customer-auth',{method:'DELETE'});setSignedIn(false);setWorkspace(null);setMessage('Signed out.');}
  return <main className="subscription-public-page"><div className="subscription-public-shell">
    <header className="subscription-public-header"><Link href="/" className="brand"><Orbit size={30}/>orbit<span>CRM</span></Link><div><Link href="/login/"><ArrowLeft size={15}/> Admin sign in</Link>{signedIn&&<button type="button" onClick={signOut}>Sign out</button>}</div></header>
    {workspace&&<div className="subscription-account-banner"><CheckCircle2 size={19}/><span><strong>{workspace.name}</strong> · {workspace.plan} ({workspace.billing_cycle}) · {workspace.subscription_status.replace('_',' ')}</span></div>}
    <SubscriptionsView language="en" currentPlan={workspace?.plan||null} currentCycle={workspace?.billing_cycle} currentStatus={workspace?.subscription_status} onSelect={choose}/>
    {(selection||message||error)&&<section className="subscription-signup panel" aria-live="polite">
      {selection&&<><span className="eyebrow">YOUR SELECTION</span><h2>{selection.plan[0].toUpperCase()+selection.plan.slice(1)} · {selection.cycle}</h2>
      <p>{signedIn?'Name your workspace to save this choice.':'Create a customer account or sign in to save this choice to your own workspace.'}</p>
      <form onSubmit={submit}>
        {!signedIn&&<><div className="auth-switch"><button type="button" aria-pressed={mode==='signup'} onClick={()=>setMode('signup')}>Create account</button><button type="button" aria-pressed={mode==='login'} onClick={()=>setMode('login')}>Sign in</button></div><label>Email address<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254}/></label><label>Password<input type="password" required minLength={12} autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label></>}
        {!workspace&&(mode==='signup'||signedIn)&&<label>Workspace name<input required minLength={1} maxLength={100} placeholder="Your company" value={name} onChange={e=>setName(e.target.value)}/></label>}
        <button className="primary" disabled={busy} type="submit">{busy?'Saving…':signedIn?'Save plan':mode==='signup'?'Create account and continue':'Sign in and continue'}</button>
      </form></>}
      {message&&<p className="subscription-success" role="status">{message}</p>}{error&&<p className="subscription-error" role="alert">{error}</p>}
    </section>}
    <footer className="subscription-public-footer">Orbit CRM · Your workspace, your relationships.</footer>
  </div></main>;
}
