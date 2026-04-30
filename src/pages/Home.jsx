import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Ticket, Sparkles } from 'lucide-react'; 
import { motion } from 'framer-motion'; 

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [temMais, setTemMais] = useState(true);
  const itensPorPagina = 6;

  useEffect(() => {
    fetchEventos();
  }, [paginaAtual, busca, categoria]);

  const handleFiltroMudou = () => setPaginaAtual(0);

  const fetchEventos = async () => {
    setLoading(true);
    let query = supabase.from('eventos').select('*').eq('status', 'aprovado').order('data', { ascending: true });
    if (busca.trim() !== '') query = query.ilike('titulo', `%${busca}%`);
    if (categoria !== 'Todos') query = query.eq('categoria', categoria);
    const inicio = paginaAtual * itensPorPagina;
    const fim = inicio + itensPorPagina - 1;
    query = query.range(inicio, fim);
    const { data, error } = await query;
    if (!error) {
      setEventos(data);
      setTemMais(data.length === itensPorPagina);
    }
    setLoading(false);
  };

  const categoriasMenu = ['Todos', 'Teatro', 'Música', 'Dança', 'Cinema', 'Exposição'];

  const containerAnimado = {
    oculto: { opacity: 0 },
    visivel: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardAnimado = {
    oculto: { opacity: 0, y: 20 },
    visivel: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] transition-colors duration-300">
      
      <div className="relative pt-16 pb-24 md:pt-24 md:pb-32 text-center overflow-hidden border-b border-gray-200 dark:border-white/5">
        
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}
        ></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 to-purple-600/20 dark:from-cyan-500/10 dark:to-purple-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[0.2em] text-xs mb-6 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10">
            <Sparkles size={14} className="animate-pulse" /> Sistema de Curadoria
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Cultura em <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Movimento
            </span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-12 font-medium">
            Descubra espetáculos e shows de alta performance, aprovados e sincronizados em tempo real.
          </p>

          <div className="w-full max-w-2xl relative group z-20">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-cyan-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar evento..." 
              value={busca}
              onChange={(e) => { setBusca(e.target.value); handleFiltroMudou(); }}
              className="w-full py-5 pl-14 pr-6 rounded-2xl bg-white/70 dark:bg-[#111827]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-lg transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-wrap gap-3 justify-center mb-12 relative z-10 -mt-16 md:-mt-20">
          {categoriasMenu.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategoria(cat); handleFiltroMudou(); }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border backdrop-blur-md ${
                categoria === cat 
                  ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' 
                  : 'bg-white/80 dark:bg-[#111827]/80 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-cyan-500/30 hover:text-cyan-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && eventos.length === 0 ? (
           <div className="text-center py-20 text-cyan-500 animate-pulse">Sincronizando banco de dados...</div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 mb-4 border border-gray-200 dark:border-white/10">
               <Search size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Nenhum evento detectado</h3>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerAnimado}
              initial="oculto"
              animate="visivel"
            >
              {eventos.map(ev => (
                <motion.div key={ev.id} variants={cardAnimado} className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)] transition-all flex flex-col group">
                  <div className="h-56 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    {ev.capa_url ? (
                      <img src={ev.capa_url} alt={ev.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                        <Ticket size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border border-white/10">
                      {ev.categoria}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {ev.titulo}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-3">
                          <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5"><Calendar size={14} className="text-cyan-600 dark:text-cyan-400" /></span>
                          {new Date(ev.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-3">
                          <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5"><MapPin size={14} className="text-cyan-600 dark:text-cyan-400" /></span>
                          <span className="truncate">{ev.espaco}</span>
                        </p>
                      </div>
                    </div>

                    <Link to={`/evento/${ev.id}`} className="w-full bg-gray-900 dark:bg-white/5 hover:bg-cyan-600 dark:hover:bg-cyan-500/20 border border-transparent dark:border-white/10 hover:border-cyan-500/50 text-white dark:text-cyan-300 font-bold text-center py-3 px-5 rounded-xl transition-all">
                      Acessar Terminal de Ingressos
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINAÇÃO */}
            <div className="mt-16 flex justify-center items-center gap-4">
              <button onClick={() => setPaginaAtual(prev => Math.max(0, prev - 1))} disabled={paginaAtual === 0} className="px-5 py-2.5 rounded-xl font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 bg-transparent disabled:opacity-30 hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                &larr; Voltar
              </button>
              <span className="font-bold text-sm text-gray-500 tracking-widest uppercase">Pag {paginaAtual + 1}</span>
              <button onClick={() => setPaginaAtual(prev => prev + 1)} disabled={!temMais} className="px-5 py-2.5 rounded-xl font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 bg-transparent disabled:opacity-30 hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                Avançar &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}