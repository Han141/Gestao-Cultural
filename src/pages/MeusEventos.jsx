import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle, Clock, XCircle, MoreVertical, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  const { user } = useAuth();

  const [novoEvento, setNovoEvento] = useState({
    titulo: '', categoria: 'Teatro', data: '', hora: '', espaco: '', capacidade: '', preco: '', descricao: '', capa_url: ''
  });
  
  const [imagemArquivo, setImagemArquivo] = useState(null);

  useEffect(() => {
    if (user) fetchMeusEventos();
  }, [user]);

  const fetchMeusEventos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('eventos').select('*').eq('responsavel_id', user.id);
    if (!error) setEventos(data);
    setLoading(false);
  };

  const handleChange = (e) => setNovoEvento({ ...novoEvento, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagemArquivo(e.target.files[0]);
    }
  };

  const handleExcluirEvento = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este espetáculo?")) {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) {
        toast.error("Erro ao excluir: " + error.message);
      } else {
        toast.success("Espetáculo removido!");
        fetchMeusEventos();
      }
    }
  };

  const handleCriarEvento = async () => {
    if (!novoEvento.titulo || !novoEvento.data || !novoEvento.espaco || !novoEvento.capacidade) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    let capaUrlFinal = novoEvento.capa_url;

    if (imagemArquivo) {
      const fileExt = imagemArquivo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('capas-eventos') 
        .upload(fileName, imagemArquivo);

      if (uploadError) {
        toast.error("Erro ao fazer upload: " + uploadError.message);
        setSalvando(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('capas-eventos')
        .getPublicUrl(fileName);

      capaUrlFinal = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('eventos').insert([{
      titulo: novoEvento.titulo,
      categoria: novoEvento.categoria,
      data: novoEvento.data,
      hora: novoEvento.hora,
      espaco: novoEvento.espaco,
      capacidade: parseInt(novoEvento.capacidade),
      preco: parseFloat(novoEvento.preco) || 0,
      descricao: novoEvento.descricao,
      capa_url: capaUrlFinal,
      responsavel_id: user.id,
      responsavel: user.user_metadata?.nome || user.email,
      status: 'pendente'
    }]);

    if (error) {
      toast.error("Erro ao criar evento: " + error.message);
    } else {
      toast.success("Espetáculo criado!");
      setIsModalOpen(false);
      fetchMeusEventos();
      setNovoEvento({ titulo: '', categoria: 'Teatro', data: '', hora: '', espaco: '', capacidade: '', preco: '', descricao: '', capa_url: '' });
      setImagemArquivo(null);
    }
    setSalvando(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Meus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Eventos</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Gerencie suas produções.</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] transition-all active:scale-95">
          <Plus size={20} /> Novo Espetáculo
        </button>
      </header>

      {loading ? (
        <div className="py-20 text-center text-cyan-500 animate-pulse font-bold tracking-widest uppercase text-sm">Carregando...</div>
      ) : eventos.length === 0 ? (
         <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 font-medium">Você ainda não criou nenhum evento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((ev, index) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={ev.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-cyan-500/50 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${ev.status === 'aprovado' ? 'bg-green-500/10 text-green-500' : ev.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                  {ev.status === 'aprovado' ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
                {/* BOTÃO DE EXCLUIR */}
                <button onClick={() => handleExcluirEvento(ev.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{ev.titulo}</h3>
              
              <div className="flex flex-col gap-3 mb-6 flex-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Status</span>
                  <span className={ev.status === 'aprovado' ? 'text-green-500' : 'text-yellow-500'}>{ev.status}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${ev.status === 'aprovado' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: ev.status === 'aprovado' ? '100%' : '50%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Cap.</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{ev.capacidade}</p>
                </div>
                <div className="text-center border-l border-gray-100 dark:border-white/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Preço</p>
                  <p className="text-lg font-black text-cyan-600 dark:text-cyan-400">{ev.preco > 0 ? `R$${ev.preco}` : 'Grátis'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Criar Novo Espetáculo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"><XCircle size={24} /></button>
            </div>

            <div className="p-6 text-gray-600 dark:text-gray-400 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500 dark:text-gray-400">Cartaz Oficial</label>
                  <div className="relative flex justify-center w-full px-6 py-8 border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 hover:border-cyan-500">
                    <input type="file" className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                    <span className="flex flex-col items-center">
                        <UploadCloud size={32} className="mb-2 text-cyan-500" />
                        <span className="font-bold">{imagemArquivo ? imagemArquivo.name : "Selecione a imagem"}</span>
                    </span>
                  </div>
                  <input type="text" name="capa_url" value={novoEvento.capa_url} onChange={handleChange} className="mt-2 w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white" placeholder="Ou cole a URL da imagem" />
                </div>
                
                <input type="text" name="titulo" value={novoEvento.titulo} onChange={handleChange} className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3" placeholder="Título do Evento *" />
                <select name="categoria" value={novoEvento.categoria} onChange={handleChange} className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3">
                  <option value="Teatro">Teatro</option>
                  <option value="Música">Música</option>
                  <option value="Dança">Dança</option>
                </select>
                <input type="date" name="data" value={novoEvento.data} onChange={handleChange} className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3" />
                <input type="number" name="capacidade" value={novoEvento.capacidade} onChange={handleChange} className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3" placeholder="Capacidade *" />
                <textarea name="descricao" value={novoEvento.descricao} onChange={handleChange} className="md:col-span-2 w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-3" placeholder="Descrição"></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3 bg-gray-50 dark:bg-white/5">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-500" disabled={salvando}>Cancelar</button>
              <button onClick={handleCriarEvento} disabled={salvando} className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md">{salvando ? 'Enviando...' : 'Criar Espetáculo'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}