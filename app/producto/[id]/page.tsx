// app/producto/[id]/page.tsx
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BotonesProducto from '../../../components/BotonesProducto'; 

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase.from('joyas').select('*').eq('id', id).single();

  if (!product) return { title: 'Joya no encontrada' };

  return {
    title: `${product.name} | DAFMI Joyería`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
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

  const numeroEmpresa = "523320704632"; 
  const urlDelProducto = `https://catalogo-nexrt-pruebas.vercel.app/producto/${product.id}`; 
  const mensajeBase = `¡Hola! Me interesa preguntar por la disponibilidad de esta pieza:\n\n*${product.name}*\nPrecio: $${product.price.toLocaleString('en-US')} MXN\n\nPuedes verla aquí: ${urlDelProducto}`;
  const linkWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeBase)}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Enlace de regreso sutil y elegante */}
        <Link 
          href="/catalogo" 
          className="inline-flex items-center text-[10px] text-[#d4af37] hover:text-white uppercase tracking-[0.3em] transition-colors mb-10 group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span> 
          Volver al catálogo
        </Link>

        {/* TARJETA ELEVADA ESTILO LUXE */}
        <div className="bg-[#111111] p-8 md:p-12 border border-[#1a1a1a] rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LADO IZQUIERDO: Imagen Única Principal */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl p-2 flex items-center justify-center group overflow-hidden">
            <img 
              src={product.image_url || '/placeholder.jpg'} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* LADO DERECHO: Tu contenido original con el nuevo estilo */}
          <div className="flex flex-col justify-center">
            
            <span className="text-[11px] font-medium tracking-[0.3em] text-[#d4af37] uppercase mb-4 block">
              {product.category}
            </span>
            
            <h1 className="text-4xl lg:text-5xl font-serif font-medium text-white mb-6 leading-tight">
              {product.name}
            </h1>
            
            {/* Pequeño acento dorado */}
            <div className="h-[1px] w-12 bg-[#d4af37] mb-8"></div>
            
            <p className="text-gray-400 font-light leading-relaxed mb-10 text-sm md:text-base">
              {product.description}
            </p>
            
            {/* Recuadro oscuro para resaltar el precio */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl shadow-inner mb-8">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] block mb-2">
                Costo
              </span>
              <span className="text-3xl font-light text-[#d4af37] tracking-wide">
                ${product.price.toLocaleString('en-US')} <span className="text-sm text-gray-500 ml-1">MXN</span>
              </span>
            </div>

            {/* TU COMPONENTE DE CLIENTE */}
            <div className="w-full mb-10">
              <BotonesProducto product={product} linkWhatsApp={linkWhatsApp} />
            </div>

            {/* Tus sellos de confianza originales, ahora con estilo premium */}
            <div className="border-t border-[#1a1a1a] pt-8 flex flex-col gap-4">
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="text-lg text-[#d4af37]">✨</span> Piezas trabajadas a detalle
              </p>
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="text-lg text-[#d4af37]">🤝</span> Asesoría personalizada por WhatsApp
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}