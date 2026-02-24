import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const defaults = { enabled: true, minViewers: 20, maxViewers: 75, fluctuation: 5, intervalSeconds: 8 };

const LiveViewerCount = () => {
  const pw = useThemeStore(s => s.theme.productWidgets);
  const liveViewers = pw?.liveViewers ?? defaults;
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(Math.random() * (liveViewers.maxViewers - liveViewers.minViewers + 1)) + liveViewers.minViewers);
  }, [liveViewers.minViewers, liveViewers.maxViewers]);

  useEffect(() => {
    if (!liveViewers.enabled) return;
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? liveViewers.fluctuation : -liveViewers.fluctuation;
        return Math.max(liveViewers.minViewers, Math.min(liveViewers.maxViewers + 10, prev + change));
      });
    }, liveViewers.intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [liveViewers.enabled, liveViewers.intervalSeconds, liveViewers.fluctuation, liveViewers.minViewers, liveViewers.maxViewers]);

  if (!liveViewers.enabled) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Eye className="w-3.5 h-3.5" />
      <span className="flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <strong className="text-foreground">{count}</strong> People looking at this product
      </span>
    </div>
  );
};

export default LiveViewerCount;
