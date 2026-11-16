import CustomerRoute from './customer-page';
import {customers} from '@/lib/customers';
export function generateStaticParams(){return customers.map(c=>({id:c.id}))}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerRoute id={id}/>}
