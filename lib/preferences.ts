export type Profile={name:string;email:string;phone:string;role:string;company:string};
export type Preferences={taskReminders:boolean;dealUpdates:boolean;weeklySummary:boolean;theme:'light'|'dark'|'system'|'ocean';accent:'violet'|'blue'|'teal'|'rose';language:'en'|'ar';glassIntensity:number};
export const defaultProfile:Profile={name:'Alex Sullivan',email:'alex@acme.com',phone:'+1 (415) 555-0120',role:'Sales Manager',company:'Acme Inc.'};
export const defaultPreferences:Preferences={taskReminders:true,dealUpdates:true,weeklySummary:false,theme:'light',accent:'violet',language:'en',glassIntensity:70};
export const initials=(name:string)=>name.trim().split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
