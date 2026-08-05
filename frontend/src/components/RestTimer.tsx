'use client';

import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function RestTimer({ initialSeconds = 90, onComplete }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(initialSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (onComplete) onComplete();
      // Optional audio chime
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch {}
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
    <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 bg-slate-900/60 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-sm text-slate-200">Rest Timer</span>
        </div>
        <div className="flex gap-1">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => startTimer(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                totalDuration === sec && isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
        {/* Progress Bar Line */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-b-xl transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-white font-mono">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-xs text-slate-400 uppercase font-medium">istirahatkan otot</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
          >
            {isActive ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
