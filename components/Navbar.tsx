// components/Navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Listo para cuando subas tu logo
import { useCartStore } from './store/cartStore'; 
import { useEffect, useState } from 'react';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    // Fondo oscuro (#111) y borde muy sutil para separar del cuerpo de la página
    <nav className="bg-[#111111] border-b border-[#2a2a2a] py-5 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Sección del Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/LogoSinFondo.png" 
            alt="DAFMI Joyería" 
            width={120} 
            height={40} 
            className="object-contain" 
          /> 
        </Link>

        {/* Enlaces de Navegación */}
        <div className="space-x-8 flex items-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300">
            INICIO
          </Link>
          <Link href="/catalogo" className="text-gray-400 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300">
            CATÁLOGO
          </Link>
          
          {/* Carrito */}
          <Link href="/carrito" className="relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
            {/* Ícono de carrito de compras minimalista en SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            
            {mounted && totalItems > 0 && (
              // Burbuja del carrito en blanco para resaltar con el fondo oscuro
              <span className="absolute -top-2 -right-3 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}