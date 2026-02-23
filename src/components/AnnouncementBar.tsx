import { useState, useEffect } from 'react';

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 3);

const AnnouncementBar = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="announcement-bar overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-8">⚡ Fast Delivery &amp; Easy Exchange Policy</span>
        <span className="mx-8">💳 All Payment Methods Accepted</span>
        <span className="mx-8">🔥 Sale ends in {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        <span className="mx-8">📦 Free Shipping on Orders Above Rs. 3,000</span>
        <span className="mx-8">⚡ Fast Delivery &amp; Easy Exchange Policy</span>
        <span className="mx-8">💳 All Payment Methods Accepted</span>
        <span className="mx-8">🔥 Sale ends in {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        <span className="mx-8">📦 Free Shipping on Orders Above Rs. 3,000</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
