import { useState } from 'react';
import { ChevronDown, MapPin, Mail, Phone } from 'lucide-react';
import logo from '@/assets/logo.png';

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

const SECTIONS: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/collections/new' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
      { label: 'Sale', href: '/collections/sale' },
      { label: 'All Products', href: '/collections' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & Delivery', href: '#' },
      { label: 'Returns & Exchange', href: '#' },
      { label: 'Size Guide', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rangrezzapakistan/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Rangrezzapk/61582902584734/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@rangrezza.pk',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <footer className="bg-charcoal text-cream">
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8">
          {/* Brand */}
          <div className="pb-6 md:pb-0">
            <img src={logo} alt="Rangrezza" className="h-10 w-auto mb-2 brightness-0 invert" />
            <p className="text-cream/50 text-xs leading-relaxed mb-4">
              Premium fashion for the modern individual. Quality craftsmanship meets contemporary design.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-cream/40 hover:text-primary transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-t border-cream/10 md:border-0">
              <button
                className="w-full flex items-center justify-between py-3 md:py-0 md:pointer-events-none"
                onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
              >
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                  {section.title}
                </h4>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${openSection === section.title ? 'rotate-180' : ''}`}
                />
              </button>
              <ul
                className={`space-y-2 overflow-hidden transition-all md:mt-3 ${
                  openSection === section.title ? 'max-h-40 pb-3' : 'max-h-0 md:max-h-none'
                }`}
              >
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-cream/50 hover:text-cream transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="border-t border-cream/10 md:border-0 pt-4 md:pt-0">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-primary">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/50">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                Faisalabad, Pakistan
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0 text-primary" />
                <a href="mailto:rangrezzattire@gmail.com" className="hover:text-cream transition-colors">
                  rangrezzattire@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-primary" />
                <a href="tel:+923126666521" className="hover:text-cream transition-colors">
                  +92 312 666 6521
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-cream/30">
            © {new Date().getFullYear()} Rangrezza. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) => (
              <a key={link} href="#" className="text-[10px] text-cream/30 hover:text-cream/60 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
