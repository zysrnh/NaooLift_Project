'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { registerUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser(name, email, password);
      if (res.success) {
        router.push('/login');
      } else {
        setErrorMsg(res.message || 'Gagal membuat akun.');
      }
    } catch {
      setErrorMsg('Gagal menghubungkan ke server.');
    } finally {
      setIsLoading(false);
    }
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
            NAOOLIFT / REGISTRATION
          </span>
          <h1 className="text-2xl font-heading font-black text-[#D3D1CE]">
            BUAT AKUN BARU
          </h1>
          <p className="text-xs text-[#B3B7BA]">
            Daftar untuk mulai menyimpan data latihan gym dan melacak rekor angkatan kamu.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-sm text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
              NAMA LENGKAP
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="misal: Zaki Naoo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="solid-input w-full pl-9 pr-4 py-2.5 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="email"
                placeholder="nama@domain.com"
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

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#B3B7BA] uppercase block">
              KONFIRMASI PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B3B7BA] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Memproses...' : 'Daftar Akun Baru'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 text-center text-xs font-mono text-[#B3B7BA] space-y-2">
          <div>
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#D3D1CE] font-bold underline hover:text-[#FFFFFF]">
              Masuk Sekarang
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
