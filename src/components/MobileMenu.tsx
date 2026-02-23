import { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import type { ShopifyCollection } from '@/hooks/useCollections';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  collections: ShopifyCollection[];
}

const MobileMenu = ({ open, onClose, collections }: MobileMenuProps) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-background shadow-2xl flex flex-col"
           style={{ animation: 'slide-from-left 0.25s ease-out' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-display text-base font-bold">Menu</span>
          <button onClick={onClose} className="p-1 active:scale-95 transition-transform" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          <a
            href="/"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-secondary/50 active:bg-secondary transition-colors"
            onClick={onClose}
          >
            Home
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </a>
          {collections.map(col => (
            <a
              key={col.handle}
              href={`/collections/${col.handle}`}
              className="flex items-center justify-between px-5 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-secondary/50 active:bg-secondary transition-colors"
              onClick={onClose}
            >
              {col.title}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
          ))}
          <a
            href="/collections"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-secondary/50 active:bg-secondary transition-colors"
            onClick={onClose}
          >
            Shop All
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </a>
        </nav>

        <div className="mt-auto border-t px-5 py-4 space-y-3">
          <a href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
            Shipping & Returns
          </a>
          <a href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
            Size Guide
          </a>
          <a href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
            Contact Us
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slide-from-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MobileMenu;
