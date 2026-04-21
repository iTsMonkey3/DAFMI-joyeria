// app/catalogo/page.tsx
"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard'; 
import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/types';

export default function Catalogo() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const valorMaximo = 100000;
  
  // Estados para los Filtros
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState(valorMaximo);

  // Estados para la Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

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

  // Reset de página al filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, busqueda, precioMaximo]);

  // Lógica de Filtrado
  const joyasFiltradas = productos.filter((joya) => {
    const coincideCategoria = categoriaActiva === 'Todas' || joya.category === categoriaActiva;
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = joya.name.toLowerCase().includes(textoBusqueda) || 
                          joya.description.toLowerCase().includes(textoBusqueda);
    const coincidePrecio = joya.price <= precioMaximo;
    return coincideCategoria && coincideTexto && coincidePrecio;
  });

  // Lógica de Paginación
  const indiceUltimoItem = paginaActual * productosPorPagina;
  const indicePrimerItem = indiceUltimoItem - productosPorPagina;
  const joyasPaginadas = joyasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
  
  const totalPaginas = Math.ceil(joyasFiltradas.length / productosPorPagina);

  return (
    // Agregamos 'relative' aquí para contener el contexto de z-index
    <main className="min-h-screen bg-[#0a0a0a] text-white py-16 px-4 md:px-8 relative">
      
      {/* --- LOGO DE FONDO (MARCA DE AGUA) --- */}
      {/* fixed: se queda centrado en la pantalla. pointer-events-none: no bloquea clics. opacity-[0.03]: opacidad del 3% */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] md:opacity-[0.05]">
        <img 
          src="/LogoSinFondo.png" 
          alt="DAFMI Watermark" 
          className="w-[90vw] md:w-[60vw] max-w-5xl object-contain grayscale"
        />
      </div>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      {/* relative z-10: asegura que todo el contenido esté por encima de la marca de agua */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ENCABEZADO */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6">
            Colección Exclusiva
          </h1>
          <div className="h-0.5 w-16 bg-white mx-auto mb-6"></div>
          <p className="text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            Descubre nuestras piezas únicas y encuentra la ideal para ti.
          </p>
        </header>

        {/* BARRA DE FILTROS */}
        <div className="bg-[#111111]/80 backdrop-blur-sm p-6 md:p-8 border border-[#1a1a1a] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            
            <div className="col-span-1 md:col-span-2 group">
              <label className="block text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase mb-2 transition-colors duration-500 group-focus-within:text-white">
                Buscar Pieza
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Anillo solitario, oro blanco..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full bg-transparent border-b border-[#333] text-lg text-white placeholder-[#444] py-3 pr-10 focus:border-white focus:outline-none transition-all duration-500 font-light"
                />
                <span className="absolute inset-y-0 right-0 flex items-center text-[#444] group-focus-within:text-white transition-colors duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Rango de Precio */}
            <div className="col-span-1">
              <label className="flex justify-between items-center text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase mb-3">
                <span>Precio Máximo</span>
                <span className="text-white font-bold tracking-normal text-sm">
                  ${precioMaximo.toLocaleString('en-US')} MXN
                </span>
              </label>
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max={valorMaximo}
                  step="500"
                  value={precioMaximo}
                  onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                  className="w-full h-1 bg-[#2a2a2a] appearance-none cursor-pointer accent-white relative z-20"
                />
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-[#1a1a1a]">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative z-20 ${
                  categoriaActiva === categoria
                    ? 'bg-white text-black border border-white'
                    : 'bg-transparent text-gray-400 border border-[#333] hover:border-white hover:text-white'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTADOS */}
        {cargando ? (
          <div className="text-center py-32 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-white border-solid rounded-full animate-spin mb-6"></div>
            <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Preparando catálogo</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-[11px] text-gray-500 uppercase tracking-widest flex justify-between items-center border-b border-[#1a1a1a] pb-4">
              <span>
                Mostrando {joyasFiltradas.length > 0 ? indicePrimerItem + 1 : 0} - {Math.min(indiceUltimoItem, joyasFiltradas.length)} de {joyasFiltradas.length} piezas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
              {joyasPaginadas.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ESTADO VACÍO */}
            {!cargando && joyasFiltradas.length === 0 && (
              <div className="text-center py-32 border border-[#1a1a1a] bg-[#111111]/80 backdrop-blur-sm relative z-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-600 mb-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <p className="text-lg text-white font-serif mb-2">No se encontraron piezas</p>
                <p className="text-gray-500 text-sm font-light mb-8">Intenta ajustar los filtros de búsqueda.</p>
                <button 
                  onClick={() => {
                    setBusqueda('');
                    setPrecioMaximo(valorMaximo);
                    setCategoriaActiva('Todas');
                  }}
                  className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gray-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="mt-20 flex justify-center items-center gap-6 relative z-20">
                <button
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                  className="w-10 h-10 flex items-center justify-center border border-[#333] text-white disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white hover:text-black transition-all"
                  aria-label="Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                
                <span className="text-gray-400 text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-white">{paginaActual}</span> / {totalPaginas}
                </span>

                <button
                  onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                  className="w-10 h-10 flex items-center justify-center border border-[#333] text-white disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white hover:text-black transition-all"
                  aria-label="Siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}