'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!address) {
      alert('Please enter a delivery address');
      return;
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
        total,
        address,
      }),
    });

    if (res.ok) {
      localStorage.removeItem('cart');
      router.push('/orders');
    } else {
      alert('Checkout failed');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1">-</button>
                <span className="px-3">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <textarea
          placeholder="Delivery Address"
          className="w-full p-3 border rounded mb-4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          {session ? 'Checkout' : 'Login to Checkout'}
        </button>
      </div>
    </div>
  );
}
