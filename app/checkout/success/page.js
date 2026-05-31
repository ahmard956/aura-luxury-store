'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useApp();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="max-w-md mx-auto text-center py-24 px-6 font-sans text-white">
      <div className="bg-luxury-charcoal p-8 border border-white/5 space-y-6 flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-luxury-gold" />
        <h1 className="text-2xl uppercase tracking-[0.2em] font-light">Acquisition Confirmed</h1>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          Your allocation transaction has finished processing. White-glove logistics agents are arranging transportation. Verification parameters have been transmitted via email routing.
        </p>
        <Link href="/dashboard" className="inline-block bg-white text-luxury-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors">
          View Order History
        </Link>
      </div>
    </div>
  );
}
