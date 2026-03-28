"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  
  // Estados para nuestro formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Anillos");
  const [imageUrl, setImageUrl] = useState("");
  
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [guardando, setGuardando] = useState(false);

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // Función para guardar la joya en Supabase
  const agregarJoya = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ texto: "", tipo: "" });

    // Insertamos los datos en la tabla 'joyas'
    const { error } = await supabase.from("joyas").insert([
      {
        name: name,
        description: description,
        price: parseFloat(price), // Convertimos el texto a número
        category: category,
        image_url: imageUrl || "https://placehold.co/800x800/f8fafc/334155?text=Sin+Foto",
      },
    ]);

    if (error) {
      setMensaje({ texto: "Hubo un error al guardar la joya.", tipo: "error" });
    } else {
      setMensaje({ texto: "¡Joya agregada al catálogo con éxito!", tipo: "exito" });
      // Limpiamos el formulario
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Anillos");
      setImageUrl("");
    }
    setGuardando(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Barra superior */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Inventario</h1>
            <p className="text-gray-500 text-sm">Agrega nuevas piezas al catálogo</p>
          </div>
          <button 
            onClick={cerrarSesion}
            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          
          {mensaje.texto && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${mensaje.tipo === "exito" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={agregarJoya} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la pieza</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white placeholder-gray-400" placeholder="Ej. Anillo de Diamante" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
                <input type="number" required min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white placeholder-gray-400" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white">
                  <option value="Anillos">Anillos</option>
                  <option value="Collares">Collares</option>
                  <option value="Pulseras">Pulseras</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none resize-none text-gray-900 bg-white placeholder-gray-400" placeholder="Detalles sobre el material, kilataje, etc." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white placeholder-gray-400" placeholder="https://ejemplo.com/foto.jpg" />
                <p className="text-xs text-gray-500 mt-1">*Por ahora usaremos enlaces de imágenes. Luego implementaremos la subida de archivos.</p>
              </div>

            </div>

            <button type="submit" disabled={guardando} className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors mt-4 disabled:bg-gray-400">
              {guardando ? "Guardando..." : "Agregar al Catálogo"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}