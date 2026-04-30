import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion'; // IMPORTANTE: Agora está aqui!
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password: senha 
    });
    
    if (error) {
      toast.error("Falha ao entrar: " + error.message);
    } else {
      toast.success("Bem-vindo de volta!");
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0b1120] transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#111827] p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 mb-4">
            <Sparkles size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Acesse o Terminal</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Entre para gerenciar seus eventos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
            <input 
              type="email" placeholder="seu@email.com" required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-500 transition-all dark:text-white"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
            <input 
              type="password" placeholder="••••••••" required
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-500 transition-all dark:text-white"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Entrar no Sistema"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}