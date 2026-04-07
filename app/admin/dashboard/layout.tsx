// app/admin/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react'; // <-- Importamos useEffect y useState

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Agregamos un estado de carga para no mostrar el dashboard mientras verificamos
  const [autorizado, setAutorizado] = useState(false);

  // El "Cadenero" del Frontend: Verifica la sesión al cargar
  useEffect(() => {
    const verificarSesion = async () => { //El async es algo que tenemos que poner si queremos usar await dentro de la funcion
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Si no hay sesión, lo mandamos a volar a la pantalla de login
        router.push("/admin");
      } else {
        // Si sí hay sesión, le damos luz verde para ver el dashboard
        setAutorizado(true);
      }
    };

    verificarSesion();
  }, [router]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // Mientras verifica si tiene permiso, mostramos una pantalla en blanco o un "Cargando..."
  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Si está autorizado, ahora sí le mostramos todo el menú y el contenido
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-extrabold text-black">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/dashboard' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            Inventario
          </Link>
          
          <Link href="/admin/dashboard/nuevo" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/dashboard/nuevo' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}>
            Agregar Joya
          </Link>

          <div className="px-4 py-3 text-gray-400 font-medium text-sm mt-4 border-t border-gray-100 pt-4 cursor-not-allowed">
            Extras (Por definir)
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={cerrarSesion} className="w-full text-left px-4 py-2 font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>

    </div>
  );
}