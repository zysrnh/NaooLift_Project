'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Play, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { getCurrentUser, logoutUser, UserProfile } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkUser = () => {
      setCurrentUser(getCurrentUser());
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-[#090F15] w-full border-b border-[#262E36]/40">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand Logo Image with Drop Shadow */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/NaooLift.png"
            alt="NaooLift Logo"
            width={34}
            height={34}
            className="w-auto h-8 drop-shadow-[0_4px_10px_rgba(255,255,255,0.25)] transition-transform group-hover:scale-105"
          />
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
            Beranda
          </Link>
          {currentUser && (
            <>
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
            </>
          )}
        </nav>

        {/* User Profile / Auth Action Button Far Right */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#262E36] text-xs font-mono text-[#D3D1CE]">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{currentUser.name}</span>
              </div>
              <Link
                href="/logger"
                className="solid-btn-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Catat Sesi
              </Link>
              <button
                onClick={logoutUser}
                className="p-2 rounded-sm bg-[#262E36] text-[#B3B7BA] hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="solid-btn-secondary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk
              </Link>
              <Link
                href="/register"
                className="solid-btn-primary px-4 py-2 text-xs uppercase tracking-wider"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
