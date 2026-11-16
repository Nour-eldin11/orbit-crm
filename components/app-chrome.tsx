'use client';

import {ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {LogOut, Menu, Settings, X} from 'lucide-react';
import {Brand, WorkspaceNav, WorkspacePage} from './navigation';
import {Language, labels} from './bonus-features';

export function Navbar({title, children, onMenu}: {
  title: string;
  children?: ReactNode;
  onMenu?: () => void;
}) {
  return <header className="topbar">
    <div className="breadcrumb">
      {onMenu && <button type="button" className="mobile-toggle icon-button" aria-label="Open navigation" onClick={onMenu}><Menu size={20}/></button>}
      <span>Workspace</span><span className="slash">/</span><strong>{title}</strong>
    </div>
    <div className="top-actions">{children}</div>
  </header>;
}

export function Sidebar({active, children, open = false, onClose, language = 'en'}: {
  active: string;
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
  language?: Language;
}) {
  const router = useRouter();
  const navigate = (page: WorkspacePage) => {
    onClose?.();
    router.push(page === 'Overview' ? '/dashboard/' : `/${page.toLowerCase()}/`);
  };

  return <>
    {open && <button type="button" className="sidebar-scrim" aria-label="Close navigation" onClick={onClose}/>}
    <aside className={`sidebar ${open ? 'mobile-open' : ''}`}>
      <Brand/>
      <button type="button" className="mobile-close icon-button" aria-label="Close navigation" onClick={onClose}><X size={18}/></button>
      <p className="nav-label" style={{marginTop: 40}}>WORKSPACE</p>
      <WorkspaceNav active={active} language={language} onNavigate={navigate}/>
      <div className="sidebar-bottom">
        {children}
        <button type="button" className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => {onClose?.(); router.push('/settings/')}}><Settings size={18}/>{labels[language].Settings}</button>
        <button type="button" className="nav-item" onClick={async()=>{await fetch('/api/logout',{method:'POST'});router.replace('/login/');router.refresh()}}><LogOut size={18}/>Sign out</button>
      </div>
    </aside>
  </>;
}
