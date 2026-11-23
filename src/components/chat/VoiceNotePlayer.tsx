import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  waveform?: number[];
  isSender: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  duration = 7,
  waveform = [20, 40, 75, 90, 60, 45, 80, 50, 30, 60, 85, 40, 20],
  isSender
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [currentSec, setCurrentSec] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSec(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, speed]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const cycleSpeed = () => {
    setSpeed(prev => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <div className="flex items-center space-x-3 py-1 min-w-[210px]">
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md transition active:scale-90 ${
          isSender
            ? 'bg-white text-midnight-950 hover:bg-slate-100'
            : 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white'
        }`}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Waveform visualizer */}
      <div className="flex-1 flex items-center space-x-1 h-8">
        {waveform.map((height, idx) => {
          const progressPercent = (currentSec / duration) * waveform.length;
          const isPassed = idx <= progressPercent;

          return (
            <div
              key={idx}
              style={{ height: `${Math.max(15, height)}%` }}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPassed
                  ? isSender
                    ? 'bg-white'
                    : 'bg-rose-500 dark:bg-softpink-400'
                  : isSender
                  ? 'bg-white/40'
                  : 'bg-slate-300 dark:bg-slate-500/40'
              }`}
            />
          );
        })}
      </div>

      {/* Duration and speed controller */}
      <div className="flex flex-col items-end shrink-0 text-[10px]">
        <span className={isSender ? 'text-white/90' : 'text-slate-600 dark:text-slate-300 font-medium'}>
          {isPlaying ? `0:0${currentSec}` : `0:0${duration}`}
        </span>
        <button
          onClick={cycleSpeed}
          className={`px-1 rounded font-semibold transition ${
            isSender ? 'text-white/80 hover:bg-white/20' : 'text-purple-700 dark:text-lavender-400 hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          {speed}x
        </button>
      </div>
    </div>
  );
};
