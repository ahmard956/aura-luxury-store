'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Heart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {

  // Safe image extraction
  const getProductImage = () => {
    if (!product || !product.images) {
      return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80';
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    if (typeof product.images === 'string') {
      return product.images;
    }

    return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80';
  };

  const imageUrl = getProductImage();

  const formattedPrice = product?.price
    ? Number(product.price).toLocaleString()
    : '0.00';

  return (
    <div className="group relative overflow-hidden border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:shadow-luxury flex flex-col h-full">

      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black/30">

        {/* Premium Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-luxury-gold text-luxury-black text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full shadow-soft">
            Exclusive
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-luxury-gold"
          aria-label="Add to Wishlist"
        >
          <Heart className="w-4 h-4 text-white hover:text-luxury-gold transition-colors" />
        </button>

        {/* Product Image */}
        <Image
          src={imageUrl}
          alt={product?.name || 'Luxury Product'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false}
        />

        {/* Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Quick View Button */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <Link
            href={
              product?.slug
                ? `/product/${product.slug}`
                : '#'
            }
            className="inline-flex items-center space-x-2 bg-white text-black px-5 py-3 text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-luxury-gold transition-colors duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-5">

        {/* Product Name */}
        <h3 className="text-sm uppercase tracking-[0.18em] text-white font-medium line-clamp-1">
          {product?.name || 'Untitled Piece'}
        </h3>

        {/* Product Description */}
        <p className="text-[11px] text-white/45 leading-relaxed font-light mt-3 line-clamp-2">
          {product?.description ||
            'Curated premium craftsmanship designed for modern elegance.'}
        </p>

        {/* Bottom Section */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/5">

          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Starting At
            </span>

            <span className="text-sm font-semibold text-luxury-gold tracking-wide mt-1">
              ${formattedPrice}
            </span>
          </div>

          {/* View Details */}
          <Link
            href={
              product?.slug
                ? `/product/${product.slug}`
                : '#'
            }
            className="text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-luxury-gold transition-colors duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}