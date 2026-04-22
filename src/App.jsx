import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Evento from './pages/Evento'; 

export default function App() {
  // Estado global que guarda os agendamentos
  const [reservas, setReservas] = useState(() => {
    const saved = localStorage.getItem('reservas_cultura');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva no navegador sempre que algo muda
  useEffect(() => {
    localStorage.setItem('reservas_cultura', JSON.stringify(reservas));
  }, [reservas]);

  return (
    <Router>
      <Routes>
        {/* IMPORTANTE: A Home precisa receber o reservas={reservas} */}
        <Route path="/" element={<Home reservas={reservas} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard reservas={reservas} setReservas={setReservas} />} />
        <Route path="/evento/:id" element={<Evento reservas={reservas} />} />
      </Routes>
    </Router>
  );
}