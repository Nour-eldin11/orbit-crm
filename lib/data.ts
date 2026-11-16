export const initialDeals = [
{id:1,company:'Acme Inc.',initial:'A',color:'purple',name:'Enterprise workspace',contact:'Olivia Rhye',value:24500,stage:'Negotiation',date:'Nov 14, 2026'},
{id:2,company:'Layers',initial:'L',color:'blue',name:'Platform expansion',contact:'Phoenix Baker',value:18200,stage:'Proposal',date:'Nov 18, 2026'},
{id:3,company:'Sisyphus',initial:'S',color:'orange',name:'Annual team plan',contact:'Lana Steiner',value:12800,stage:'Contacted',date:'Nov 21, 2026'},
{id:4,company:'Catalog',initial:'C',color:'green',name:'Growth partnership',contact:'Demi Wilkinson',value:32000,stage:'Won',date:'Nov 08, 2026'},
{id:5,company:'Circooles',initial:'C',color:'purple',name:'Team onboarding',contact:'Drew Cano',value:9600,stage:'Lead',date:'Dec 02, 2026'},
{id:6,company:'Hourglass',initial:'H',color:'blue',name:'Workspace renewal',contact:'Natali Craig',value:21400,stage:'Proposal',date:'Nov 25, 2026'},
{id:7,company:'Command+R',initial:'C',color:'orange',name:'Agency partnership',contact:'Orlando Diggs',value:14500,stage:'Lost',date:'Nov 05, 2026'},
{id:8,company:'Quotient',initial:'Q',color:'green',name:'Analytics rollout',contact:'Andi Lane',value:16800,stage:'Lead',date:'Dec 10, 2026'}
];
export const taskStatuses=['To do','In progress','Completed'] as const;
export type Task={id:number;title:string;company:string;time:string;priority:string;done:boolean;status:typeof taskStatuses[number];dueDate:string};
export const initialTasks:Task[] = [
{id:1,title:'Follow up with Olivia',company:'Acme Inc.',time:'10:30 AM',priority:'High',done:false,status:'To do',dueDate:'2026-11-09'},
{id:2,title:'Send proposal to Layers',company:'Layers',time:'12:00 PM',priority:'Medium',done:false,status:'In progress',dueDate:'2026-11-10'},
{id:3,title:'Prepare quarterly review',company:'Internal',time:'02:00 PM',priority:'Low',done:false,status:'To do',dueDate:'2026-11-12'},
{id:4,title:'Discovery call with Sisyphus',company:'Sisyphus',time:'03:30 PM',priority:'High',done:false,status:'To do',dueDate:'2026-11-11'}
];
