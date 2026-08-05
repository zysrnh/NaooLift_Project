'use client';

import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function RestTimer({ initialSeconds = 90, onComplete }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(initialSeconds);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (onComplete) onComplete();

      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch {}

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('⏱️ Jeda Istirahat Selesai!', {
          body: 'Waktunya lanjut ke set berikutnya di NaooLift!',
          icon: '/favicon.ico',
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onComplete]);

  const startTimer = (seconds: number) => {
    setTotalDuration(seconds);
    setSecondsLeft(seconds);
    setIsActive(true);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(totalDuration);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = totalDuration > 0 ? ((totalDuration - secondsLeft) / totalDuration) * 100 : 0;

  return (
    <div className="slate-card p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-blue-400" />
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
            Rest Timer Jeda Set
          </span>
        </div>

        {notifPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="text-[10px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 border border-[#334155] px-2 py-0.5 rounded-full bg-[#0F172A]"
          >
            <Bell className="w-3 h-3 text-amber-400" /> Izinkan Notif
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {[30, 60, 90, 120].map((sec) => (
          <button
            key={sec}
            onClick={() => startTimer(sec)}
            className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              totalDuration === sec && isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:text-[#F8FAFC] hover:border-blue-500/50'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>

      {/* Timer Bar & Controls */}
      <div className="relative bg-[#0F172A] rounded-xl p-4 border border-[#334155] flex items-center justify-between overflow-hidden">
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 shadow-sm shadow-blue-500"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#F8FAFC] font-heading tracking-tight">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono">
            {isActive ? 'Istirahat...' : 'Timer Siap'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-transform active:scale-95 shadow-md shadow-blue-500/25"
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
