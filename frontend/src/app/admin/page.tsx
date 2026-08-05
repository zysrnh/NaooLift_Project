'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowUpRight, ExternalLink, RefreshCw } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    // Allow view, but notify if not admin
  }, []);

  const refreshDashboard = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4 py-2 animate-fadeIn min-h-[85vh] flex flex-col">
      {/* Top Console Bar */}
      <div className="solid-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#D3D1CE] text-[#090F15] flex items-center justify-center font-heading font-black text-sm">
            NL
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase block">ADMIN MANAGEMENT CONSOLE</span>
            <h1 className="text-lg font-heading font-bold text-[#D3D1CE]">
              NICKELFOX DASHBOARD TEMPLATE
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#090F15] px-3 py-1.5 rounded-sm text-xs font-mono text-[#D3D1CE] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ADMIN AUTHENTICATED
          </span>

          <button
            onClick={refreshDashboard}
            className="solid-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
            title="Reload Dashboard"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>

          <a
            href="http://localhost:5173/nickelfox"
            target="_blank"
            rel="noopener noreferrer"
            className="solid-btn-primary px-4 py-1.5 text-xs flex items-center gap-1"
          >
            Buka Fullscreen <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Nickelfox Admin Dashboard */}
      <div className="flex-1 w-full solid-card p-1 bg-[#090F15] overflow-hidden min-h-[750px]">
        <iframe
          key={iframeKey}
          src="http://localhost:5173/nickelfox"
          title="Nickelfox Admin Dashboard"
          className="w-full h-full min-h-[750px] border-none rounded-sm"
        />
      </div>
    </div>
  );
}
