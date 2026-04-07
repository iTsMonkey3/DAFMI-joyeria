// app/producto/[id]/page.tsx
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. LA MAGIA PARA WHATSAPP: Generamos los metadatos dinámicos
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase.from('joyas').select('*').eq('id', id).single();

  if (!product) return { title: 'Joya no encontrada' };

  return {
    title: `${product.name} | Catálogo de Joyería`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url], // <-- Esta es la foto que WhatsApp mostrará en la tarjetita
    },
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('joyas')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // 2. CONFIGURACIÓN DEL MENSAJE DE WHATSAPP
  const numeroEmpresa = "523320704632"; // Sustituye con el número de tu tío (con código de país, sin el +)
  
  // Como estamos en el servidor, armamos la URL pública "a mano". 
  // Sustituye el dominio por el que te dio Vercel
  const urlDelProducto = `https://catalogo-nexrt-pruebas.vercel.app/producto/${product.id}`; 
  
  const mensajeBase = `¡Hola! Me interesa preguntar por la disponibilidad de esta pieza:\n\n*${product.name}*\nPrecio: $${product.price} MXN\n\nPuedes verla aquí: ${urlDelProducto}`;
  
  // Codificamos el mensaje para que sea válido en una URL (cambia los espacios por %20, etc.)
  const linkWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeBase)}`;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

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
            
            <div className="space-y-3">
              {/* BOTÓN DE CARRITO (Temporalmente deshabilitado o secundario) */}
              <button className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors shadow-sm">
                Agregar al carrito (Próximamente)
              </button>

              {/* NUEVO BOTÓN DE WHATSAPP */}
              <a 
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                {/* Ícono SVG de WhatsApp para que se vea más pro */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Preguntar por disponibilidad
              </a>
            </div>
            
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