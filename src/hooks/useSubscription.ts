import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    const check = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('has_access')
          .eq('id', user.id)
          .maybeSingle();

        setHasAccess(data?.has_access ?? false);
      } catch {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user]);

  return {
    subscription: hasAccess ? { subscription_status: 'active' } : null,
    loading,
    hasAccess,
  };
}
