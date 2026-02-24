import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const PAKISTAN_CUSTOMERS = [
  { name: 'Ayesha K.', city: 'Karachi' },
  { name: 'Fatima R.', city: 'Lahore' },
  { name: 'Sana M.', city: 'Islamabad' },
  { name: 'Hira A.', city: 'Rawalpindi' },
  { name: 'Zainab S.', city: 'Faisalabad' },
  { name: 'Maham T.', city: 'Multan' },
  { name: 'Amna B.', city: 'Peshawar' },
  { name: 'Noor F.', city: 'Hyderabad' },
  { name: 'Maryam I.', city: 'Quetta' },
  { name: 'Rabia H.', city: 'Sialkot' },
  { name: 'Iqra N.', city: 'Gujranwala' },
  { name: 'Zunaira D.', city: 'Bahawalpur' },
  { name: 'Anam W.', city: 'Sargodha' },
  { name: 'Mehwish L.', city: 'Sukkur' },
  { name: 'Bushra G.', city: 'Larkana' },
  { name: 'Sidra P.', city: 'Abbottabad' },
  { name: 'Nimra J.', city: 'Mardan' },
  { name: 'Khadija Z.', city: 'Sahiwal' },
  { name: 'Urooj E.', city: 'Rahim Yar Khan' },
  { name: 'Alina V.', city: 'Mirpur' },
];

const defaults = { enabled: true, productNames: [] as string[], productImageUrl: '', displayDuration: 4, initialDelay: 3, repeatInterval: 10, collectionHandle: '' };

interface PopupData {
  name: string;
  city: string;
  product: string;
  timeAgo: string;
  imageUrl: string;
}

const RecentSalesPopup = () => {
  const pw = useThemeStore(s => s.theme.productWidgets);
  const recentSales = pw?.recentSales ?? defaults;
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  const generatePopup = useCallback(() => {
    const customer = PAKISTAN_CUSTOMERS[Math.floor(Math.random() * PAKISTAN_CUSTOMERS.length)];
    const products = recentSales.productNames.length > 0 ? recentSales.productNames : ['Premium Collection Item'];
    const product = products[Math.floor(Math.random() * products.length)];
    const minutes = Math.floor(Math.random() * 21);
    const timeAgo = minutes === 0 ? 'Just now' : `${minutes} minutes ago`;
    const imageUrl = recentSales.productImageUrl || '/placeholder.svg';

    setPopup({ name: customer.name, city: customer.city, product, timeAgo, imageUrl });
    setVisible(true);

    setTimeout(() => setVisible(false), recentSales.displayDuration * 1000);
  }, [recentSales.productNames, recentSales.productImageUrl, recentSales.displayDuration]);

  useEffect(() => {
    if (!recentSales.enabled) return;

    const firstTimeout = setTimeout(() => {
      generatePopup();
    }, recentSales.initialDelay * 1000);

    const interval = setInterval(() => {
      generatePopup();
    }, recentSales.repeatInterval * 1000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [recentSales.enabled, recentSales.initialDelay, recentSales.repeatInterval, generatePopup]);

  if (!recentSales.enabled || !popup) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[100] max-w-[300px] bg-background border shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ease-in-out ${
        visible ? 'translate-x-0' : '-translate-x-[120%]'
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <img
          src={popup.imageUrl}
          alt={popup.product}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{popup.name} from {popup.city}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">purchased <strong>{popup.product}</strong></p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">{popup.timeAgo}</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground p-0.5">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default RecentSalesPopup;
