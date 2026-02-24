import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const SalesCounter = () => {
  const { salesCounter } = useThemeStore(s => s.theme.productWidgets);
  const [sold, setSold] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    setSold(Math.floor(Math.random() * (salesCounter.maxSales - salesCounter.minSales + 1)) + salesCounter.minSales);
    setHours(Math.floor(Math.random() * (salesCounter.maxHours - salesCounter.minHours + 1)) + salesCounter.minHours);
  }, [salesCounter.minSales, salesCounter.maxSales, salesCounter.minHours, salesCounter.maxHours]);

  if (!salesCounter.enabled) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
      <Flame className="w-3.5 h-3.5 animate-pulse" />
      <span>{sold} sold in last {hours} hours</span>
    </div>
  );
};

export default SalesCounter;
