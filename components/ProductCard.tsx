// components/ProductCard.tsx
import Link from 'next/link';
import { Product } from '../lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Función auxiliar para formatear el precio bonito con comas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-[#111111] border border-[#1a1a1a] p-5 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:border-[#333333] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.05)] h-full">
      
      {/* IMAGEN: Usando etiqueta nativa img para evitar costos de optimización */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a] mb-6">
        <img 
          src={product.image_url || '/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay oscuro sutil al hacer hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* TEXTOS Y BOTÓN */}
      <div className="flex flex-col flex-grow text-center">
        <span className="text-[10px] font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
          {product.category}
        </span>
        
        <h3 className="text-lg font-serif font-medium text-white mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Descripción sutil y limitada a 2 líneas */}
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 font-light px-2">
          {product.description}
        </p>
        
        {/* mt-auto empuja el precio y el botón hacia abajo */}
        <div className="mt-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">
            Desde <span className="text-gray-200 font-medium">{formatPrice(product.price)}</span>
          </p>
          
          <Link 
            href={`/producto/${product.id}`} 
            className="inline-block border border-gray-700 text-gray-300 font-medium text-[11px] tracking-[0.2em] py-4 px-8 uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 w-full"
          >
            Ver Detalles
          </Link>
        </div>
      </div>

    </div>
  );
}