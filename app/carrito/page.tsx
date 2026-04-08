// app/carrito/page.tsx
"use client";

import { useCartStore } from '../../components/store/cartStore';
import Link from 'next/link';
import { useEffect, useState } from 'react'; //a

export default function CarritoPage() {
  const { items, eliminarDelCarrito, limpiarCarrito } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Evitamos errores de hidratación esperando a que el navegador lea el localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.cantidad), 0);

  // Lógica para enviar a WhatsApp
  const enviarPedidoPorWhatsApp = () => {
    const numeroEmpresa = "523320704632"; // El número de tu tío
    
    // Tu dominio base (Asegúrate de cambiarlo si después compras un dominio propio)
    const dominioBase = "https://catalogo-nexrt-pruebas.vercel.app";
    
    // Armamos el texto línea por línea
    let mensaje = `¡Hola! Me gustaría cotizar y confirmar disponibilidad de las siguientes piezas:\n\n`;
    
    items.forEach((item) => {
      // 1. Agregamos el nombre y precio
      mensaje += `*${item.cantidad}x ${item.name}* - $${item.price.toLocaleString('en-US')} MXN c/u\n`;
      // 2. Agregamos el link directo a la pieza
      mensaje += `🔗 Ver pieza: ${dominioBase}/producto/${item.id}\n\n`; 
    });

    mensaje += `*Total estimado: $${total.toLocaleString('en-US')} MXN*`;
    mensaje += `\n\n¿Tienen estas piezas en existencia?`;

    const linkWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrimos WhatsApp en una nueva pestaña
    window.open(linkWhatsApp, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tu Carrito de Cotización</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🛒</span>
            <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío.</p>
            <Link href="/catalogo" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="divide-y divide-gray-100 border-t border-gray-100 pt-4">
              {items.map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-center gap-6">
                  <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="text-indigo-600 font-bold mt-1">${item.price.toLocaleString('en-US')} MXN</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold">
                      Cant: {item.cantidad}
                    </div>
                    <button 
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-gray-500 mb-1">Total estimado</p>
                <p className="text-3xl font-extrabold text-black">${total.toLocaleString('en-US')} MXN</p>
              </div>
              
              <button 
                onClick={enviarPedidoPorWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <span>💬</span>
                Solicitar por WhatsApp
              </button>
            </div>
            
            <div className="text-right">
               <button onClick={limpiarCarrito} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                 Vaciar carrito
               </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}