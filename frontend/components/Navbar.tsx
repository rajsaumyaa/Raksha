'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, Network, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isShield = pathname === '/shield' || pathname === '/';
  const isGraph = pathname === '/graph';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/shield')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30">
              <ShieldAlert className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  RAKSHA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-red-950/80 text-red-400 border border-red-800/50 rounded-full">
                  Live Guard
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                The second opinion scammers can&apos;t isolate you from.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <Link
              href="/shield"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isShield
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Citizen View</span>
            </Link>

            <Link
              href="/graph"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isGraph
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Investigator Graph</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400">Groq AI Active</span>
          </div>

        </div>
      </div>
    </header>
  );
}
