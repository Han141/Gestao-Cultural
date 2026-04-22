import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORTANTE: Importar o supabase

const ESPACOS = ['Teatro Municipal', 'Sala de Ensaio 01', 'Galeria de Arte'];

export default function Dashboard({ reservas, buscarEventos }) { // Recebe o buscarEventos aqui
    const navigate = useNavigate();
    const [form, setForm] = useState({ data: '', espaco: ESPACOS[0], titulo: '', descricao: '', imagem: '', valor: 0 });

    const user = JSON.parse(localStorage.getItem('user_sessao'));
    if (!user) {
        navigate('/login');
        return null;
    }

    // 1. SALVAR NOVO EVENTO NO BANCO DE DADOS
    const solicitarReserva = async (e) => {
        e.preventDefault();
        if (!form.titulo || !form.data) return alert("Preencha título e data.");

        const novoEvento = {
            titulo: form.titulo,
            data: form.data,
            espaco: form.espaco,
            descricao: form.descricao,
            imagem: form.imagem,
            valor: form.valor,
            responsavel: user.nome,
            perfilResponsavel: user.perfil,
            status: 'pendente'
        };

        // Insere no Supabase
        const { error } = await supabase.from('eventos').insert([novoEvento]);

        if (error) {
            alert("Erro ao salvar: " + error.message);
        } else {
            alert("Solicitação enviada para a nuvem!");
            setForm({ data: '', espaco: ESPACOS[0], titulo: '', descricao: '', imagem: '', valor: 0 });
            buscarEventos(); // Atualiza a lista na tela
        }
    };

    // 2. ATUALIZAR STATUS PARA 'APROVADO' NO BANCO DE DADOS
    const aprovarReserva = async (id) => {
        const { error } = await supabase
            .from('eventos')
            .update({ status: 'aprovado' })
            .eq('id', id);

        if (error) {
            alert("Erro ao aprovar: " + error.message);
        } else {
            buscarEventos(); // Atualiza a tela
        }
    };

    const fazerLogout = () => {
        localStorage.removeItem('user_sessao');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Cabeçalho do Painel */}
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-blue-900">Meu Painel</h2>
                        <p className="text-xs text-gray-500">Logado como: <strong>{user.nome}</strong> ({user.perfil})</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link to="/" className="text-blue-600 font-bold text-sm hover:underline">Ver Site</Link>
                        <button onClick={fazerLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100">Sair</button>
                    </div>
                </header>

                {/* VISÃO DO ESPECTADOR (PÚBLICO) */}
                {user.perfil === 'espectador' && (
                    <div className="bg-white p-10 rounded-lg shadow-sm text-center border-t-4 border-blue-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Meus Ingressos</h3>
                        <p className="text-gray-500 mb-6">Aqui ficarão os ingressos que você adquirir para os eventos culturais da cidade.</p>
                        <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl max-w-md mx-auto">
                            <p className="text-sm text-gray-400">Você ainda não possui ingressos ativos.</p>
                            <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Explorar Eventos</Link>
                        </div>
                    </div>
                )}

                {/* VISÃO DO ARTISTA OU FUNCIONÁRIO */}
                {user.perfil !== 'espectador' && (
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* FORMULÁRIO (Apenas Artistas vêem) */}
                        {user.perfil === 'artista' && (
                            <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit border border-gray-100">
                                <h3 className="font-bold mb-4 border-b pb-2 text-gray-800">Cadastrar Novo Evento</h3>
                                <form onSubmit={solicitarReserva} className="space-y-4">

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">NOME DO EVENTO</label>
                                        <input type="text" required placeholder="Ex: Peça de Teatro" className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">LINK DA IMAGEM DO CARTAZ</label>
                                        <input type="url" placeholder="https://link-da-foto.com/img.jpg" className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white text-sm" value={form.imagem} onChange={e => setForm({ ...form, imagem: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">DATA</label>
                                            <input type="date" required className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">VALOR (R$)</label>
                                            <input type="number" min="0" step="0.01" className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white" value={form.valor} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">ESPAÇO CULTURAL</label>
                                        <select className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white" value={form.espaco} onChange={e => setForm({ ...form, espaco: e.target.value })}>
                                            {ESPACOS.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIÇÃO DO EVENTO</label>
                                        <textarea rows="3" required className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:bg-white" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}></textarea>
                                    </div>

                                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-colors">
                                        Enviar para Análise
                                    </button>
                                </form>
                            </section>
                        )}

                        {/* LISTAGEM DE EVENTOS (Funcionário vê todos, Artista vê os seus) */}
                        <section className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${user.perfil === 'funcionario' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                            <h3 className="font-bold mb-4 border-b pb-2 text-gray-800">
                                {user.perfil === 'funcionario' ? 'Aprovação de Eventos Pendentes' : 'Meus Eventos Solicitados'}
                            </h3>
                            <div className="space-y-4">
                                {reservas.length === 0 && <p className="text-gray-400">Nenhuma solicitação encontrada.</p>}

                                {reservas.map(r => {
                                    // O artista só deve ver os eventos que ele mesmo criou
                                    if (user.perfil === 'artista' && r.responsavel !== user.nome) return null;

                                    return (
                                        <div key={r.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 gap-4">
                                            <div className="flex-1 w-full flex items-center gap-4">
                                                {/* Exibe miniatura se houver imagem */}
                                                {r.imagem ? (
                                                    <img src={r.imagem} alt="Capa" className="w-12 h-12 object-cover rounded shadow-sm" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400 text-center">Sem Foto</div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${r.status === 'aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {r.status}
                                                        </span>
                                                        <strong className="text-gray-900">{r.titulo}</strong>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {r.espaco} • {r.data.split('-').reverse().join('/')} • Por: {r.responsavel}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botão de aprovação apenas para o funcionário */}
                                            {user.perfil === 'funcionario' && r.status === 'pendente' && (
                                                <button onClick={() => aprovarReserva(r.id)} className="bg-green-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-green-600 font-bold w-full sm:w-auto shadow-md transition-colors">
                                                    Aprovar
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                    </div>
                )}
            </div>
        </div>
    );
}