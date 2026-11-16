'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Workspace from './workspace';
import type {WorkspacePage} from './navigation';

export default function DashboardShell({page}: {page: WorkspacePage | 'Settings'}) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('orbit-session')) setSignedIn(true);
    else router.replace('/login/');
  }, [router]);

  return signedIn ? <Workspace initialTab={page}/> : <main className="session-loading" role="status">Opening your workspace…</main>;
}
