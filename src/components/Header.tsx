import { useState } from 'react';
import { Search, Menu, ShoppingBag } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { useCollections } from '@/hooks/useCollections';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));
  const { data: collections } = useCollections();
  const headerNavItems = useThemeStore((s) => s.theme.headerNavItems);

  // Use theme nav items if configured, otherwise fall back to collections
  const hasCustomNav = headerNavItems.length > 0;
  const enabledNavItems = headerNavItems.filter((n) => n.enabled);

  return (
    <>
      <header className="sticky-header">
        <div className="container flex items-center justify-between h-14 md:h-16">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1.5 md:hidden active:scale-95 transition-transform"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block w-5" />

          <a href="/" className="mx-auto">
            <img src={logo} alt="Rangrezza" className="h-12 md:h-14 w-auto max-w-[160px] md:max-w-[200px] object-contain" />
          </a>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 active:scale-95 transition-transform"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="p-1.5 relative active:scale-95 transition-transform"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold px-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 border-t py-2">
          {hasCustomNav ? (
            enabledNavItems.map(item => (
              <a
                key={item.id}
                href={item.link}
                className="text-xs font-medium tracking-[0.15em] uppercase hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))
          ) : (
            <>
              <a href="/" className="text-xs font-medium tracking-[0.15em] uppercase hover:text-primary transition-colors whitespace-nowrap">
                Home
              </a>
              {collections?.map(col => (
                <a
                  key={col.handle}
                  href={`/collections/${col.handle}`}
                  className="text-xs font-medium tracking-[0.15em] uppercase hover:text-primary transition-colors whitespace-nowrap"
                >
                  {col.title}
                </a>
              ))}
              <a href="/collections" className="text-xs font-medium tracking-[0.15em] uppercase hover:text-primary transition-colors whitespace-nowrap">
                Shop All
              </a>
            </>
          )}
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} collections={collections || []} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
