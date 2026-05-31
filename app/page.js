'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { ArrowUpRight, ShieldCheck, Gem, Compass, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*').limit(4);
        if (data) setFeatured(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getFeaturedProducts();
  }, []);

  return (
    <div className="bg-[#080808] text-[#F5F5F7] min-h-screen">
      {/* Cinematic Split Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" 
            alt="Aura Cinematic Background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Enhanced deep gradient overlay to ensure text stands out clearly against bright backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#080808]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 pt-16">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/90 font-medium">The 2026 Collection Vault</span>
          </div>
          
          {/* Responsive tracking and text sizing to prevent screen edge overflow on mobile */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight tracking-[0.1em] sm:tracking-[0.15em] uppercase leading-tight text-white">
            DEFINITION OF <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E5E4E2] to-[#D4AF37]">
              PURE AURA
            </span>
          </h1>
          
          {/* High-visibility paragraph text with background drop shadowing */}
          <p className="max-w-md mx-auto text-xs sm:text-sm text-white/80 font-light tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Step into timeless elegance. Explore limited-series mechanical timepieces and hand-tailored leather goods engineered for excellence.
          </p>

          {/* Bulletproof inline style contrast fix for the main button action wrapper */}
          <div className="pt-6">
            <Link 
              href="/shop" 
              style={{ backgroundColor: '#F5F5F7', color: '#000000' }}
              className="inline-flex items-center space-x-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-90 shadow-2xl group"
            >
              <span style={{ color: '#000000' }} className="font-bold">Explore Showroom</span>
              <ArrowUpRight style={{ color: '#000000' }} className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Value Proposition Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group space-y-4 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Gem className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Artisanal Masterwork</h3>
            <p className="text-xs text-white/50 font-light leading-relaxed">
              Every curated piece is accompanied by a blockchain-backed certification verifying its origin.
            </p>
          </div>

          <div className="group space-y-4 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Compass className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Fast Track Delivery</h3>
            <p className="text-xs text-white/50 font-light leading-relaxed">
              Complimentary fully insured, climate-controlled dynamic logistics across the United States.
            </p>
          </div>

          <div className="group space-y-4 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Private Concierge</h3>
            <p className="text-xs text-white/50 font-light leading-relaxed">
              Enjoy 24/7 access to dedicated portfolio managers for bespoke product sourcings.
            </p>
          </div>
        </div>
      </section>

      {/* Main Showroom Area */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold">EXCLUSIVELY CURATED</span>
            <h2 className="text-3xl uppercase tracking-widest font-extralight text-white mt-1">The Digital Showroom</h2>
          </div>
          <Link 
            href="/shop" 
            className="text-xs uppercase tracking-widest border-b border-[#D4AF37] text-[#D4AF37] pb-1 hover:text-white hover:border-white transition-all duration-300"
          >
            Browse Full Catalog
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white/5 aspect-[3/4] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/[0.01]">
            <p className="text-xs text-white/40 uppercase tracking-widest">Showroom is currently undergoing curation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
