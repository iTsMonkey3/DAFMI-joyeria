// components/TopProducts.tsx
"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function TopProducts() {
  const [populares, setPopulares] = useState<Product[]>([]);
  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function cargarPopulares() {
      const { data: topIds } = await supabase.from('joyas_populares').select('product_id');
      if (topIds && topIds.length > 0) {
        const ids = topIds.map(item => item.product_id);
        const { data: joyas } = await supabase
          .from('joyas')
          .select('*')
          .in('id', ids);
        if (joyas) setPopulares(joyas);
      }
    }
    cargarPopulares();
  }, []);

  const scroll = (direccion: 'izquierda' | 'derecha') => {
    if (carruselRef.current) {
      const { scrollLeft, clientWidth } = carruselRef.current;
      // Ajustamos el scroll para que se mueva de forma más natural con tarjetas chicas
      const cantidadScroll = clientWidth * 0.5; 
      carruselRef.current.scrollTo({
        left: direccion === 'izquierda' ? scrollLeft - cantidadScroll : scrollLeft + cantidadScroll,
        behavior: 'smooth'
      });
    }
  };

  if (populares.length === 0) return null;

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Título centrado para un look más simétrico ahora que las flechas están a los lados */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase mb-4 text-white">
          Lo más buscado
        </h2>
        <div className="h-0.5 w-16 bg-white mx-auto"></div>
      </div>

      {/* Contenedor relativo para posicionar las flechas */}
      <div className="relative group/carrusel">
        
        {/* Flecha Izquierda */}
        <button 
          onClick={() => scroll('izquierda')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 hidden md:flex w-12 h-12 bg-black/50 border border-white/10 items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover/carrusel:opacity-100 group-hover/carrusel:left-0 transition-all duration-300 hover:bg-white hover:text-black"
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Carrusel */}
        <div 
          ref={carruselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {populares.map((joya) => (
            // Tarjetas más chicas: w-[260px] en móvil y w-[320px] en desktop
            <div 
              key={joya.id} 
              className="w-[260px] md:w-[320px] flex-none snap-start"
            >
              <ProductCard product={joya} />
            </div>
          ))}
        </div>

        {/* Flecha Derecha */}
        <button 
          onClick={() => scroll('derecha')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 hidden md:flex w-12 h-12 bg-black/50 border border-white/10 items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover/carrusel:opacity-100 group-hover/carrusel:right-0 transition-all duration-300 hover:bg-white hover:text-black"
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="text-center mt-4">
        <Link href="/catalogo" className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-gray-800 pb-1">
          Explorar todo el catálogo
        </Link>
      </div>

    </section>
  );
}