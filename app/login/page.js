'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export default function AuthenticationPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  if (user) router.push('/dashboard');

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setMessage('');
    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName, role: 'customer' } }
      });
      if (error) setMessage(error.message);
      else setMessage('Registration complete. Welcome to Aura.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 font-sans text-white">
      <div className="bg-luxury-charcoal p-8 border border-white/5 space-y-6">
        <div className="text-center">
          <h2 className="text-xl uppercase tracking-[0.3em] font-light">{isRegister ? 'Create Profile' : 'Authenticate Profile'}</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Access the global luxury repository</p>
        </div>

        {message && <div className="text-xs text-center bg-white/5 p-3 text-luxury-gold uppercase tracking-wider border border-luxury-gold/20">{message}</div>}

        <form onSubmit={handleAuthentication} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Full Legal Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-luxury-black border border-white/10 p-3 text-xs focus:outline-none focus:border-luxury-gold" />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Email Destination</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-luxury-black border border-white/10 p-3 text-xs focus:outline-none focus:border-luxury-gold" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Password Key</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-luxury-black border border-white/10 p-3 text-xs focus:outline-none focus:border-luxury-gold" />
          </div>
          <button type="submit" className="w-full bg-white text-luxury-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold transition-colors">
            {isRegister ? 'Register Account' : 'Authenticate'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/5">
          <button onClick={() => setIsRegister(!isRegister)} className="text-[11px] uppercase tracking-widest text-luxury-gold hover:underline">
            {isRegister ? 'Already registered? Authenticate' : 'Create a premium new profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
