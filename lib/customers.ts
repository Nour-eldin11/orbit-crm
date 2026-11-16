export const stages = ['Lead','Contacted','Proposal','Negotiation','Won','Lost'] as const;
const records = [
['Olivia Rhye','Acme Inc.','olivia@acme.example','+1 (415) 555-0101','Active','VP of Operations','Software','San Francisco, CA','201–500','acme.example'],
['Phoenix Baker','Layers','phoenix@layers.example','+1 (212) 555-0102','Active','Head of Design','Design services','New York, NY','51–200','layers.example'],
['Lana Steiner','Sisyphus','lana@sisyphus.example','+1 (512) 555-0103','Prospect','Founder','Technology','Austin, TX','11–50','sisyphus.example'],
['Demi Wilkinson','Catalog','demi@catalog.example','+1 (206) 555-0104','Active','Sales Director','Commerce','Seattle, WA','51–200','catalog.example'],
['Drew Cano','Circooles','drew@circooles.example','+1 (617) 555-0105','Prospect','CEO','Consulting','Boston, MA','11–50','circooles.example'],
['Natali Craig','Hourglass','natali@hourglass.example','+1 (303) 555-0106','Active','Product Lead','Software','Denver, CO','51–200','hourglass.example'],
['Orlando Diggs','Command+R','orlando@commandr.example','+1 (312) 555-0107','Inactive','Managing Director','Marketing','Chicago, IL','11–50','commandr.example'],
['Andi Lane','Quotient','andi@quotient.example','+1 (310) 555-0108','Prospect','Operations Lead','Analytics','Los Angeles, CA','51–200','quotient.example'],
['Kate Morrison','Capsule','kate@capsule.example','+1 (503) 555-0109','Active','Customer Success Lead','Healthcare','Portland, OR','201–500','capsule.example'],
['Koray Okumus','Spherule','koray@spherule.example','+1 (305) 555-0110','Inactive','Co-founder','Finance','Miami, FL','11–50','spherule.example'],
['Eva Bond','CloudWatch','eva@cloudwatch.example','+1 (404) 555-0111','Prospect','Engineering Manager','Cloud services','Atlanta, GA','51–200','cloudwatch.example'],
['Alec Whitten','Northstar','alec@northstar.example','+1 (619) 555-0112','Active','Procurement Lead','Logistics','San Diego, CA','201–500','northstar.example']
];
// Permanent mock identifiers: these values do not depend on sorting or filtering.
const customerIds = ['ORB-C-0001','ORB-C-0002','ORB-C-0003','ORB-C-0004','ORB-C-0005','ORB-C-0006','ORB-C-0007','ORB-C-0008','ORB-C-0009','ORB-C-0010','ORB-C-0011','ORB-C-0012'] as const;
export const customers=records.map((r,i)=>({id:String(i+1),customerId:customerIds[i],name:r[0],company:r[1],email:r[2],phone:r[3],status:r[4],role:r[5],industry:r[6],location:r[7],size:r[8],website:r[9],color:['purple','blue','orange','green'][i%4],joined:`Oct ${String(i+3).padStart(2,'0')}, 2026`,notes:i===0?'Prefers email follow-ups. Discuss annual pricing and onboarding support at the next review.':`Follow up with ${r[0].split(' ')[0]} about the team’s priorities and next steps.`,activities:[{title:i%2===0?'Discovery call completed':'Account review completed',detail:`Discussed ${r[1]}’s goals and upcoming plans.`,date:'Nov 8, 2026 · 2:30 PM'},{title:'Follow-up email sent',detail:'Shared the product overview and agreed on next steps.',date:'Nov 6, 2026 · 10:15 AM'},{title:'Customer added to Orbit',detail:'Alex Sullivan created this customer record.',date:`Oct ${String(i+3).padStart(2,'0')}, 2026 · 9:00 AM`}]}));
export type Customer=typeof customers[number];
