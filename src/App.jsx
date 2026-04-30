import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import MeusEventos from './pages/MeusEventos';
import Admin from './pages/Admin';
import EventoDetalhes from './pages/EventoDetalhes';
import MinhasReservas from './pages/MinhasReservas';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <main className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            
            <Route path="/meus-eventos" element={<MeusEventos />} />

            <Route path="/admin" element={<Admin />} />
            
            <Route path="/evento/:id" element={<EventoDetalhes />} />

            <Route path="/minhas-reservas" element={<MinhasReservas />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;