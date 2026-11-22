export type PlanId='starter'|'pro'|'business';
export type BillingCycle='monthly'|'yearly';

export type Plan={
  id:PlanId;
  name:string;
  description:string;
  monthlyPrice:number;
  yearlyPrice:number;
  features:string[];
  limits:{customers:number|null;users:number|null};
};

// Preview prices. Replace with the published prices before accepting payment.
export const plans:Plan[]=[
  {id:'starter',name:'Starter',description:'A focused space for your first relationships.',monthlyPrice:0,yearlyPrice:0,features:['Customer records and notes','Task planning','Basic deal pipeline','Email support'],limits:{customers:100,users:1}},
  {id:'pro',name:'Pro',description:'More room for a growing sales team.',monthlyPrice:29,yearlyPrice:290,features:['Everything in Starter','Unlimited customers','Advanced reports','Calendar and reminders','Priority support'],limits:{customers:null,users:5}},
  {id:'business',name:'Business',description:'Shared control across the whole company.',monthlyPrice:79,yearlyPrice:790,features:['Everything in Pro','Unlimited team members','Workspace roles','Custom onboarding','Dedicated support'],limits:{customers:null,users:null}},
];
