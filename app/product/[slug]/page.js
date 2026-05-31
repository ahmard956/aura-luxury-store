'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Star,
  Minus,
  Plus
} from 'lucide-react';

export default function ProductDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);

  const {
    addToCart,
    toggleWishlist,
    wishlist
  } = useApp();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [params.slug]);

  async function fetchProductDetails() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) throw error;

      setProduct(data);

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', data.id);

      setReviews(reviewData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-luxury-gold uppercase tracking-[0.3em] text-xs">
          Loading Product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white/50 uppercase tracking-[0.3em] text-xs">
          Product Unavailable
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.some(
    item => item.id === product.id
  );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  async function handleReviewSubmission(e) {
    e.preventDefault();

    if (!newComment.trim()) {
      return alert('Please enter your review.');
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return alert(
        'Please register an official profile to leave feedback.'
      );
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.id,
        user_name: user.email.split('@')[0],
        rating: newRating,
        comment: newComment
      });

    if (error) {
      alert(
        'Review constraint encountered. Limits apply per acquisition.'
      );
      return;
    }

    setNewComment('');

    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id);

    setReviews(reviewData || []);
  }

  const imageUrl =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images[0]
      : '/placeholder-product.jpg';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* Product Image */}
        <div className="relative aspect-[4/5] bg-luxury-charcoal border border-white/5 overflow-hidden">

          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />

        </div>

        {/* Product Information */}
        <div className="flex flex-col">

          <p className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3">
            Heritage Piece
          </p>

          <h1 className="text-3xl md:text-5xl uppercase tracking-wider font-light mb-4">
            {product.name}
          </h1>

          {averageRating && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center text-luxury-gold">
                <Star className="w-4 h-4 fill-current" />
              </div>

              <span className="text-sm">
                {averageRating}
              </span>

              <span className="text-white/40 text-xs">
                ({reviews.length} Reviews)
              </span>
            </div>
          )}

          <div className="text-2xl text-luxury-gold tracking-widest mb-6">
            ${Number(product.price || 0).toLocaleString()}
          </div>

          <div className="border-y border-white/10 py-6 mb-8">

            <p className="text-white/70 leading-relaxed mb-6">
              {product.description}
            </p>

            {Array.isArray(product.features) &&
              product.features.length > 0 && (
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-white/55 flex items-center"
                    >
                      <span className="w-2 h-2 bg-luxury-gold rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">

            <span className="text-xs uppercase tracking-widest text-white/50">
              Quantity
            </span>

            <div className="flex items-center border border-white/10">

              <button
                onClick={() =>
                  setQuantity(prev =>
                    Math.max(1, prev - 1)
                  )
                }
                className="px-3 py-2 hover:bg-white/5"
              >
                <Minus size={14} />
              </button>

              <span className="px-4">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(prev => prev + 1)
                }
                className="px-3 py-2 hover:bg-white/5"
              >
                <Plus size={14} />
              </button>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() =>
                addToCart(product, quantity)
              }
              className="flex-1 bg-white text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-luxury-gold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              Add To Cart
            </button>

            <button
              onClick={() =>
                toggleWishlist(product)
              }
              className={`px-6 border transition-colors ${
                isWishlisted
                  ? 'bg-luxury-gold border-luxury-gold text-black'
                  : 'border-white/20 hover:border-white'
              }`}
            >
              <Heart
                size={18}
                fill={
                  isWishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>

          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-10 text-[11px] uppercase tracking-wider text-white/50">

            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-luxury-gold mr-2" />
              Secure Delivery
            </div>

            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 text-luxury-gold mr-2" />
              Easy Returns
            </div>

          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 border-t border-white/10 pt-12">

        <h2 className="text-xl uppercase tracking-widest mb-10">
          Client Feedback
        </h2>

        <div className="grid lg:grid-cols-3 gap-12">

          <form
            onSubmit={handleReviewSubmission}
            className="bg-luxury-charcoal p-6 border border-white/5 space-y-4 h-max"
          >
            <h3 className="text-xs uppercase tracking-widest text-luxury-gold">
              Submit Review
            </h3>

            <select
              value={newRating}
              onChange={e =>
                setNewRating(Number(e.target.value))
              }
              className="w-full bg-black border border-white/10 p-3 text-sm"
            >
              <option value={5}>★★★★★</option>
              <option value={4}>★★★★☆</option>
              <option value={3}>★★★☆☆</option>
              <option value={2}>★★☆☆☆</option>
              <option value={1}>★☆☆☆☆</option>
            </select>

            <textarea
              rows={5}
              value={newComment}
              onChange={e =>
                setNewComment(e.target.value)
              }
              placeholder="Share your experience..."
              className="w-full bg-black border border-white/10 p-3 text-sm text-white"
            />

            <button
              type="submit"
              className="w-full bg-white text-black py-3 uppercase tracking-wider text-xs font-bold hover:bg-luxury-gold transition-colors"
            >
              Submit Review
            </button>
          </form>

          <div className="lg:col-span-2 space-y-6">

            {reviews.length === 0 ? (
              <p className="text-white/40 text-sm">
                No reviews yet.
              </p>
            ) : (
              reviews.map(review => (
                <div
                  key={review.id}
                  className="border-b border-white/5 pb-5"
                >
                  <div className="flex justify-between items-center mb-2">

                    <span className="font-medium">
                      {review.user_name}
                    </span>

                    <div className="flex text-luxury-gold">
                      {Array.from({
                        length: review.rating
                      }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className="fill-current"
                        />
                      ))}
                    </div>

                  </div>

                  <p className="text-white/65 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>
      </section>
    </div>
  );
}