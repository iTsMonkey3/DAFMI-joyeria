// components/Navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from './store/cartStore'; 
import { useEffect, useState } from 'react';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    <nav className="bg-[#111111] border-b border-[#2a2a2a] py-4 md:py-5 px-4 md:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO: Más pequeño en móvil (w:80), tamaño normal en desktop (md:w:120) */}
        <Link href="/" className="flex items-center z-50">
          <div className="w-[80px] md:w-[120px] relative h-[30px] md:h-[40px]">
            <Image 
              src="/LogoSinFondo.png" 
              alt="DAFMI Joyería" 
              fill
              className="object-contain object-left" 
            /> 
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP (Oculta en móvil con 'hidden md:flex') */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300">
            INICIO
          </Link>
          <Link href="/catalogo" className="text-gray-400 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300">
            CATÁLOGO
          </Link>
          
          {/* Carrito Desktop */}
          <Link href="/carrito" className="relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* CONTROLES MÓVILES (Ocultos en desktop con 'md:hidden') */}
        <div className="flex md:hidden items-center gap-6 z-50">
          
          {/* Carrito Móvil */}
          <Link href="/carrito" className="relative text-white flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Botón de Menú Hamburguesa */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-white focus:outline-none"
            aria-label="Menú principal"
          >
            {menuAbierto ? (
              // Ícono 'X' cuando está abierto
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Ícono 'Hamburguesa' cuando está cerrado
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {/* Se anima suavemente usando transiciones de Tailwind */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-[#111111] border-b border-[#2a2a2a] transition-all duration-300 ease-in-out origin-top ${
          menuAbierto ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col py-4 px-4 space-y-6">
          <Link 
            href="/" 
            onClick={() => setMenuAbierto(false)} // Cierra el menú al hacer clic
            className="text-gray-300 hover:text-white text-sm font-medium tracking-widest border-b border-[#222] pb-2"
          >
            INICIO
          </Link>
          <Link 
            href="/catalogo" 
            onClick={() => setMenuAbierto(false)}
            className="text-gray-300 hover:text-white text-sm font-medium tracking-widest border-b border-[#222] pb-2"
          >
            CATÁLOGO
          </Link>
        </div>
      </div>

    </nav>
  );
}