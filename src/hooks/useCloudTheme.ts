import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useThemeStore, ThemeSettings } from '@/stores/themeStore';

/**
 * Syncs theme settings between Zustand store and Supabase.
 * On load: fetches cloud settings and merges into store.
 * On save (admin): pushes store settings to cloud.
 */
export function useCloudTheme() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const load = async () => {
      const { data } = await supabase
        .from('theme_settings')
        .select('settings')
        .limit(1)
        .maybeSingle();

      if (data?.settings) {
        const cloudSettings = data.settings as unknown as Partial<ThemeSettings>;
        useThemeStore.getState().importSettings(JSON.stringify(cloudSettings));
      }
    };

    load();
  }, []);
}

export async function saveThemeToCloud(): Promise<boolean> {
  const settings = useThemeStore.getState().theme;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Check if a row exists
  const { data: existing } = await supabase
    .from('theme_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('theme_settings')
      .update({ settings: JSON.parse(JSON.stringify(settings)), updated_at: new Date().toISOString(), updated_by: user.id })
      .eq('id', existing.id);
    return !error;
  } else {
    const { error } = await supabase
      .from('theme_settings')
      .insert([{ settings: JSON.parse(JSON.stringify(settings)), updated_by: user.id }]);
    return !error;
  }
}
