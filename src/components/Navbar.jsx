import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Navbar() {
    const { user, perfilUsuario } = useAuth();
    const navigate = useNavigate();
    
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const temaSalvo = localStorage.getItem('theme');
        const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (temaSalvo === 'dark' || (!temaSalvo && prefereEscuro)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const nomeUsuario = user?.user_metadata?.nome || user?.email;

    return (
        <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link to="/" className="text-2xl font-black tracking-tight text-blue-900 dark:text-blue-400 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <span className="text-3xl">🎭</span> 
                    <span className="hidden sm:block">Gestão Cultural</span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                    >
                        {isDark ? (
                            <span className="text-xl">☀️</span>
                        ) : (
                            <span className="text-xl">🌙</span>
                        )}
                    </button>

                    {user ? (
                        <>
                            <Link to="/minhas-reservas" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block">
                                Minhas Reservas
                            </Link>
                            
                            <Link to="/meus-eventos" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block">
                                Meus Eventos
                            </Link>

                            {perfilUsuario === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/50 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95 hidden md:block"
                                >
                                    Admin
                                </Link>
                            )}

                            <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-4 sm:pl-6 ml-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block">
                                    Olá, <strong className="text-gray-800 dark:text-white">{nomeUsuario}</strong>
                                </span>
                                
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm active:scale-95"
                                >
                                    Sair
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white hover:bg-blue-700 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                        >
                            Entrar
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
}