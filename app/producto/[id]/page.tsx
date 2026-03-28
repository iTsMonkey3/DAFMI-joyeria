// app/producto/[id]/page.tsx
import { supabase } from '../../../lib/supabase'; // <-- Importamos Supabase
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  // 1. Desempacamos el ID de la URL
  const { id } = await params;

  // 2. Vamos a Supabase y buscamos la joya cuyo 'id' sea igual (eq) al de la URL
  const { data: product, error } = await supabase
    .from('joyas')
    .select('*')
    .eq('id', id)
    .single(); // Trae solo un objeto, no un arreglo

  // 3. Si alguien pone un ID inventado o hay un error, mostramos el 404
  if (error || !product) {
    notFound();
  }

  // 4. Si la encontramos, mostramos la información
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Lado izquierdo: Imagen grande */}
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center">
          {/* Usamos image_url porque así se llama la columna en Supabase */}
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

        {/* Lado derecho: Detalles de la joya */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
            {product.category}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-gray-500 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <span className="text-3xl font-bold text-gray-900 block mb-6">
              ${product.price} MXN
            </span>
            
            <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
              Agregar al carrito
            </button>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                &larr; Volver al catálogo
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}