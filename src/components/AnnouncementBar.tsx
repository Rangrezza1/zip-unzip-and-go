import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 3);

const AnnouncementBar = () => {
  const messages = useThemeStore((s) => s.theme.announcementMessages);
  const speed = useThemeStore((s) => s.theme.announcementSpeed);
  const showCountdown = useThemeStore((s) => s.theme.showCountdown);
  const sticky = useThemeStore((s) => s.theme.announcementSticky);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!showCountdown) return;
    const tick = () => {
      const diff = TARGET_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [showCountdown]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const enabledMessages = messages.filter((m) => m.enabled);
  if (enabledMessages.length === 0) return null;

  const countdownText = `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;

  // Duplicate for seamless marquee
  const items = [...enabledMessages, ...enabledMessages];

  return (
    <div className={`announcement-bar overflow-hidden ${sticky ? 'sticky top-0 z-[60]' : ''}`}>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {items.map((msg, i) => (
          <span key={`${msg.id}-${i}`} className="mx-8">
            {msg.emoji} {msg.text}
            {showCountdown && msg.text.toLowerCase().includes('sale') && ` ${countdownText}`}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
