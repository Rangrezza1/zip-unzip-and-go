import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function useThemeCSS() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--radius', `${theme.borderRadius}px`);
    root.style.setProperty('--badge-sale', theme.saleBadgeColor);
    root.style.setProperty('--badge-new', theme.tagBadgeColor);
    root.style.setProperty('--ring', theme.primaryColor);

    root.style.setProperty('--font-body', `'${theme.fontFamily}', sans-serif`);
    root.style.setProperty('--container-max', `${theme.containerWidth}px`);

    return () => {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--radius');
      root.style.removeProperty('--badge-sale');
      root.style.removeProperty('--badge-new');
      root.style.removeProperty('--ring');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--container-max');
    };
  }, [theme]);
}
