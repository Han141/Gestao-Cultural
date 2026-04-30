import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CheckCircle, XCircle, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetchEventosPendentes();
  }, []);

  const fetchEventosPendentes = async () => {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .eq('status', 'pendente');
    
    if (data) setEventos(data);
  };

  const atualizarStatus = async (id, status) => {
    const { error } = await supabase.from('eventos').update({ status }).eq('id', id);
    if (!error) {
      toast.success(`Evento ${status} com sucesso!`);
      fetchEventosPendentes();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-cyan-600 rounded-xl text-white">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Painel Administrativo</h1>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="p-4 font-bold text-xs uppercase text-gray-500">Evento</th>
              <th className="p-4 font-bold text-xs uppercase text-gray-500">Produtor</th>
              <th className="p-4 font-bold text-xs uppercase text-gray-500">Status</th>
              <th className="p-4 font-bold text-xs uppercase text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {eventos.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-gray-900 dark:text-white">{ev.titulo}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{ev.responsavel}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                    ev.status === 'aprovado' ? 'text-green-500 bg-green-500/10' : 
                    ev.status === 'pendente' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-500 bg-red-500/10'
                  }`}>
                    {ev.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => atualizarStatus(ev.id, 'aprovado')} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><CheckCircle size={18} /></button>
                  <button onClick={() => atualizarStatus(ev.id, 'rejeitado')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}