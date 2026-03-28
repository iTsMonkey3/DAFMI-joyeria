import { Product } from '../lib/types'; // <-- 1. Nueva ruta de importación
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product}) {
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover" />
      <div className="p-5">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{product.category}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-1">{product.name}</h3>
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price} MXN</span>
          <Link href={`/producto/${product.id}`}>
            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                Ver detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}