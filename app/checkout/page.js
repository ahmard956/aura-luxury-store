'use client';
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const { cart, clearCart, user } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', state: '', zip: 'USA' });
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('active', true).single();
    if (data) {
      setDiscountPercent(data.discount_percent);
      alert(`Voucher approved: ${data.discount_percent}% reduction applied.`);
    } else {
      alert('Voucher not recognized or expired.');
    }
  };

  const handleStripeCheckoutRedirect = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          userId: user?.id || null,
          userEmail: user?.email || 'guest@aurastores.com',
          shippingAddress: shipping,
          discountApplied: discountAmount
        })
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Stripe pipeline failed to compile routing parameters.');
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-white grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Shipping Coordinates Setup Form */}
      <div className="bg-luxury-charcoal p-8 border border-white/5">
        <h2 className="text-lg uppercase tracking-widest font-light mb-6">Logistics Configuration</h2>
        <form onSubmit={handleStripeCheckoutRedirect} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Recipient Name</label>
            <input type="text" required value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} className="w-full bg-luxury-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Street Address</label>
            <input type="text" required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-luxury-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">City</label>
              <input type="text" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full bg-luxury-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">State</label>
              <input type="text" required value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} className="w-full bg-luxury-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">ZIP Code</label>
              <input type="text" required value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} className="w-full bg-luxury-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={processing} className="w-full bg-white text-luxury-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold disabled:bg-white/20 transition-colors">
              {processing ? 'COMPILING TRANSACTIONS...' : 'CONTINUE TO SECURE STRIPE GATEWAY'}
            </button>
          </div>
        </form>
      </div>

      {/* Financial Matrix Summary Display Panel */}
      <div className="space-y-6">
        <div className="bg-luxury-charcoal p-8 border border-white/5 space-y-4">
          <h2 className="text-lg uppercase tracking-widest font-light mb-4">Invoice Ledger</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
              <span className="truncate max-w-xs">{item.name} <b className="text-luxury-gold">x{item.quantity}</b></span>
              <span className="font-mono">${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="pt-4 space-y-2 text-xs uppercase tracking-wider">
            <div className="flex justify-between text-white/60">
              <span>Gross Total</span>
              <span className="font-mono">${subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Voucher Allotment</span>
                <span className="font-mono">-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-luxury-gold pt-2 border-t border-white/10">
              <span>Net Invoiced Amount</span>
              <span className="font-mono">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Coupon Integration Hub */}
        <div className="bg-luxury-charcoal p-6 border border-white/5 flex space-x-2">
          <input 
            type="text" 
            placeholder="PROMO CODE (e.g. AURA10)" 
            value={couponCode} 
            onChange={e => setCouponCode(e.target.value)} 
            className="flex-1 bg-luxury-black border border-white/10 px-4 text-xs uppercase tracking-widest focus:outline-none focus:border-luxury-gold text-white placeholder-white/20"
          />
          <button onClick={handleApplyCoupon} className="bg-white text-luxury-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-luxury-gold transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
