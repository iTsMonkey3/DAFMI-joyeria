// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Sección Hero (Portada principal) */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gray-900 text-white">
        {/* Aquí después puedes poner una imagen o video de fondo */}
        <div className="absolute inset-0 bg-black/50 z-0"></div> 
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Joyas que Cuentan Historias
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10">
            Tradición, elegancia y diseño exclusivo para tus momentos más inolvidables.
          </p>
          
          {/* Botón que conecta con la nueva ruta de tu catálogo */}
          <Link 
            href="/catalogo" 
            className="inline-block bg-white text-black font-bold text-lg py-4 px-10 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl"
          >
            Ver Colección Completa
          </Link>
        </div>
      </section>

      {/* Sección de Datos Curiosos / Historia */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          <div className="p-6">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Artesanía Pura</h3>
            <p className="text-gray-600">Cada pieza es trabajada con dedicación, asegurando la más alta calidad en metales y piedras preciosas.</p>
          </div>

          <div className="p-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Diseños Únicos</h3>
            <p className="text-gray-600">No seguimos tendencias, las creamos. Encuentra la pieza que resalte tu personalidad.</p>
          </div>

          <div className="p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Atención Personalizada</h3>
            <p className="text-gray-600">Te asesoramos para encontrar la joya perfecta, ya sea para un regalo o para ti mismo.</p>
          </div>

        </div>
      </section>

    </main>
  );
}