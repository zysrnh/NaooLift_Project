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
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#010101]/90 backdrop-blur-md border-b border-[#3E3A3A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#1A1919] border border-[#3E3A3A] flex items-center justify-center text-white group-hover:border-[#7D7D7D] transition-colors">
              <Dumbbell className="w-4 h-4 text-white -rotate-12" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#F9F9F9]">NAOOLIFT</span>
              <span className="text-[10px] font-semibold text-[#7D7D7D] tracking-widest uppercase border border-[#3E3A3A] px-2 py-0.5 rounded-full bg-[#1A1919]">
                WORKOUT LOG
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all ${
                    item.highlight
                      ? 'bg-[#F9F9F9] text-[#010101] font-bold hover:bg-white'
                      : isActive
                      ? 'bg-[#1A1919] text-[#F9F9F9] border border-[#3E3A3A]'
                      : 'text-[#7D7D7D] hover:text-[#F9F9F9] hover:bg-[#1A1919]/60'
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#010101]/95 backdrop-blur-lg border-t border-[#3E3A3A] px-3 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-[#F9F9F9] font-bold' : 'text-[#7D7D7D]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    item.highlight
                      ? 'bg-[#F9F9F9] text-[#010101]'
                      : isActive
                      ? 'bg-[#1A1919] text-[#F9F9F9] border border-[#3E3A3A]'
                      : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
