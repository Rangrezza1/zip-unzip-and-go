import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const defaults = { enabled: true, label: 'Hurry! Offer ends in', hours: 1, minutes: 24, seconds: 48, resetHours: 1, resetMinutes: 30, resetSeconds: 60 };

const CountdownTimer = () => {
  const pw = useThemeStore(s => s.theme.productWidgets);
  const countdown = pw?.countdown ?? defaults;
  const [timeLeft, setTimeLeft] = useState(
    countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds
  );

  useEffect(() => {
    setTimeLeft(countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds);
  }, [countdown.hours, countdown.minutes, countdown.seconds]);

  useEffect(() => {
    if (!countdown.enabled) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return countdown.resetHours * 3600 + countdown.resetMinutes * 60 + countdown.resetSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown.enabled, countdown.resetHours, countdown.resetMinutes, countdown.resetSeconds]);

  if (!countdown.enabled) return null;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="border rounded-lg p-3 bg-destructive/5">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="w-4 h-4 text-destructive" />
        <span className="text-xs font-bold uppercase tracking-wider text-destructive">{countdown.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {[
          { val: pad(h), label: 'HRS' },
          { val: pad(m), label: 'MIN' },
          { val: pad(s), label: 'SEC' },
        ].map((block, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="text-center">
              <div className="bg-foreground text-background text-lg font-bold w-12 h-12 flex items-center justify-center rounded">
                {block.val}
              </div>
              <p className="text-[9px] font-bold tracking-widest text-muted-foreground mt-1">{block.label}</p>
            </div>
            {i < 2 && <span className="text-lg font-bold text-foreground -mt-4">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
