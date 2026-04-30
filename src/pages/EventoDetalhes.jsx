import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EventoDetalhes() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState(0);
  const [jaReservou, setJaReservou] = useState(false);
  const [processando, setProcessando] = useState(false);
  
  const [qtdDesejada, setQtdDesejada] = useState(1);

  useEffect(() => {
    const fetchDadosIniciais = async () => {
      const { data: dataEvento } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single();

      if (dataEvento) {
        setEvento(dataEvento);
        setVagas(dataEvento.capacidade);
      }

      if (user) {
        const { data: dataReserva } = await supabase
          .from('reservas')
          .select('id')
          .eq('evento_id', id)
          .eq('usuario_id', user.id)
          .single();

        if (dataReserva) setJaReservou(true);
      }
      
      setLoading(false);
    };

    fetchDadosIniciais();

    const checarVagasTempoReal = async () => {
      const { data } = await supabase.from('eventos').select('capacidade').eq('id', id).single();
      if (data) {
        setVagas(vagasAtuais => data.capacidade !== vagasAtuais ? data.capacidade : vagasAtuais);
      }
    };

    const intervaloDeAtualizacao = setInterval(checarVagasTempoReal, 5000);
    return () => clearInterval(intervaloDeAtualizacao);
  }, [id, user]);

  const handleReserva = async () => {
    if (!user) {
      toast.error("Você precisa fazer login para comprar!"); 
      navigate('/login');
      return;
    }

    if (qtdDesejada > vagas) {
      toast.error("Desculpe, não há vagas suficientes."); 
      return;
    }

    setProcessando(true);

    const { error: reservaError } = await supabase
      .from('reservas')
      .insert([{ evento_id: id, usuario_id: user.id, quantidade: qtdDesejada }]);

    if (reservaError) {
      toast.error("Erro ao processar: " + reservaError.message); 
      setProcessando(false);
      return;
    }

    const novaCapacidade = vagas - qtdDesejada;
    const { error: eventoError } = await supabase
      .from('eventos')
      .update({ capacidade: novaCapacidade })
      .eq('id', id);

    if (!eventoError) {
      setVagas(novaCapacidade);
      setJaReservou(true);
      
      toast.success(`🎉 ${qtdDesejada} ingresso(s) garantido(s) com sucesso!`, {
        duration: 4000, 
        style: {
          fontWeight: 'bold',
          padding: '16px',
          color: '#166534', 
        },
      });
    }

    setProcessando(false);
  };

  if (loading) return <div className="p-20 text-center text-xl text-gray-500 font-medium">Carregando detalhes do evento...</div>;
  if (!evento) return <div className="p-20 text-center text-xl text-red-500 font-bold">Evento não encontrado!</div>;

  const valorTotal = (evento.preco || 0) * qtdDesejada;

  return (
    <div className="max-w-4xl mx-auto p-6 py-10">
      <Link to="/" className="text-blue-600 hover:text-blue-800 transition mb-6 inline-flex items-center font-medium gap-2">
        &larr; Voltar para a Home
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        <div className="h-64 sm:h-80 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          {evento.capa_url ? (
            <img src={evento.capa_url} alt={evento.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900 text-white opacity-80">
               <span className="text-5xl mb-2">🎭</span>
               <span className="text-xl font-light tracking-widest uppercase">Sem Cartaz Oficial</span>
            </div>
          )}
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-8">
            
            <div className="flex-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {evento.categoria}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-3 leading-tight">
                {evento.titulo}
              </h1>
              
              <div className="flex flex-col gap-2 mt-4 text-gray-700 font-medium">
                <p className="flex items-center gap-2">
                  <span className="text-xl">📅</span> 
                  {new Date(evento.data).toLocaleDateString('pt-BR')} 
                  {evento.hora ? ` às ${evento.hora.slice(0, 5)}` : ''}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">📍</span> {evento.espaco}
                </p>
                <p className="flex items-center gap-2 mt-2 text-green-600 text-xl font-bold">
                  <span className="text-xl">💰</span> 
                  {evento.preco > 0 ? Number(evento.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Gratuito'}
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-80 bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col shadow-inner sticky top-28">
              <p className={`text-sm mb-4 font-bold uppercase tracking-wide text-center ${vagas < 10 && vagas > 0 ? 'text-orange-500' : vagas === 0 ? 'text-red-500' : 'text-green-600'}`}>
                {vagas > 0 ? (vagas < 10 ? `⚠️ Últimas ${vagas} vagas!` : `🎟️ ${vagas} lugares disponíveis`) : '❌ Lotação Máxima'}
              </p>

              {jaReservou ? (
                <button disabled className="w-full bg-gray-200 text-gray-600 font-bold py-4 px-4 rounded-xl cursor-not-allowed border border-gray-300">
                  ✅ Ingresso já Garantido
                </button>
              ) : vagas > 0 ? (
                <>
                  <div className="mb-4 flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-700">Quantidade:</label>
                    <select 
                      value={qtdDesejada} 
                      onChange={(e) => setQtdDesejada(parseInt(e.target.value))}
                      className="border p-3 rounded-lg bg-white w-full font-medium"
                    >
                      {[...Array(Math.min(10, vagas))].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} Ingresso(s)</option>
                      ))}
                    </select>
                  </div>

                  {evento.preco > 0 && (
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-sm text-gray-600 font-medium">Total:</span>
                      <span className="text-xl font-bold text-green-700">
                        {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}

                  <button 
                    onClick={handleReserva} 
                    disabled={processando}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all transform hover:scale-105 disabled:bg-blue-400 disabled:scale-100"
                  >
                    {processando ? 'Processando...' : 'Confirmar Compra'}
                  </button>
                </>
              ) : (
                <button disabled className="w-full bg-red-100 text-red-600 font-bold py-4 px-4 rounded-xl border border-red-200 cursor-not-allowed">
                  Esgotado
                </button>
              )}
            </div>

          </div>

          <hr className="my-8 border-gray-200" />

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Espetáculo</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-lg text-gray-600">
              {evento.descricao || "Nenhuma descrição fornecida pelo organizador."}
            </p>
          </div>

          <div className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl uppercase">
              {evento.responsavel.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Organização e Produção</p>
              <p className="font-medium text-gray-800">{evento.responsavel}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}