import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const ADMIN_AUTH_TIMEOUT_MS = 6000;

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveSession = async (session: Session | null) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: currentUser.id,
          _role: 'admin',
        });

        if (!isMounted) return;

        if (error) {
          console.error('Admin role check failed:', error.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data));
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
        if (isMounted) setIsAdmin(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      setLoading(false);
      setIsAdmin(false);
    }, ADMIN_AUTH_TIMEOUT_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolveSession(session);
    });

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        void resolveSession(session);
      })
      .catch((error) => {
        console.error('Failed to get session:', error);
        if (!isMounted) return;
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}

