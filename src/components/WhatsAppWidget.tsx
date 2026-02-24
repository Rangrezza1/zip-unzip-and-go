import { useThemeStore } from '@/stores/themeStore';
import { MessageCircle } from 'lucide-react';

const WhatsAppWidget = () => {
  const settings = useThemeStore(s => s.theme.whatsapp);

  if (!settings.enabled || !settings.phoneNumber) return null;

  const url = `https://wa.me/${settings.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </a>
  );
};

export default WhatsAppWidget;
