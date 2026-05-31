'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setCart([]);
        setWishlist([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const fetchUserData = async (userId) => {
    const { data: cartData } = await supabase.from('cart').select('*, products(*)').eq('user_id', userId);
    if (cartData) {
      setCart(cartData.map(item => ({ ...item.products, quantity: item.quantity, cartId: item.id })));
    }
    const { data: wishData } = await supabase.from('wishlist').select('*, products(*)').eq('user_id', userId);
    if (wishData) {
      setWishlist(wishData.map(item => item.products));
    }
  };

  const addToCart = async (product, qty = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (user) {
      if (existing) {
        const newQty = existing.quantity + qty;
        await supabase.from('cart').update({ quantity: newQty }).eq('user_id', user.id).eq('product_id', product.id);
      } else {
        await supabase.from('cart').insert({ user_id: user.id, product_id: product.id, quantity: qty });
      }
      await fetchUserData(user.id);
    } else {
      if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item));
      } else {
        setCart([...cart, { ...product, quantity: qty }]);
      }
    }
    setCartOpen(true);
  };

  const updateCartQty = async (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    if (user) {
      await supabase.from('cart').update({ quantity: qty }).eq('user_id', user.id).eq('product_id', productId);
      await fetchUserData(user.id);
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: qty } : item));
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      await supabase.from('cart').delete().eq('user_id', user.id).eq('product_id', productId);
      await fetchUserData(user.id);
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) return;
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id });
    }
    await fetchUserData(user.id);
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart').delete().eq('user_id', user.id);
    }
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      user, profile, cart, wishlist, cartOpen, setCartOpen, searchQuery, setSearchQuery,
      loading, addToCart, updateCartQty, removeFromCart, toggleWishlist, clearCart, refreshProfile: () => fetchProfile(user?.id)
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
