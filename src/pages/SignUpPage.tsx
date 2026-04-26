import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';
import { supabase } from '../lib/supabase';

export function SignUpPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <SignupForm onSuccess={() => navigate('/dashboard')} onSwitchToLogin={() => navigate('/login')} />
      </div>
    </div>
  );
}
