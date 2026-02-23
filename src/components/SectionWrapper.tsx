import { SectionSettings } from '@/stores/themeStore';
import { useThemeStore } from '@/stores/themeStore';

interface SectionWrapperProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper = ({ sectionId, children, className = '' }: SectionWrapperProps) => {
  const section = useThemeStore((s) => s.theme.sections.find((sec) => sec.id === sectionId));
  const animationsEnabled = useThemeStore((s) => s.theme.animationsEnabled);

  if (!section || !section.enabled) return null;

  const style: React.CSSProperties = {
    paddingTop: section.paddingTop ? `${section.paddingTop}px` : undefined,
    paddingBottom: section.paddingBottom ? `${section.paddingBottom}px` : undefined,
    marginTop: section.marginTop ? `${section.marginTop}px` : undefined,
    marginBottom: section.marginBottom ? `${section.marginBottom}px` : undefined,
    textAlign: section.textAlign,
    backgroundColor: section.backgroundColor ? `hsl(${section.backgroundColor})` : undefined,
    backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
    backgroundSize: section.backgroundImage ? 'cover' : undefined,
    backgroundPosition: section.backgroundImage ? 'center' : undefined,
  };

  const shouldAnimate = animationsEnabled && section.animationEnabled;

  return (
    <section
      style={style}
      className={`${shouldAnimate ? 'animate-fade-in' : ''} ${className}`}
    >
      {section.decorativeStyle === 'divider' && (
        <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
      )}
      {section.decorativeStyle === 'dots' && (
        <div className="flex justify-center gap-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionWrapper;
