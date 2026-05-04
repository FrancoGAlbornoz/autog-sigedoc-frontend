import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import SigedocSelection from './pages/SIGEDOC/SigedocSelect';
import SigedocAltaForm from './pages/SIGEDOC/SigedocAltaForm';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light pb-5">
        <Header />
        <main>
          <Routes>
            {/* Pantalla 1: Selección de Sistema */}
            <Route path="/" element={<Home />} />
            
            {/* Pantalla 2: Selección de Trámite (Alta, Baja, Mod) */}
            <Route path="/sigedoc" element={<SigedocSelection />} />
            
            {/* Pantalla 3: Formulario de Alta */}
            <Route path="/sigedoc/alta" element={<SigedocAltaForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;