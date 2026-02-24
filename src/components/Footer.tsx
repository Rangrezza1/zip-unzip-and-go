import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import logo from '@/assets/logo.png';

interface FooterSection {
  title: string;
  links: {label: string;href: string;}[];
}

const SECTIONS: FooterSection[] = [
{
  title: 'Shop',
  links: [
  { label: 'New Arrivals', href: '/collections/new' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale', href: '/collections/sale' },
  { label: 'All Products', href: '/collections' }]

},
{
  title: 'Help',
  links: [
  { label: 'Shipping & Delivery', href: '#' },
  { label: 'Returns & Exchange', href: '#' },
  { label: 'Size Guide', href: '#' },
  { label: 'Contact Us', href: '#' }]

}];


const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <footer className="bg-charcoal text-cream">
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8">
          <div className="pb-6 md:pb-0">
            <img src={logo} alt="Rangrezza" className="h-10 w-auto mb-2 brightness-0 invert" />
            <p className="text-cream/50 text-xs leading-relaxed">
              Premium fashion for the modern individual. Quality craftsmanship meets contemporary design.
            </p>
          </div>

          {SECTIONS.map((section) => {}























          )}

          <div className="border-t border-cream/10 md:border-0 pt-4 md:pt-0">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-primary">
              Newsletter
            </h4>
            <p className="text-xs text-cream/50 mb-3">Subscribe for exclusive offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-cream/10 border border-cream/20 px-3 py-2 text-xs outline-none placeholder:text-cream/30 focus:border-primary" />

              <button type="submit" className="bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-cream/30">
            © {new Date().getFullYear()} Rangrezza. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) =>
            <a key={link} href="#" className="text-[10px] text-cream/30 hover:text-cream/60 transition-colors">
                {link}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;