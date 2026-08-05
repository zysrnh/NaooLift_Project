'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        if (res.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/logger');
        }
      } else {
        setErrorMsg(res.message || 'Email atau password salah.');
      }
    } catch {
      setErrorMsg('Gagal menghubungkan ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@naoo.app');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10">
      <div className="solid-card w-full max-w-md p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#D3D1CE] text-[#090F15] flex items-center justify-center mx-auto mb-3">
            <Dumbbell className="w-6 h-6 -rotate-12" />
          </div>
          <span className="text-[10px] font-mono text-[#B3B7BA] uppercase tracking-widest block">
            NAOOLIFT / AUTHENTICATION
          </span>
          <h1 className="text-2xl font-heading font-black text-[#D3D1CE]">
            MASUK KE AKUN
          </h1>
          <p className="text-xs text-[#B3B7BA]">
            Masukkan email dan password untuk melanjutkan ke Sesi Gym atau Dashboard Admin.
          </p>
        </div>

        {/* Quick Admin Auth Button */}
        <div className="bg-[#090F15] p-3 rounded-sm flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#B3B7BA]">LOGIN ADMIN DASHBOARD</span>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="text-[10px] font-heading font-bold text-[#D3D1CE] border border-[#262E36] px-2.5 py-1 rounded-sm hover:bg-[#262E36] transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Auto-Fill Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-sm text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="email"
                placeholder="nama@domain.com atau admin@naoo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="solid-input w-full pl-9 pr-4 py-2.5 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
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
            className="w-full solid-btn-primary py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 pt-3"
          >
            {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 text-center text-xs font-mono text-[#B3B7BA] space-y-2">
          <div>
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#D3D1CE] font-bold underline hover:text-[#FFFFFF]">
              Daftar Akun Baru
            </Link>
          </div>
          <div>
            <Link href="/" className="text-[#B3B7BA] hover:text-[#D3D1CE]">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
