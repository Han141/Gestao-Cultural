import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'espectador' // Padrão agora é o público comum
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Backdoor para o Professor/Funcionário
    if (!isRegistering && formData.email === 'admin@cultura.com') {
      localStorage.setItem('user_sessao', JSON.stringify({ 
        nome: 'Gestão Cultural', email: formData.email, perfil: 'funcionario' 
      }));
      navigate('/dashboard');
      return;
    }

    // Login/Cadastro Normal
    if (formData.email.length > 3) {
      const usuarioLogado = {
        nome: formData.nome || 'Usuário',
        email: formData.email,
        perfil: isRegistering ? formData.perfil : 'espectador' // Salva o perfil escolhido
      };
      
      localStorage.setItem('user_sessao', JSON.stringify(usuarioLogado));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100 relative">
        
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {isRegistering ? 'Criar Conta' : 'Acesso ao Sistema'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {isRegistering ? 'Junte-se à nossa comunidade cultural.' : 'Faça login para continuar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                <input type="text" name="nome" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg" value={formData.nome} onChange={handleChange} />
              </div>
              
              {/* Seleção do Tipo de Conta */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">O que você deseja fazer?</label>
                <select name="perfil" className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-blue-500" value={formData.perfil} onChange={handleChange}>
                  <option value="espectador">Quero comprar ingressos (Público)</option>
                  <option value="artista">Quero divulgar meus eventos (Artista)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input type="email" name="email" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input type="password" name="senha" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg" value={formData.senha} onChange={handleChange} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700">
            {isRegistering ? 'Criar Minha Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 font-bold hover:underline">
            {isRegistering ? 'Já tenho uma conta. Fazer login' : 'Criar uma conta gratuita'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button onClick={() => navigate('/')} className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase">
            ← Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}