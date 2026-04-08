"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/types';

export default function Catalogo() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const valorMaximo = 100000
  
  // Estados para los Filtros
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState(valorMaximo);

  // NUEVO 1: Estados para la Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20; // Aquí decides cuántos mostrar

  const categorias = ['Todas', 'Anillos', 'Collares', 'Pulseras'];

  useEffect(() => {
    async function obtenerJoyas() {
      const { data, error } = await supabase.from('joyas').select('*').order('name');
      if (error) {
        console.error("Error al traer datos:", error);
      } else if (data) {
        setProductos(data);
      }
      setCargando(false);
    }
    obtenerJoyas();
  }, []);

  // NUEVO 2: Si el usuario cambia CUALQUIER filtro, lo regresamos a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, busqueda, precioMaximo]);

  // Lógica de Filtrado (Se queda igualita)
  const joyasFiltradas = productos.filter((joya) => {
    const coincideCategoria = categoriaActiva === 'Todas' || joya.category === categoriaActiva;
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = joya.name.toLowerCase().includes(textoBusqueda) || 
                          joya.description.toLowerCase().includes(textoBusqueda);
    const coincidePrecio = joya.price <= precioMaximo;
    return coincideCategoria && coincideTexto && coincidePrecio;
  });

  // NUEVO 3: Lógica de Paginación (Cortamos el arreglo filtrado)
  const indiceUltimoItem = paginaActual * productosPorPagina;
  const indicePrimerItem = indiceUltimoItem - productosPorPagina;
  const joyasPaginadas = joyasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
  
  const totalPaginas = Math.ceil(joyasFiltradas.length / productosPorPagina);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Colección Exclusiva
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Descubre nuestras piezas únicas y encuentra la ideal para ti.
          </p>
        </header>

        {/* Barra de Herramientas (Filtros) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, material o detalle..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                <span>Precio máximo:</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={precioMaximo}
                    onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                    className="w-28 pl-6 pr-2 py-1 text-right font-bold text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </label>
              <input
                type="range"
                min="0"
                max={valorMaximo}
                step="500"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mt-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
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
        </div>

        {/* Resultados */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Cargando la colección...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-500 font-medium flex justify-between items-center">
              <span>
                Mostrando {indicePrimerItem + 1} - {Math.min(indiceUltimoItem, joyasFiltradas.length)} de {joyasFiltradas.length} piezas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* NUEVO 4: Iteramos sobre joyasPaginadas, no sobre todas */}
              {joyasPaginadas.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* NUEVO 5: Controles de Paginación UI */}
            {totalPaginas > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  &larr; Anterior
                </button>
                
                <span className="text-gray-600 font-medium">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Siguiente &rarr;
                </button>
              </div>
            )}

            {!cargando && joyasFiltradas.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-2xl mb-2">🥲</p>
                <p className="text-xl text-gray-900 font-bold">No encontramos ninguna joya con esos filtros.</p>
                <button 
                  onClick={() => {
                    setBusqueda('');
                    setPrecioMaximo(valorMaximo);
                    setCategoriaActiva('Todas');
                  }}
                  className="mt-6 text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}