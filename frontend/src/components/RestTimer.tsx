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

      // Trigger audio chime & native push notification
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
    <div className="taste-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#F9F9F9]" />
          <span className="font-bold text-xs uppercase tracking-wider text-[#F9F9F9]">Rest Timer Jeda Set</span>
        </div>

        {notifPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="text-[10px] text-[#7D7D7D] hover:text-[#F9F9F9] flex items-center gap-1 border border-[#3E3A3A] px-2 py-0.5 rounded-full"
          >
            <Bell className="w-3 h-3" /> Izinkan Notif
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {[30, 60, 90, 120].map((sec) => (
          <button
            key={sec}
            onClick={() => startTimer(sec)}
            className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              totalDuration === sec && isActive
                ? 'bg-[#F9F9F9] text-[#010101]'
                : 'bg-[#0F0E0E] text-[#7D7D7D] border border-[#3E3A3A] hover:text-[#F9F9F9]'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>

      {/* Timer Bar & Controls */}
      <div className="relative bg-[#0F0E0E] rounded-xl p-4 border border-[#3E3A3A] flex items-center justify-between overflow-hidden">
        <div
          className="absolute bottom-0 left-0 h-1 bg-[#F9F9F9] transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#F9F9F9] font-mono tracking-tight">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[10px] text-[#7D7D7D] uppercase tracking-wider font-semibold">
            {isActive ? 'Istirahat berlangsung...' : 'Timer Siap'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="p-2.5 rounded-lg bg-[#F9F9F9] text-[#010101] hover:bg-white transition-transform active:scale-95"
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2.5 rounded-lg bg-[#1A1919] border border-[#3E3A3A] text-[#7D7D7D] hover:text-[#F9F9F9]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
