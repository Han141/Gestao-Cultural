import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Importamos a nossa conexão
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Evento from './pages/Evento'; 

export default function App() {
  const [reservas, setReservas] = useState([]);

  // Função que vai na nuvem buscar os eventos
  const buscarEventos = async () => {
    const { data, error } = await supabase.from('eventos').select('*').order('created_at', { ascending: false });
    if (data) {
      setReservas(data);
    }
    if (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  // Executa a busca assim que o site carrega
  useEffect(() => {
    buscarEventos();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home reservas={reservas} />} />
        <Route path="/login" element={<Login />} />
        {/* Passamos o buscarEventos para o Dashboard poder atualizar a lista após criar algo */}
        <Route path="/dashboard" element={<Dashboard reservas={reservas} buscarEventos={buscarEventos} />} />
        <Route path="/evento/:id" element={<Evento reservas={reservas} />} />
      </Routes>
    </Router>
  );
}