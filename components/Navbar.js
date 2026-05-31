'use client';
import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { cart, wishlist, setCartOpen, searchQuery, setSearchQuery, user, profile } = useApp();
  const [mobileMenu, setMobileMenu] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-luxury-black/95 border-b border-white/10 text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-[0.3em] uppercase text-white hover:text-luxury-gold transition-colors">
          Aura
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase font-medium">
          <Link href="/shop" className="hover:text-luxury-gold transition-colors">The Collections</Link>
          <Link href="/shop?category=watches" className="hover:text-luxury-gold transition-colors">Timepieces</Link>
          <Link href="/shop?category=handbags" className="hover:text-luxury-gold transition-colors">Couture Leather</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin" className="text-luxury-gold hover:underline">Admin Panel</Link>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative hidden sm:flex items-center border-b border-white/20 pb-1 focus-within:border-luxury-gold transition-all">
            <Search className="w-4 h-4 text-white/50 mr-2" />
            <input 
              type="text" 
              placeholder="SEARCH AURA..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs tracking-widest focus:outline-none uppercase placeholder-white/30 text-white w-40"
            />
          </div>
          
          <Link href={user ? "/dashboard" : "/login"}>
            <User className="w-5 h-5 cursor-pointer hover:text-luxury-gold transition-colors" />
          </Link>
          
          <Link href="/dashboard" className="relative">
            <Heart className="w-5 h-5 cursor-pointer hover:text-luxury-gold transition-colors" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-luxury-gold text-luxury-black text-[9px] font-bold px-1 rounded-full">{wishlist.length}</span>
            )}
          </Link>

          <button onClick={() => setCartOpen(true)} className="relative">
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-luxury-gold transition-colors" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-luxury-black text-[9px] font-bold px-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-luxury-charcoal border-t border-white/10 px-6 py-6 space-y-4 text-xs tracking-widest uppercase">
          <Link href="/shop" onClick={() => setMobileMenu(false)} className="block hover:text-luxury-gold">The Collections</Link>
          <Link href="/shop?category=watches" onClick={() => setMobileMenu(false)} className="block hover:text-luxury-gold">Timepieces</Link>
          <Link href="/shop?category=handbags" onClick={() => setMobileMenu(false)} className="block hover:text-luxury-gold">Couture Leather</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin" onClick={() => setMobileMenu(false)} className="block text-luxury-gold">Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
}
