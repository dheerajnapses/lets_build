'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/cart');
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="min-h-screen">
       <nav className="bg-white border-b p-4 px-8">
        <Link href="/" className="text-xl font-bold">iPhone Covers</Link>
      </nav>

      <div className="max-w-4xl mx-auto p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow" />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-blue-600 font-bold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="text-sm text-gray-500">
            <p>Category: {product.category}</p>
            <p>Availability: {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          </div>
          <button
            onClick={addToCart}
            disabled={product.stock <= 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
