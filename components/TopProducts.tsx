// components/TopProducts.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';
import Link from 'next/link';

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
    <section className="py-24 px-8 max-w-7xl mx-auto">
      {/* Encabezado elegante alineado al diseño oscuro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-widest uppercase mb-2 text-white">Lo más buscado</h2>
          <div className="h-1 w-20 bg-white"></div>
        </div>
        <Link href="/catalogo" className="text-sm text-gray-500 hover:text-white transition-colors border-b border-gray-800 pb-1 uppercase tracking-wider">
          Ver todo el catálogo
        </Link>
      </div>

      {/* Grid de productos (3 columnas para mayor impacto visual de la foto) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {populares.map((joya) => (
          <ProductCard key={joya.id} product={joya} />
        ))}
      </div>
    </section>
  );
}