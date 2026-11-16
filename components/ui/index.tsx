'use client';
import {forwardRef,InputHTMLAttributes,ButtonHTMLAttributes,ReactNode,SelectHTMLAttributes,useEffect,useRef,useState} from 'react';
import {Search,X,ChevronLeft,ChevronRight,ArrowUpRight,type LucideIcon} from 'lucide-react';
export const Button=forwardRef<HTMLButtonElement,ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'text'}>(function Button({variant='secondary',className='',...props},ref){return <button ref={ref} className={`inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${variant==='text'?'text-button':variant} ${className}`} {...props}/>});
export const Input=forwardRef<HTMLInputElement,InputHTMLAttributes<HTMLInputElement>>(function Input({className='',...props},ref){return <input ref={ref} className={`ui-input w-full outline-none transition-colors ${className}`} {...props}/>});
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <section className={`panel min-w-0 ${className}`}>{children}</section>}
export function SummaryCard({label,value,change,footnote,icon:Icon,points,index=0,task=false}:{label:string;value:string;change:string;footnote:string;icon:LucideIcon;points:string;index?:number;task?:boolean}){
  return <article className="stat-card min-w-0 transition-transform duration-200 hover:-translate-y-0.5">
    <div className="stat-title"><span>{label}</span><Icon size={18}/></div>
    <div className="stat-main"><strong>{value}</strong><svg viewBox="0 0 100 44" className={`sparkline spark-${index}`} aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
    <div className="stat-foot"><span className={task?'task-status':'trend'}>{!task&&<ArrowUpRight size={13}/>} {change}</span><span>{footnote}</span></div>
  </article>
}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}){return <span className={`ui-badge inline-flex items-center rounded-full ui-badge-${tone.toLowerCase().replaceAll(' ','-')}`}>{children}</span>}
export function HorizontalScroll({children,className='',label='Horizontal content'}:{children:ReactNode;className?:string;label?:string}){
  const viewport=useRef<HTMLDivElement>(null);
  const [edges,setEdges]=useState({left:false,right:false});
  useEffect(()=>{
    const el=viewport.current;if(!el)return;
    const update=()=>{
      const max=Math.max(0,el.scrollWidth-el.clientWidth);
      const rtl=getComputedStyle(el).direction==='rtl';
      const x=el.scrollLeft;
      setEdges(rtl?{left:x>-max+2,right:x< -2}:{left:x>2,right:x<max-2});
    };
    const observer=new ResizeObserver(update);
    observer.observe(el);
    if(el.firstElementChild)observer.observe(el.firstElementChild);
    el.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    update();
    return()=>{observer.disconnect();el.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
  },[children]);
  return <div className="horizontal-scroll"><div className="horizontal-scroll-actions" aria-label={label+' controls'}><span>Scroll to explore</span><button type="button" aria-label={'Scroll '+label+' left'} disabled={!edges.left} onClick={()=>viewport.current?.scrollBy({left:-320,behavior:'smooth'})}><ChevronLeft size={17}/></button><button type="button" aria-label={'Scroll '+label+' right'} disabled={!edges.right} onClick={()=>viewport.current?.scrollBy({left:320,behavior:'smooth'})}><ChevronRight size={17}/></button></div><div ref={viewport} tabIndex={0} role="region" aria-label={label} className={`horizontal-scroll-viewport ${className}`}>{children}</div></div>;
}
export function DataTable({children,className=''}:{children:ReactNode;className?:string}){return <HorizontalScroll className={`table-scroll w-full overflow-x-auto ${className}`} label="data table">{children}</HorizontalScroll>}
export function Dropdown({children,...props}:SelectHTMLAttributes<HTMLSelectElement>){return <select className="ui-dropdown" {...props}>{children}</select>}
export function SearchBar({value,onChange,placeholder='Search…',label='Search'}:{value:string;onChange:(v:string)=>void;placeholder?:string;label?:string}){return <label className="customer-search flex items-center gap-2"><Search size={16}/><Input aria-label={label} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></label>}
export function Pagination({page,pages,total,size,onPageChange,onSizeChange}:{page:number;pages:number;total:number;size:number;onPageChange:(p:number)=>void;onSizeChange:(s:number)=>void}){return <div className="pagination"><span>{total?`${(page-1)*size+1}–${Math.min(page*size,total)}`:'0'} of {total} customers</span><label>Rows <Dropdown aria-label="Customers per page" value={size} onChange={e=>onSizeChange(Number(e.target.value))}><option value={6}>6</option><option value={12}>12</option></Dropdown></label><div className="page-buttons"><Button aria-label="Previous customer page" disabled={page===1} onClick={()=>onPageChange(page-1)}><ChevronLeft size={16}/></Button>{Array.from({length:pages},(_,i)=><Button key={i} className={page===i+1?'current-page':''} aria-label={'Customer page '+(i+1)} aria-current={page===i+1?'page':undefined} onClick={()=>onPageChange(i+1)}>{i+1}</Button>)}<Button aria-label="Next customer page" disabled={page===pages} onClick={()=>onPageChange(page+1)}><ChevronRight size={16}/></Button></div></div>}
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="empty-state flex flex-col items-center justify-center"><Search size={24}/><h3>{title}</h3><p>{description}</p>{action}</div>}
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
  const dialog=useRef<HTMLElement>(null);
  const closeRef=useRef(onClose);
  closeRef.current=onClose;
  useEffect(()=>{
    const previousFocus=document.activeElement as HTMLElement|null;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus();
    function onKeyDown(event:KeyboardEvent){
      if(event.key==='Escape')closeRef.current();
      if(event.key!=='Tab'||!dialog.current)return;
      const controls=Array.from(dialog.current.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]'));
      if(!controls.length)return;
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
    document.addEventListener('keydown',onKeyDown);
    return()=>{document.removeEventListener('keydown',onKeyDown);document.body.style.overflow=previousOverflow;previousFocus?.focus()};
  },[]);
  return <div className="modal-backdrop fixed inset-0 flex items-center justify-center" onClick={onClose}><section ref={dialog} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e=>e.stopPropagation()}><Button variant="text" className="modal-close icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></Button><span className="eyebrow">LET’S KEEP THINGS MOVING</span><h2 id="modal-title">{title}</h2>{children}</section></div>
}
export function LoadingSkeleton({rows=4}:{rows?:number}){return <div className="skeleton-panel animate-pulse" role="status" aria-label="Loading content">{Array.from({length:rows},(_,i)=><div className="skeleton-row" key={i}><span/><span/><span/></div>)}</div>}
