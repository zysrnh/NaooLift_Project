'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Calendar, Play, Trophy } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#090F15] w-full border-b border-[#262E36]/40">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-sm bg-[#D3D1CE] flex items-center justify-center text-[#090F15] transition-transform group-hover:scale-105">
            <Dumbbell className="w-4 h-4 -rotate-12" />
          </div>
          <span className="font-heading font-extrabold text-xl text-[#D3D1CE] tracking-tight">
            NAOOLIFT
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-heading">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === '/' ? 'text-[#FFFFFF] font-bold' : 'text-[#B3B7BA] hover:text-[#D3D1CE]'
            }`}
          >
            Beranda & Fitur
          </Link>
          <Link
            href="/routines"
            className={`transition-colors ${
              pathname === '/routines' ? 'text-[#FFFFFF] font-bold' : 'text-[#B3B7BA] hover:text-[#D3D1CE]'
            }`}
          >
            Jadwal Split
          </Link>
          <Link
            href="/history"
            className={`transition-colors ${
              pathname === '/history' ? 'text-[#FFFFFF] font-bold' : 'text-[#B3B7BA] hover:text-[#D3D1CE]'
            }`}
          >
            Analytics & PR
          </Link>
        </nav>

        {/* CTA Button Far Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/logger"
            className="solid-btn-primary px-5 py-2 text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Catat Latihan
          </Link>
        </div>
      </div>
    </header>
  );
}
