'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {customers} from '@/lib/customers';
import {initialDeals} from '@/lib/data';
import {CustomerDetails} from '@/components/customer-views';
import {Navbar,Sidebar} from '@/components/app-chrome';
import {EmptyState,LoadingSkeleton} from '@/components/ui';
import AmbientMotion from '@/components/ambient-motion';
export default function CustomerRoute({id}:{id:string}){const router=useRouter();const [ready,setReady]=useState(false);const [mobile,setMobile]=useState(false);const [deals,setDeals]=useState(initialDeals);useEffect(()=>{try{const saved=localStorage.getItem('orbit-deals');if(saved)setDeals(JSON.parse(saved))}catch{}setReady(true)},[router]);const customer=customers.find(c=>c.id===id);if(!ready)return <LoadingSkeleton/>;return <div className="app-shell"><Sidebar active="Customers" open={mobile} onClose={()=>setMobile(false)}/><div className="main-shell"><AmbientMotion/><Navbar title={customer?.name??'Customer'} onMenu={()=>setMobile(true)}><button className="secondary detail-mobile-back" onClick={()=>router.push('/dashboard/?view=customers')}>All customers</button></Navbar><main className="content">{customer?<CustomerDetails customer={customer} deals={deals} onBack={()=>router.push('/dashboard/?view=customers')}/>:<EmptyState title="Customer not found" description="This customer is not in the demo data." action={<button className="primary" onClick={()=>router.push('/dashboard/?view=customers')}>Back to customers</button>}/>}</main></div></div>}
