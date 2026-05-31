'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

import ProductCard from '@/components/ProductCard';

import {
  SlidersHorizontal,
  Loader,
  Search,
  Grid3X3
} from 'lucide-react';

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const { searchQuery } = useApp();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const [sortOrder, setSortOrder] = useState('default');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortOrder, searchQuery]);

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);

      let query = supabase
        .from('products')
        .select('*, categories(*)');

      if (
        selectedCategory &&
        selectedCategory !== 'all'
      ) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', selectedCategory)
          .single();

        if (category) {
          query = query.eq(
            'category_id',
            category.id
          );
        }
      }

      if (searchQuery) {
        query = query.ilike(
          'name',
          `%${searchQuery}%`
        );
      }

      switch (sortOrder) {
        case 'price-asc':
          query = query.order('price', {
            ascending: true
          });
          break;

        case 'price-desc':
          query = query.order('price', {
            ascending: false
          });
          break;

        case 'newest':
          query = query.order('created_at', {
            ascending: false
          });
          break;

        default:
          break;
      }

      const { data, error } =
        await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10">

      {/* Sidebar */}
      <aside className="w-full lg:w-72 flex-shrink-0">

        <div className="sticky top-28">

          <div className="border border-white/10 bg-white/[0.02] p-6">

            <div className="flex items-center mb-6">
              <SlidersHorizontal className="w-4 h-4 text-luxury-gold mr-2" />
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold">
                Filters
              </h3>
            </div>

            {/* Categories */}
            <div className="mb-8">

              <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">
                Categories
              </h4>

              <div className="space-y-2">

                <button
                  onClick={() =>
                    setSelectedCategory('all')
                  }
                  className={`w-full text-left text-xs uppercase tracking-wide transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-luxury-gold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  All Collections
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        category.slug
                      )
                    }
                    className={`w-full text-left text-xs uppercase tracking-wide transition-colors ${
                      selectedCategory ===
                      category.slug
                        ? 'text-luxury-gold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>

              <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">
                Sort By
              </h4>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value
                  )
                }
                className="w-full bg-luxury-charcoal border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-luxury-gold"
              >
                <option value="default">
                  Featured
                </option>

                <option value="newest">
                  New Arrivals
                </option>

                <option value="price-asc">
                  Price: Low To High
                </option>

                <option value="price-desc">
                  Price: High To Low
                </option>

              </select>
            </div>

          </div>

        </div>

      </aside>

      {/* Products */}
      <section className="flex-1">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>

            <h2 className="text-xl uppercase tracking-[0.2em] font-light">
              Curated Collections
            </h2>

            <p className="text-xs text-white/40 uppercase tracking-widest mt-2">
              {products.length} Products Found
            </p>

          </div>

          {searchQuery && (
            <div className="flex items-center text-xs uppercase tracking-wider text-luxury-gold">
              <Search className="w-3.5 h-3.5 mr-2" />
              "{searchQuery}"
            </div>
          )}

        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-[4/5] bg-white/[0.03] animate-pulse border border-white/5"
              />
            ))}

          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">

            <Grid3X3 className="w-10 h-10 mx-auto text-white/20 mb-4" />

            <h3 className="uppercase tracking-[0.2em] text-sm text-white/60">
              No Products Found
            </h3>

            <p className="text-white/40 text-sm mt-3">
              Try changing your category or search filters.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Hero */}
      <div className="text-center border-b border-white/10 pb-12 mb-12">

        <p className="text-[10px] uppercase tracking-[0.45em] text-luxury-gold mb-4">
          Luxury Catalog
        </p>

        <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] font-light">
          The Collections Vault
        </h1>

        <p className="text-white/50 max-w-2xl mx-auto mt-5 text-sm">
          Explore curated luxury pieces crafted for
          timeless elegance and modern sophistication.
        </p>

      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <Loader className="w-6 h-6 animate-spin text-luxury-gold" />
          </div>
        }
      >
        <ShopCatalogContent />
      </Suspense>

    </div>
  );
}