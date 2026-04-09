// app/admin/dashboard/estadisticas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

// Definimos cómo se ve un Lead para TypeScript
interface Lead {
  id: string;
  created_at: string;
  resumen_pedido: string;
  total_estimado: number;
  cantidad_piezas: number;
}

export default function EstadisticasPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerLeads() {
      // Traemos los leads ordenados del más nuevo al más viejo
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al traer los leads:", error);
      } else if (data) {
        setLeads(data);
      }
      setCargando(false);
    }

    obtenerLeads();
  }, []);

  // Calculamos algunos datos rápidos para ponerlos hasta arriba
  const totalCotizado = leads.reduce((sum, lead) => sum + lead.total_estimado, 0);
  const totalPiezasCotizadas = leads.reduce((sum, lead) => sum + lead.cantidad_piezas, 0);

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cotizaciones y Leads</h1>
      
      {/* Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total de Leads</p>
          <p className="text-4xl font-extrabold text-black">{leads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Valor Total Cotizado</p>
          <p className="text-4xl font-extrabold text-green-600">${totalCotizado.toLocaleString('en-US')} MXN</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Piezas Solicitadas</p>
          <p className="text-4xl font-extrabold text-indigo-600">{totalPiezasCotizadas}</p>
        </div>
      </div>

      {/* Tabla de Leads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Historial de Solicitudes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Resumen del Pedido</th>
                <th className="p-4 font-semibold text-center">Piezas</th>
                <th className="p-4 font-semibold text-right">Total Estimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => {
                // Formateamos la fecha para que se vea bonita
                const fecha = new Date(lead.created_at);
                const fechaFormateada = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
                const horaFormateada = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{fechaFormateada}</div>
                      <div className="text-xs text-gray-500">{horaFormateada}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {lead.resumen_pedido}
                    </td>
                    <td className="p-4 text-center font-medium text-gray-900">
                      {lead.cantidad_piezas}
                    </td>
                    <td className="p-4 text-right font-bold text-green-600">
                      ${lead.total_estimado.toLocaleString('en-US')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {leads.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              Aún no hay cotizaciones registradas. ¡Pronto llegarán los clientes!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}