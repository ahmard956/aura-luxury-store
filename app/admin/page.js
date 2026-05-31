'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import {
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPanel() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  const [analytics, setAnalytics] = useState({
    revenue: 0,
    itemsCount: 0,
    orderCount: 0,
    usersCount: 0
  });

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    verifyAdmin();
  }, []);

  async function verifyAdmin() {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } =
        await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

      if (!profile || profile.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);

      await refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    const [
      productsResult,
      ordersResult,
      usersResult
    ] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('users').select('*')
    ]);

    const productsData =
      productsResult.data || [];

    const ordersData =
      ordersResult.data || [];

    const usersData =
      usersResult.data || [];

    setProducts(productsData);
    setOrders(ordersData);
    setUsersCount(usersData.length);

    const revenue =
      ordersData.reduce(
        (sum, order) =>
          sum +
          Number(
            order.total_amount || 0
          ),
        0
      );

    setAnalytics({
      revenue,
      itemsCount: productsData.length,
      orderCount: ordersData.length,
      usersCount: usersData.length
    });
  }

  async function handleCreateProduct(e) {
    e.preventDefault();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { error } =
      await supabase
        .from('products')
        .insert({
          name,
          slug,
          price: Number(price),
          description,
          images: [
            imageUrl ||
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
          ],
          stock: 10
        });

    if (error) {
      alert(error.message);
      return;
    }

    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');

    await refreshData();

    alert('Product created successfully');
  }

  async function handleDeleteProduct(id) {
    const confirmed = confirm(
      'Delete this product permanently?'
    );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    await refreshData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const lowStockProducts =
    products.filter(
      p =>
        Number(p.stock || 0) <= 5
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">

      <div className="mb-12">
        <h1 className="text-3xl uppercase tracking-[0.2em] font-light flex items-center">
          <ShieldCheck className="w-7 h-7 mr-3 text-luxury-gold" />
          Admin Dashboard
        </h1>

        <p className="text-white/40 text-sm mt-2">
          Store analytics, inventory management and order monitoring.
        </p>
      </div>

      {/* Analytics */}

      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <StatCard
          icon={<DollarSign />}
          title="Revenue"
          value={`$${analytics.revenue.toLocaleString()}`}
        />

        <StatCard
          icon={<Package />}
          title="Products"
          value={analytics.itemsCount}
        />

        <StatCard
          icon={<ShoppingBag />}
          title="Orders"
          value={analytics.orderCount}
        />

        <StatCard
          icon={<Users />}
          title="Customers"
          value={analytics.usersCount}
        />

      </div>

      {/* Alerts */}

      {lowStockProducts.length > 0 && (
        <div className="mb-10 border border-red-500/20 bg-red-500/5 p-5 rounded">

          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="font-semibold">
              Low Stock Alerts
            </h3>
          </div>

          {lowStockProducts.map(product => (
            <p
              key={product.id}
              className="text-sm text-white/70"
            >
              {product.name} —
              {' '}
              {product.stock}
              {' '}
              remaining
            </p>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Product Form */}

        <form
          onSubmit={handleCreateProduct}
          className="bg-luxury-charcoal p-6 border border-white/10 rounded space-y-4"
        >
          <h2 className="text-sm uppercase tracking-widest flex items-center">
            <Plus className="w-4 h-4 mr-2 text-luxury-gold" />
            Add Product
          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={e =>
              setName(e.target.value)
            }
            required
            className="w-full bg-black border border-white/10 p-3 text-sm"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e =>
              setPrice(e.target.value)
            }
            required
            className="w-full bg-black border border-white/10 p-3 text-sm"
          />

          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={e =>
              setImageUrl(e.target.value)
            }
            className="w-full bg-black border border-white/10 p-3 text-sm"
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={description}
            onChange={e =>
              setDescription(
                e.target.value
              )
            }
            required
            className="w-full bg-black border border-white/10 p-3 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-luxury-gold text-black py-3 font-semibold uppercase text-sm"
          >
            Create Product
          </button>
        </form>

        {/* Products */}

        <div className="lg:col-span-2">

          <h2 className="text-sm uppercase tracking-widest mb-5">
            Product Inventory
          </h2>

          <div className="space-y-3">

            {products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-luxury-charcoal border border-white/10 p-4 rounded"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={
                      product.images?.[0] ||
                      '/placeholder.jpg'
                    }
                    alt={product.name}
                    className="w-12 h-12 object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {product.name}
                    </p>

                    <p className="text-xs text-luxury-gold">
                      $
                      {product.price}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    handleDeleteProduct(
                      product.id
                    )
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            ))}

          </div>
        </div>

      </div>

      {/* Orders */}

      <div className="mt-14">

        <h2 className="text-sm uppercase tracking-widest mb-5">
          Recent Orders
        </h2>

        <div className="overflow-x-auto border border-white/10">

          <table className="w-full text-sm">

            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4">
                  Order
                </th>
                <th className="text-left p-4">
                  Amount
                </th>
                <th className="text-left p-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {orders.map(order => (
                <tr
                  key={order.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">
                    {order.id}
                  </td>

                  <td className="p-4">
                    $
                    {Number(
                      order.total_amount || 0
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {order.status}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value
}) {
  return (
    <div className="bg-luxury-charcoal border border-white/10 p-5 rounded">
      <div className="text-luxury-gold mb-3">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-widest text-white/50">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}