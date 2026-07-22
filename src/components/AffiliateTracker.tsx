import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function AffiliateTracker() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('affiliate_ref', ref);
      localStorage.setItem('affiliate_ref_time', Date.now().toString());
    }
  }, [location.search]);

  return null;
}
