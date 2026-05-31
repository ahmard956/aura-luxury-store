'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { Package, Heart, LogOut, Loader } from 'lucide-react';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, profile, wishlist, toggleWishlist } = useApp();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-12">
        <div>
          <p className="text-xs uppercase tracking-widest text-luxury-gold">AUTHENTICATED PROFILE</p>
          <h1 className="text-2xl uppercase tracking-[0.15em] font-light mt-1">{profile?.full_name || user.email}</h1>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          className="mt-4 md:mt-0 flex items-center space-x-2 text-xs uppercase tracking-widest text-white/40 hover:text-red-400 border border-white/10 px-4 py-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> <span>Terminate Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Orders Pipeline Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm uppercase tracking-[0.2em] font-semibold flex items-center mb-4">
            <Package className="w-4 h-4 mr-2 text-luxury-gold" /> Acquisition History
          </h2>
          {loadingOrders ? (
            <Loader className="w-5 h-5 animate-spin text-luxury-gold" />
          ) : orders.length === 0 ? (
            <p className="text-xs text-white/40 uppercase tracking-widest italic bg-luxury-charcoal p-6 border border-white/5">No previous secure allocations recorded.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-luxury-charcoal p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider border-b border-white/5 pb-3">
                  <div>
                    <span className="text-white/40">Reference Tracking:</span> <span className="font-mono text-white ml-1">{order.id.substring(0,8)}...</span>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-white text-luxury-black">{order.status}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/40 uppercase tracking-wider font-sans">Total Transaction Post</span>
                  <span className="text-luxury-gold font-bold">${order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Wishlist Cache Frame */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-[0.2em] font-semibold flex items-center mb-4">
            <Heart className="w-4 h-4 mr-2 text-luxury-gold" /> Vault Watchlist
          </h2>
          {wishlist.length === 0 ? (
            <p className="text-xs text-white/40 uppercase tracking-widest italic bg-luxury-charcoal p-6 border border-white/5">Watchlist vault is presently empty.</p>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-luxury-charcoal p-4 border border-white/5 justify-between">
                  <div className="flex items-center space-x-3 truncate">
                    <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover" />
                    <span className="text-xs uppercase tracking-wider font-medium truncate">{item.name}</span>
                  </div>
                  <button onClick={() => toggleWishlist(item)} className="text-[10px] uppercase tracking-widest text-red-400 hover:underline">
                    Drop
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
