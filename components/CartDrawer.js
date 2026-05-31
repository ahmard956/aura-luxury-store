'use client';
import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateCartQty, removeFromCart } = useApp();

  if (!cartOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-luxury-black border-l border-white/10 text-white flex flex-col justify-between">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <h2 className="text-sm uppercase tracking-[0.2em] font-semibold flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2 text-luxury-gold" /> Shopping Bag
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-24 text-white/40 text-xs uppercase tracking-widest">
                Your bag is empty.
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-6 border-b border-white/5">
                    <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 object-cover bg-luxury-charcoal" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs uppercase tracking-wider font-medium truncate">{item.name}</h4>
                      <p className="text-xs text-luxury-gold mt-1">${item.price?.toLocaleString()}</p>
                      <div className="flex items-center space-x-3 mt-3 border border-white/10 w-max px-2 py-1">
                        <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="text-white/60 hover:text-white">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs px-1">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="text-white/60 hover:text-white">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase text-white/40 hover:text-red-400 tracking-wider">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-white/10 p-6 bg-luxury-charcoal/50">
              <div className="flex justify-between text-xs uppercase tracking-widest mb-4">
                <span>Subtotal</span>
                <span className="text-luxury-gold font-semibold">${total.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-6">Shipping & taxes calculated at checkout.</p>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="block w-full bg-white text-luxury-black text-center py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-luxury-black transition-colors">
                Proceed To Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
