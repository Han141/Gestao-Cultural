import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate

export default function Evento({ reservas }) {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook de navegação
  const evento = reservas.find(r => r.id === Number(id));

  if (!evento) return <div className="text-center p-10">Evento não encontrado</div>;

  const isGratuito = evento.valor === 0;

  // NOVA LÓGICA DE COMPRA COM VALIDAÇÃO DE LOGIN
  const comprarIngresso = () => {
    const user = JSON.parse(localStorage.getItem('user_sessao'));
    
    if (!user) {
      alert("Você precisa fazer login ou criar uma conta para retirar seu ingresso!");
      navigate('/login');
      return;
    }

    alert(`Sucesso, ${user.nome}! ${isGratuito ? "Seu ingresso gratuito foi reservado." : "Redirecionando para o pagamento..."}`);
    // Num sistema real, aqui salvaríamos a compra no banco de dados.
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-black text-gray-900">
            CULTURA<span className="text-blue-600">DIGITAL</span>
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">← Voltar para Agenda</Link>
        </div>
      </nav>

      {/* Hero Imagem */}
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden shadow-lg relative bg-gray-900">
          <img 
            src={evento.imagem || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80'} 
            alt={evento.titulo} 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Detalhes do Evento */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{evento.titulo}</h1>
            <div className="flex items-center text-gray-600 gap-6 border-b pb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="font-medium">{evento.data.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="font-medium">{evento.espaco}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o evento</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {evento.descricao || 'Nenhuma descrição fornecida pelo organizador.'}
            </p>
          </div>
          
          <div>
             <p className="text-sm text-gray-500">Organizador: <strong>{evento.responsavel}</strong></p>
          </div>
        </div>

        {/* Lado Direito: Box de Ingressos (Estilo Sympla) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ingressos</h3>
            
            <div className="border rounded-xl p-4 flex justify-between items-center mb-6 bg-gray-50">
              <div>
                <p className="font-bold text-gray-900">Entrada Padrão</p>
                <p className="text-sm text-gray-500">Lote Único</p>
              </div>
              <div className="text-right">
                {isGratuito ? (
                  <span className="text-lg font-black text-green-600 uppercase tracking-wide">Gratuito</span>
                ) : (
                  <span className="text-lg font-black text-gray-900">
                    R$ {evento.valor.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={comprarIngresso}
              className="w-full bg-blue-600 text-white text-lg py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-600/30 active:scale-95 transform"
            >
              {isGratuito ? 'Retirar Ingresso' : 'Comprar Agora'}
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Vendas sujeitas à capacidade do espaço.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}