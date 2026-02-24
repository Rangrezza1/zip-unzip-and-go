import { useThemeStore } from '@/stores/themeStore';

const WhatsAppWidget = () => {
  const settings = useThemeStore(s => s.theme.whatsapp);

  if (!settings.enabled || !settings.phoneNumber) return null;

  const url = `https://wa.me/${settings.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.054 31.07l5.898-1.95c2.518 1.682 5.52 2.664 8.748 2.664h.008c8.824 0 16-7.176 16-16.004C31.708 6.956 24.828 0 16.004 0zm9.53 22.608c-.4 1.126-2.342 2.154-3.226 2.244-.884.09-1.706.4-5.746-1.196-4.872-1.926-7.956-6.952-8.196-7.276-.236-.324-1.956-2.6-1.956-4.96s1.236-3.52 1.676-4.004c.44-.484.96-.604 1.28-.604.32 0 .636.004.916.016.294.014.688-.112 1.076.82.4.96 1.36 3.32 1.48 3.56.12.244.2.524.04.844-.16.324-.24.524-.48.804-.236.284-.5.632-.712.848-.236.24-.484.5-.208.98.276.484 1.228 2.024 2.636 3.28 1.812 1.616 3.34 2.116 3.816 2.356.48.236.756.2 1.036-.12.276-.324 1.196-1.396 1.516-1.876.316-.484.636-.4 1.076-.236.44.16 2.796 1.316 3.276 1.556.476.236.796.356.916.556.116.196.116 1.148-.284 2.276z" />
      </svg>
    </a>
  );
};

export default WhatsAppWidget;
