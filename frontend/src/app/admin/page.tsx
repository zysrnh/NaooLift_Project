'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, ArrowRight, LogOut, ArrowLeft } from 'lucide-react';
import { getCurrentUser, loginUser, logoutUser, UserProfile } from '@/lib/auth';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Admin login form state
  const [email, setEmail] = useState('admin@naoolift.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUser(getCurrentUser());
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        setErrorMsg(res.message || 'Kredensial administrator tidak valid.');
      }
    } catch {
      setErrorMsg('Gagal melakukan verifikasi otentikasi administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  if (!isClient) return null;

  const isAdminLoggedIn = currentUser && currentUser.role === 'admin';

  // IF NOT LOGGED IN AS ADMIN: Professional Admin Authentication Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-[#090F15] w-screen h-screen flex items-center justify-center p-4">
        <div className="solid-card w-full max-w-md p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-[#D3D1CE] text-[#090F15] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-[#090F15]" />
            </div>
            <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
              NAOOLIFT / MANAGEMENT CONSOLE
            </span>
            <h1 className="text-2xl font-heading font-black text-[#D3D1CE]">
              AUTENTIKASI ADMINISTRATOR
            </h1>
            <p className="text-xs text-[#B3B7BA]">
              Silakan masukkan kredensial akun administrator untuk mengakses Portal Dashboard NaooLift.
            </p>
          </div>

          {/* Account Credential Box */}
          <div className="bg-[#090F15] p-3 rounded-sm text-xs font-mono text-center space-y-1">
            <span className="text-[#B3B7BA] block text-[10px]">KREDENSIAL AKSES DEMO ADMINISTRATOR:</span>
            <div className="text-[#D3D1CE] font-bold">Email: admin@naoolift.com | Password: admin123</div>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 text-rose-400 p-3 rounded-sm text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
                ALAMAT EMAIL ADMINISTRATOR
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="solid-input w-full pl-9 pr-4 py-2.5 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
                KATA SANDI ADMINISTRATOR
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="solid-input w-full pl-9 pr-4 py-2.5 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full solid-btn-primary py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isLoading ? 'Memverifikasi...' : 'MASUK SEBAGAI ADMINISTRATOR'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs font-mono">
            <Link href="/" className="text-[#B3B7BA] hover:text-[#D3D1CE] inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN AS ADMIN: 100% Fullscreen Nickelfox Dashboard with Professional Top Bar
  return (
    <div className="fixed inset-0 z-50 bg-[#090F15] w-screen h-screen overflow-hidden flex flex-col">
      {/* Top Professional Control Bar */}
      <div className="bg-[#090F15] px-4 py-2 flex items-center justify-between border-b border-[#262E36] z-50 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-heading font-black text-sm text-[#D3D1CE]">NAOOLIFT MANAGEMENT CONSOLE</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> SISTEM TERAUTENTIKASI
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-[#B3B7BA] hover:text-[#D3D1CE] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Utama
          </Link>
          <button
            onClick={handleAdminLogout}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Administrator
          </button>
        </div>
      </div>

      {/* 100% Fullscreen Nickelfox Dashboard */}
      <iframe
        src="http://localhost:5173/nickelfox"
        title="Nickelfox Admin Dashboard Fullscreen"
        className="w-full flex-1 border-none bg-[#090F15]"
      />
    </div>
  );
}
