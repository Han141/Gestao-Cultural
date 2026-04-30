import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react'; // Biblioteca do QR Code

export default function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchReservas();
  }, [user]);

  const fetchReservas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        id,
        quantidade,
        eventos (
          id,
          titulo,
          data,
          espaco,
          capa_url
        )
      `)
      .eq('usuario_id', user.id);

    if (!error) setReservas(data);
    setLoading(false);
  };

  const cancelarReserva = async (reservaId, eventoId, qtd) => {
    const { error: deleteError } = await supabase.from('reservas').delete().eq('id', reservaId);
    
    if (!deleteError) {
      const { data: ev } = await supabase.from('eventos').select('capacidade').eq('id', eventoId).single();
      await supabase.from('eventos').update({ capacidade: ev.capacidade + qtd }).eq('id', eventoId);
      
      setReservas(reservas.filter(r => r.id !== reservaId));
      toast.success("Reserva cancelada com sucesso");
    } else {
      toast.error("Erro ao cancelar reserva.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm mb-4 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para o Início
        </Link>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Meus <span className="text-cyan-500">Ingressos</span>
        </h1>
      </header>

      {loading ? (
        <div className="flex justify-center py-20 text-cyan-500 animate-pulse font-bold tracking-widest uppercase text-sm">
          Carregando Terminal...
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <Ticket size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 font-medium">Você ainda não possui ingressos garantidos.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservas.map((res, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={res.id} 
              className="group relative bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row hover:border-cyan-500/50 transition-all shadow-sm"
            >
              <div className="w-full md:w-48 h-32 md:h-auto bg-gray-100 dark:bg-gray-800">
                {res.eventos?.capa_url ? (
                  <img src={res.eventos.capa_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><Ticket size={32} /></div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{res.eventos?.titulo}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} className="text-cyan-500" /> {res.eventos?.data ? new Date(res.eventos.data).toLocaleDateString('pt-BR') : 'Data não definida'}</span>
                    <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-cyan-500" /> {res.eventos?.espaco}</span>
                    <span className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs uppercase">{res.quantidade} Ingresso(s)</span>
                  </div>
                </div>

                <button 
                  onClick={() => cancelarReserva(res.id, res.eventos?.id, res.quantidade)}
                  className="mt-4 md:mt-0 self-start flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500/20 px-4 py-2 rounded-lg border border-transparent hover:border-red-500/50 transition-all font-bold text-xs uppercase tracking-wider"
                >
                  <Trash2 size={14} /> Cancelar Reserva
                </button>
              </div>

              {/* DETALHE: Linha tracejada do canhoto */}
              <div className="hidden md:block absolute right-[180px] top-0 bottom-0 w-px border-r-2 border-dashed border-gray-200 dark:border-white/10"></div>

              {/* BLOCO DO QR CODE (O Canhoto) */}
              <div className="hidden md:flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-white/5 min-w-[180px]">
                <div className="bg-white p-2 rounded-xl shadow-md mb-3 border border-gray-200">
                  {/* O ID da reserva vira o QR Code para ser bipado na portaria */}
                  <QRCodeSVG value={res.id} size={90} />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Passe Digital<br/>#{res.id.slice(0,6)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}