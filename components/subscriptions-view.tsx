'use client';

import {useState} from 'react';
import {ArrowRight,Check,ShieldCheck,Sparkles} from 'lucide-react';
import {BillingCycle,PlanId,plans} from '@/lib/plans';
import {Language,tr} from './bonus-features';

export default function SubscriptionsView({language,currentPlan,currentCycle,currentStatus,onSelect}:{language:Language;currentPlan:PlanId|null;currentCycle?:BillingCycle;currentStatus?:string;onSelect:(plan:PlanId,cycle:BillingCycle)=>Promise<void>}){
  const [cycle,setCycle]=useState<BillingCycle>('monthly');
  const [saving,setSaving]=useState<PlanId|null>(null);
  const [error,setError]=useState('');
  async function select(plan:PlanId){
    setError('');setSaving(plan);
    try{await onSelect(plan,cycle)}catch{setError(tr(language,'Could not update your plan. Please try again.','تعذر تحديث خطتك. حاول مرة أخرى.'))}
    finally{setSaving(null)}
  }
  return <section className="subscriptions-view">
    <div className="subscriptions-intro"><span className="eyebrow">ORBIT PLANS</span><h2>{tr(language,'A plan for every stage of growth','خطة لكل مرحلة من النمو')}</h2><p>{tr(language,'Choose the workspace that fits your team. You can review your choice before any payment.','اختر مساحة العمل المناسبة لفريقك. يمكنك مراجعة اختيارك قبل أي دفع.')}</p></div>
    <div className="billing-switch" role="group" aria-label="Billing cycle"><button aria-pressed={cycle==='monthly'} onClick={()=>setCycle('monthly')}>{tr(language,'Monthly','شهري')}</button><button aria-pressed={cycle==='yearly'} onClick={()=>setCycle('yearly')}>{tr(language,'Yearly','سنوي')} <span>{tr(language,'Save 2 months','وفر شهرين')}</span></button></div>
    {error&&<p className="subscription-error" role="alert">{error}</p>}
    <div className="subscription-plans">{plans.map(plan=>{const isCurrent=currentPlan===plan.id&&currentCycle===cycle;return <article key={plan.id} className={'panel subscription-plan '+(plan.id==='pro'?'recommended':'')}>
      {plan.id==='pro'&&<span className="plan-ribbon"><Sparkles size={14}/>{tr(language,'Popular','الأكثر طلبًا')}</span>}
      <h3>{plan.name}</h3><p>{plan.description}</p>
      <div className="plan-price"><strong>${cycle==='monthly'?plan.monthlyPrice:plan.yearlyPrice}</strong><span>/{cycle==='monthly'?tr(language,'month','شهر'):tr(language,'year','سنة')}</span></div>
      <button className={isCurrent?'secondary plan-action':'primary plan-action'} disabled={saving!==null||isCurrent} onClick={()=>select(plan.id)}>{isCurrent?(currentStatus==='active'?tr(language,'Current plan','خطتك الحالية'):tr(language,'Selected plan','الخطة المختارة')):saving===plan.id?tr(language,'Saving…','جارٍ الحفظ…'):tr(language,'Choose plan','اختر الخطة')}{!isCurrent&&<ArrowRight size={16}/>}</button>
      <div className="plan-divider"/><strong className="plan-features-title">{tr(language,'What’s included','ما تتضمنه الخطة')}</strong><ul>{plan.features.map(feature=><li key={feature}><Check size={15}/>{feature}</li>)}</ul>
      <small><ShieldCheck size={14}/>{plan.limits.customers===null?tr(language,'Unlimited customers','عملاء بلا حد'):plan.limits.customers+' customers'} · {plan.limits.users===null?tr(language,'Unlimited users','مستخدمون بلا حد'):plan.limits.users+' user'+(plan.limits.users===1?'':'s')}</small>
    </article>})}</div>
    <p className="subscription-disclaimer">{tr(language,'Prices are illustrative. Choosing a paid plan saves your preference; no payment is collected and paid features are not activated yet.','الأسعار تجريبية. اختيار خطة مدفوعة يحفظ تفضيلك فقط؛ لا يتم تحصيل أي مبلغ أو تفعيل ميزات مدفوعة حاليًا.')}</p>
  </section>;
}
