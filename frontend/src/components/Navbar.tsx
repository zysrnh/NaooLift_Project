'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Calendar, PlayCircle, Trophy, BarChart2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: BarChart2 },
    { name: 'Jadwal Split', href: '/routines', icon: Calendar },
    { name: 'Catat Sesi', href: '/logger', icon: PlayCircle, highlight: true },
    { name: 'Analytics & PR', href: '/history', icon: Trophy },
  ];

  return (
    <>
      {/* Top Solid Header - Full Width */}
      <header className="bg-[#090F15] border-b border-[#6C6D74] w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#D3D1CE] flex items-center justify-center text-[#090F15]">
              <Dumbbell className="w-4 h-4 -rotate-12" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-lg text-[#D3D1CE] tracking-tight">NAOOLIFT</span>
              <span className="text-[10px] font-mono text-[#B3B7BA] uppercase border border-[#6C6D74] px-1.5 py-0.5 rounded-sm bg-[#262E36]">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm font-heading text-xs transition-colors ${
                    item.highlight
                      ? 'solid-btn-primary px-4'
                      : isActive
                      ? 'bg-[#262E36] text-[#FFFFFF] border border-[#6C6D74]'
                      : 'text-[#B3B7BA] hover:text-[#D3D1CE] hover:bg-[#262E36]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Fixed Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090F15] border-t border-[#6C6D74] px-3 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  isActive ? 'text-[#FFFFFF] font-bold' : 'text-[#B3B7BA]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-sm ${
                    item.highlight
                      ? 'bg-[#D3D1CE] text-[#090F15]'
                      : isActive
                      ? 'bg-[#262E36] text-[#FFFFFF] border border-[#6C6D74]'
                      : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-heading">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
