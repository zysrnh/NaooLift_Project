import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NaooLift - High-Performance Workout Tracker & Gym Scheduler',
  description: 'Catat hasil angkatan gym, atur jadwal workout split, lacak progressive overload dan personal record (PR) dengan UI modern.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#090F15] text-[#D3D1CE] min-h-screen flex flex-col antialiased">
        <Navbar />

        {/* Maximized Full-Width Container without restricted side gaps */}
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 md:pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
