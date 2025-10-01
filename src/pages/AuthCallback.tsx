// pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Getting session...');
        
        // Get the current session after OAuth redirect
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (session?.user) {
          setStatus('Setting up your profile...');
          
          // Check if profile already exists
          const { data: existingProfile, error: profileCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            // PGRST116 means no rows returned (profile doesn't exist)
            console.error('Profile check error:', profileCheckError);
          }

          // Create profile if it doesn't exist
          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name ||
                      session.user.email?.split('@')[0] ||
                      'User',
                created_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
            } else {
              console.log('Profile created successfully for:', session.user.email);
            }
          } else {
            console.log('Profile already exists for:', session.user.email);
          }

          setStatus('Welcome! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('No session found. Redirecting to login...');
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-2xl font-bold text-cute-charcoal font-baloo mb-2">
          {status.includes('Welcome') ? 'Welcome to Pastel Dream!' : 'Processing...'}
        </h1>
        <p className="text-cute-charcoal opacity-70 font-poppins mb-4">
          {status}
        </p>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    </div>
  );
};