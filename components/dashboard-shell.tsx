'use client';

import Workspace from './workspace';
import type {WorkspacePage} from './navigation';

export default function DashboardShell({page}: {page: WorkspacePage | 'Settings'}) {
  // The server middleware checks the signed HttpOnly session before serving this route.
  return <Workspace initialTab={page}/>;
}
