import type { Metadata } from 'next';
import './globals.css';
import './glassy-reference.css';
import ThemeLoader from '@/components/theme-loader';
export const metadata: Metadata = { title: 'Orbit — Your business, in focus', description: 'A modern CRM workspace for relationships, deals, and everything next.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><ThemeLoader/>{children}</body></html> }
