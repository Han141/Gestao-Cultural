import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home({ reservas = [] }) {
  const [filtro, setFiltro] = useState('Todos');

  // Filtramos apenas os eventos que já foram validados por um funcionário
  const eventosAprovados = reservas.filter(r => r.status === 'aprovado');

  // Lógica de filtragem por categoria
  const eventosFiltrados = filtro === 'Todos'
    ? eventosAprovados
    : eventosAprovados.filter(e => {
        // Usa fallback para string vazia caso o evento não tenha descrição
        const busca = (e.espaco + e.titulo + (e.descricao || '')).toLowerCase();
        if (filtro === 'Teatro') return busca.includes('teatro');
        if (filtro === 'Música') return busca.includes('musica') || busca.includes('show') || busca.includes('banda');
        if (filtro === 'Stand Up') return busca.includes('stand up') || busca.includes('comedia');
        if (filtro === 'Arte') return busca.includes('galeria') || busca.includes('arte') || busca.includes('exposição');
        return true;
      });

  // Imagem de fallback
  const getImagemPadrao = (espaco) => {
    if (!espaco) return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
    if (espaco.includes('Teatro')) return 'https://images.unsplash.com/photo-1507676184212-d0330a15233c?auto=format&fit=crop&w=800&q=80';
    if (espaco.includes('Galeria')) return 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Barra de Navegação Principal */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Cultura<span className="text-blue-600">Digital</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">
              Criar Evento
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md text-sm">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gray-900 flex items-center justify-center min-h-[50vh]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80"
            alt="Fundo Cultural"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            Projeto de Extensão II - ADS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            A tecnologia impulsionando a <br/>
            <span className="text-blue-400">cultura local.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            Plataforma desenvolvida para auxiliar artistas, teatros e centros culturais na 
            gestão e divulgação de eventos para a nossa comunidade.
          </p>
        </div>
      </header>

      {/* Menu de Categorias */}
      <div className="bg-white border-b shadow-sm sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex overflow-x-auto gap-4 justify-start md:justify-center scrollbar-hide">
          {['Todos', 'Música', 'Teatro', 'Stand Up', 'Arte'].map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all text-sm ${
                filtro === cat
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listagem de Eventos */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900">Eventos em Destaque</h2>
          <div className="h-1 w-20 bg-blue-600 mt-2"></div>
        </div>

        {eventosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-xl text-gray-400 font-medium">Não foram encontrados eventos aprovados nesta categoria.</p>
            <button onClick={() => setFiltro('Todos')} className="mt-4 text-blue-600 font-bold hover:underline">
              Ver todos os eventos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosFiltrados.map(evento => (
              <Link 
                to={`/evento/${evento.id}`} 
                key={evento.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                {/* Imagem do Evento */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={evento.imagem || getImagemPadrao(evento.espaco)}
                    alt={evento.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Etiqueta de Preço COM PROTEÇÃO (evita o erro toFixed) */}
                  <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-lg font-black text-xs shadow-lg ${
                    !evento.valor || evento.valor === 0 ? 'bg-green-500 text-white' : 'bg-white text-gray-900'
                  }`}>
                    {!evento.valor || evento.valor === 0 ? 'GRATUITO' : `R$ ${Number(evento.valor).toFixed(2).replace('.', ',')}`}
                  </div>
                </div>

                {/* Conteúdo Informativo */}
                <div className="p-6">
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
                    {evento.data ? evento.data.split('-').reverse().join(' / ') : 'Sem data'}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {evento.titulo || 'Evento Cultural'}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {evento.espaco}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Por {evento.responsavel || 'Desconhecido'}</span>
                    <span className="text-blue-600 text-xs font-bold uppercase group-hover:translate-x-1 transition-transform">
                      Ver Bilhetes →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer Profissional */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              Cultura<span className="text-blue-600">Digital</span>
            </span>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Plataforma dedicada à promoção e difusão cultural regional, facilitando o acesso da população 
              às artes e o gerenciamento de espaços públicos.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Links Rápidos</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><Link to="/login" className="hover:text-blue-600">Área do Artista</Link></li>
              <li><Link to="/login" className="hover:text-blue-600">Acesso Administrativo</Link></li>
              <li><Link to="/" className="hover:text-blue-600">Agenda Completa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Projeto de Extensão</h4>
            <p className="text-sm text-gray-500">
              CST em Análise e Desenvolvimento de Sistemas<br/>
              Polo: [Seu Polo]<br/>
              Estudante: Pedro
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>© 2026 Sistema de Gestão Cultural Digital. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}