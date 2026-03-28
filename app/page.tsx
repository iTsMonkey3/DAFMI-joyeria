"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase'; // <-- Importamos nuestro puente a Supabase

export default function Home() {
  // 1. Estados para guardar los datos de la BD y saber si está cargando
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const categorias = ['Todas', 'Anillos', 'Collares', 'Pulseras'];

  useEffect(() => {
      async function obtenerJoyas() {
        const { data, error } = await supabase.from('joyas').select('*');
        
        if (error) {
          console.error("Error al traer datos:", error);
        } else if (data) {
          // ¡Mira qué limpio queda ahora! Directo de la BD al estado
          setProductos(data); 
        }
        setCargando(false);
      }

      obtenerJoyas();
    }, []);

  // 3. Filtramos la lista, pero ahora usando los datos de Supabase ('productos')
  const joyasFiltradas = categoriaActiva === 'Todas' 
    ? productos 
    : productos.filter((joya) => joya.category === categoriaActiva);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Colección Exclusiva
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Descubre nuestras piezas únicas traídas desde la nube ☁️💍
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                categoriaActiva === categoria
                  ? 'bg-black text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* 4. Si está cargando, mostramos un mensaje chido */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Cargando la colección...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {joyasFiltradas.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!cargando && joyasFiltradas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No hay piezas disponibles en esta categoría por ahora.</p>
          </div>
        )}

      </div>
    </main>
  );
}