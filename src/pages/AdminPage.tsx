import { useState } from 'react';
import { useThemeStore, CollectionSectionSettings, SectionSettings, HeroBanner, FeaturedCollectionSection } from '@/stores/themeStore';
import { useCollections } from '@/hooks/useCollections';
import { ArrowLeft, Plus, Trash2, Copy, GripVertical, ChevronDown, ChevronUp, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';

const FONT_OPTIONS = ['DM Sans', 'Inter', 'Poppins', 'Playfair Display', 'Lora', 'Montserrat', 'Roboto', 'Open Sans'];
const HEADING_WEIGHTS = ['400', '500', '600', '700', '800'];
const HEADING_STYLES: CollectionSectionSettings['headingStyle'][] = ['none', 'underline', 'accent-bar', 'icon', 'divider'];

type Tab = 'global' | 'hero' | 'sections' | 'featured';

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  const hslToHex = (hsl: string) => {
    try {
      const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v.replace('%', '')));
      const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
      const f = (n: number) => { const k = (n + h / 30) % 12; const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
      return `#${f(0)}${f(8)}${f(4)}`;
    } catch { return '#ccaa44'; }
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs font-medium text-foreground whitespace-nowrap">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={hslToHex(value)} onChange={(e) => {
          const hex = e.target.value;
          const r = parseInt(hex.slice(1, 3), 16) / 255; const g = parseInt(hex.slice(3, 5), 16) / 255; const b = parseInt(hex.slice(5, 7), 16) / 255;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          let h = 0, s = 0; const l = (max + min) / 2;
          if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)); break; case g: h = ((b - r) / d + 2); break; case b: h = ((r - g) / d + 4); break; } h *= 60; }
          onChange(`${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`);
        }} className="w-8 h-8 rounded border cursor-pointer" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-32 text-[11px] bg-secondary border rounded px-2 py-1 font-mono" />
      </div>
    </div>
  );
};

const ToggleSwitch = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium">{label}</label>
    <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  </div>
);

const NumberInput = ({ label, value, onChange, min = 0, max = 9999, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-xs font-medium whitespace-nowrap">{label}</label>
    <input type="number" value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))} min={min} max={max} step={step} className="w-20 text-xs bg-secondary border rounded px-2 py-1.5 text-right" />
  </div>
);

const SelectInput = ({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-xs font-medium whitespace-nowrap">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="text-xs bg-secondary border rounded px-2 py-1.5">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const AdminPage = () => {
  const { theme, updateTheme, updateSection, removeSection, duplicateSection, addHeroBanner, updateHeroBanner, removeHeroBanner, updateFeaturedCollection, removeFeaturedCollection, reorderFeaturedCollections, syncFeaturedCollections, resetTheme } = useThemeStore();
  const { data: collections } = useCollections();
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedBanner, setExpandedBanner] = useState<string | null>(null);
  const [expandedFeatured, setExpandedFeatured] = useState<string | null>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'global', label: 'Global' },
    { key: 'hero', label: 'Hero Banners' },
    { key: 'sections', label: 'Sections' },
    { key: 'featured', label: 'Featured Collections' },
  ];

  const moveFeatured = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= theme.featuredCollections.length) return;
    const items = [...theme.featuredCollections];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    reorderFeaturedCollections(items);
  };

  const handleSyncCollections = () => {
    if (collections && collections.length > 0) {
      syncFeaturedCollections(collections.map(c => ({ handle: c.handle, title: c.title })));
      toast.success('Collections synced from Shopify');
    } else { toast.info('No collections found to sync'); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-foreground text-background">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <a href="/" className="p-1.5 hover:opacity-80"><ArrowLeft className="w-4 h-4" /></a>
            <h1 className="text-sm font-semibold tracking-wider uppercase">Theme Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium px-3 py-1.5 border border-background/30 rounded hover:bg-background/10 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Preview
            </a>
            <button onClick={() => { resetTheme(); toast.success('Theme reset to defaults'); }} className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium px-3 py-1.5 border border-background/30 rounded hover:bg-background/10 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="flex gap-1 mb-6 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >{t.label}</button>
          ))}
        </div>

        {activeTab === 'global' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Colors</h3>
              <ColorInput label="Primary" value={theme.primaryColor} onChange={(v) => updateTheme({ primaryColor: v })} />
              <ColorInput label="Secondary" value={theme.secondaryColor} onChange={(v) => updateTheme({ secondaryColor: v })} />
              <ColorInput label="Accent" value={theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
            </div>
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Typography</h3>
              <SelectInput label="Font Family" value={theme.fontFamily} options={FONT_OPTIONS.map((f) => ({ label: f, value: f }))} onChange={(v) => updateTheme({ fontFamily: v })} />
              <SelectInput label="Heading Weight" value={theme.headingFontWeight} options={HEADING_WEIGHTS.map((w) => ({ label: w, value: w }))} onChange={(v) => updateTheme({ headingFontWeight: v })} />
            </div>
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Layout</h3>
              <NumberInput label="Border Radius (px)" value={theme.borderRadius} onChange={(v) => updateTheme({ borderRadius: v })} max={50} />
              <NumberInput label="Container Width (px)" value={theme.containerWidth} onChange={(v) => updateTheme({ containerWidth: v })} min={800} max={1920} step={20} />
            </div>
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Toggles</h3>
              <ToggleSwitch label="Animations" checked={theme.animationsEnabled} onChange={(v) => updateTheme({ animationsEnabled: v })} />
              <ToggleSwitch label="Sticky Header" checked={theme.stickyHeader} onChange={(v) => updateTheme({ stickyHeader: v })} />
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <ToggleSwitch label="Auto Rotate" checked={theme.heroAutoRotate} onChange={(v) => updateTheme({ heroAutoRotate: v })} />
              {theme.heroAutoRotate && <NumberInput label="Interval (seconds)" value={theme.heroRotateInterval} onChange={(v) => updateTheme({ heroRotateInterval: v })} min={2} max={30} />}
            </div>
            {theme.heroBanners.map((banner) => (
              <div key={banner.id} className="bg-card border rounded-lg overflow-hidden">
                <div className="flex items-center px-4 py-3 gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1 truncate">{banner.title || 'Untitled Banner'}</span>
                  <button onClick={() => setExpandedBanner(expandedBanner === banner.id ? null : banner.id)}>
                    {expandedBanner === banner.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => removeHeroBanner(banner.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {expandedBanner === banner.id && (
                  <div className="px-4 pb-4 pt-2 border-t space-y-3">
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">Title</label><input type="text" value={banner.title} onChange={(e) => updateHeroBanner(banner.id, { title: e.target.value })} className="flex-1 text-xs bg-secondary border rounded px-2 py-1.5" /></div>
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">Subtitle</label><input type="text" value={banner.subtitle} onChange={(e) => updateHeroBanner(banner.id, { subtitle: e.target.value })} className="flex-1 text-xs bg-secondary border rounded px-2 py-1.5" /></div>
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">CTA Text</label><input type="text" value={banner.ctaText} onChange={(e) => updateHeroBanner(banner.id, { ctaText: e.target.value })} className="w-32 text-xs bg-secondary border rounded px-2 py-1.5" /></div>
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">CTA Link</label><input type="text" value={banner.ctaLink} onChange={(e) => updateHeroBanner(banner.id, { ctaLink: e.target.value })} className="flex-1 text-xs bg-secondary border rounded px-2 py-1.5" /></div>
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">Image URL</label><input type="text" value={banner.imageUrl} onChange={(e) => updateHeroBanner(banner.id, { imageUrl: e.target.value })} className="flex-1 text-xs bg-secondary border rounded px-2 py-1.5" placeholder="https://..." /></div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addHeroBanner} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-3 max-w-2xl">
            {theme.sections.map((section) => (
              <div key={section.id} className="bg-card border rounded-lg overflow-hidden">
                <div className="flex items-center px-4 py-3 gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <ToggleSwitch label="" checked={section.enabled} onChange={(v) => updateSection(section.id, { enabled: v })} />
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1">{section.type}</span>
                  <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                    {expandedSection === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => duplicateSection(section.id)} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => removeSection(section.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {expandedSection === section.id && (
                  <div className="px-4 pb-4 pt-2 border-t space-y-3">
                    <NumberInput label="Padding Top (px)" value={section.paddingTop} onChange={(v) => updateSection(section.id, { paddingTop: v })} max={200} />
                    <NumberInput label="Padding Bottom (px)" value={section.paddingBottom} onChange={(v) => updateSection(section.id, { paddingBottom: v })} max={200} />
                    <ToggleSwitch label="Animation" checked={section.animationEnabled} onChange={(v) => updateSection(section.id, { animationEnabled: v })} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'featured' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">New Shopify collections are auto-added.</p>
              <button onClick={handleSyncCollections} className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium px-3 py-1.5 border rounded hover:bg-secondary transition-colors">
                <RotateCcw className="w-3 h-3" /> Sync
              </button>
            </div>
            {theme.featuredCollections.length === 0 && (
              <div className="text-center py-12 bg-card border rounded-lg">
                <p className="text-muted-foreground text-sm mb-2">No featured collections yet</p>
                <button onClick={handleSyncCollections} className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80">Sync from Shopify</button>
              </div>
            )}
            {theme.featuredCollections.map((fc, index) => (
              <div key={fc.id} className="bg-card border rounded-lg overflow-hidden">
                <div className="flex items-center px-4 py-3 gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveFeatured(index, 'up')} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => moveFeatured(index, 'down')} disabled={index === theme.featuredCollections.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
                  </div>
                  <ToggleSwitch label="" checked={fc.enabled} onChange={(v) => updateFeaturedCollection(fc.id, { enabled: v })} />
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1 truncate">{fc.headline}</span>
                  <button onClick={() => setExpandedFeatured(expandedFeatured === fc.id ? null : fc.id)}>
                    {expandedFeatured === fc.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => removeFeaturedCollection(fc.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {expandedFeatured === fc.id && (
                  <div className="px-4 pb-4 pt-2 border-t space-y-3">
                    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium whitespace-nowrap">Headline</label><input type="text" value={fc.headline} onChange={(e) => updateFeaturedCollection(fc.id, { headline: e.target.value })} className="flex-1 text-xs bg-secondary border rounded px-2 py-1.5" /></div>
                    <NumberInput label="Product Limit" value={fc.productLimit} onChange={(v) => updateFeaturedCollection(fc.id, { productLimit: v })} min={1} max={20} />
                    <SelectInput label="Grid Columns" value={String(fc.gridColumns)} options={[{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }]} onChange={(v) => updateFeaturedCollection(fc.id, { gridColumns: Number(v) as 2 | 3 | 4 })} />
                    <ToggleSwitch label="Shadow Effect" checked={fc.shadowEffect} onChange={(v) => updateFeaturedCollection(fc.id, { shadowEffect: v })} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
