// components/TopProducts.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

export default function TopProducts() {
  const [populares, setPopulares] = useState<Product[]>([]);

  useEffect(() => {
    async function cargarPopulares() {
      // 1. Traemos los IDs más populares de nuestra Vista
      const { data: topIds } = await supabase.from('joyas_populares').select('product_id');
      
      if (topIds && topIds.length > 0) {
        const ids = topIds.map(item => item.product_id);
        
        // 2. Traemos la información completa de esas joyas
        const { data: joyas } = await supabase
          .from('joyas')
          .select('*')
          .in('id', ids);
          
        if (joyas) setPopulares(joyas);
      }
    }
    cargarPopulares();
  }, []);

  if (populares.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span>🔥</span> Lo más buscado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {populares.map((joya) => (
            <ProductCard key={joya.id} product={joya} />
          ))}
        </div>
      </div>
    </section>
  );
}