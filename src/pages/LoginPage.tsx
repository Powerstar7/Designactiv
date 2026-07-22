import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { supabase } from '../lib/supabase';

async function destinationForUser(userId: string, redirect: string | null): Promise<string> {
  if (redirect) return redirect;
  const { data } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'admin' ? '/admin' : '/dashboard';
}

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate(await destinationForUser(user.id, redirect), { replace: true });
    })();
  }, [navigate, redirect]);

  const handleAuthSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) navigate(await destinationForUser(user.id, redirect), { replace: true });
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
