'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b p-4 flex justify-between items-center px-8">
        <Link href="/" className="text-xl font-bold">iPhone Covers</Link>
        <div className="flex gap-4 items-center">
          {session ? (
            <>
              {(session.user as any).role === 'VENDOR' && (
                <Link href="/vendor/dashboard" className="text-blue-600">Dashboard</Link>
              )}
              <Link href="/orders" className="text-gray-600">My Orders</Link>
              <span>{session.user?.name}</span>
              <button onClick={() => signOut()} className="bg-gray-200 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-1 rounded">Register</Link>
            </>
          )}
          <Link href="/cart" className="relative">
            🛒 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
          </Link>
        </div>
      </nav>

      <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">All iPhone Covers</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <p className="font-bold text-blue-600">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
