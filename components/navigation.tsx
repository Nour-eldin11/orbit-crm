'use client';

import {Orbit, LayoutDashboard, Users, Handshake, CheckSquare, BarChart3, CalendarDays} from 'lucide-react';
import {Language, labels} from './bonus-features';

const navigation = [
  {name: 'Overview', icon: LayoutDashboard},
  {name: 'Customers', icon: Users},
  {name: 'Deals', icon: Handshake},
  {name: 'Tasks', icon: CheckSquare},
  {name: 'Reports', icon: BarChart3},
  {name: 'Calendar', icon: CalendarDays},
] as const;

export type WorkspacePage = (typeof navigation)[number]['name'];

export function Brand() {
  return <a href="/dashboard/" className="brand"><Orbit size={30}/>orbit<span>CRM</span></a>;
}

export function WorkspaceNav({active, language = 'en', taskCount, onNavigate}: {
  active: string;
  language?: Language;
  taskCount?: number;
  onNavigate: (page: WorkspacePage) => void;
}) {
  return <nav aria-label="Workspace navigation">
    {navigation.map(({name, icon: Icon}) => <button
      key={name}
      type="button"
      className={`nav-item ${active === name ? 'active' : ''}`}
      aria-current={active === name ? 'page' : undefined}
      onClick={() => onNavigate(name)}
    >
      <Icon size={19}/>{labels[language][name]}
      {name === 'Tasks' && taskCount !== undefined && <span className="nav-count">{taskCount}</span>}
      {active === name && <span className="active-dot"/>}
    </button>)}
  </nav>;
}
