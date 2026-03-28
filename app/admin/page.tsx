// app/admin/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue al enviar el formulario
    setCargando(true);
    setError("");

    // Intentamos iniciar sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
      setCargando(false);
    } else {
      // Si todo sale bien, lo mandamos al panel de control (que crearemos después)
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Acceso Privado</h1>
          <p className="text-sm text-gray-500 mt-2">Panel de administración de inventario</p>
        </div>

        {/* Mostramos el error en rojo si se equivoca de contraseña */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={iniciarSesion} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-blue-700 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              placeholder="admin@joyeria.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-blue-700 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {cargando ? "Verificando..." : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </main>
  );
}