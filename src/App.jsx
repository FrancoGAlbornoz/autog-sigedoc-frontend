import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import SigedocSelection from "./pages/SIGEDOC/SigedocSelection";

// --- IMPORTAMOS LOS COMPONENTES DE ALTA ---
import SigedocAltaOptions from "./pages/SIGEDOC/SigedocAltaOptions";
import SigedocAltaForm from "./pages/SIGEDOC/SigedocAltaForm";

// --- IMPORTAMOS LOS COMPONENTES DE INSTALACIÓN ---
import SigedocInstalacionOptions from "./pages/SIGEDOC/SigedocInstalacionOptions"; // <--- Faltaba importar este
import SigedocInstalacionForm from "./pages/SIGEDOC/SigedocInstalacionForm";

import AdminSigedoc from "./pages/SIGEDOC/admin/AdminSigedoc";

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light pb-5">
        <Header />
        <main>
          <Routes>
            {/* Pantalla 1: Selección de Sistema */}
            <Route path="/" element={<Home />} />

            {/* Pantalla 2: Selección de Trámite (Alta, Baja, Mod, etc) */}
            <Route path="/sigedoc" element={<SigedocSelection />} />

            {/* Panel de Admin Ninja */}
            <Route path="/sigedoc/admin" element={<AdminSigedoc />} />

            {/* --- RUTAS DE ALTA --- */}
            {/* Pantalla intermedia (Generar o Subir) */}
            <Route
              path="/sigedoc/alta/options"
              element={<SigedocAltaOptions />}
            />
            {/* Formulario para cargar datos */}
            <Route
              path="/sigedoc/alta/options/formulario"
              element={<SigedocAltaForm />}
            />

            {/* --- RUTAS DE INSTALACIÓN --- */}
            {/* Pantalla intermedia (Generar o Subir) */}
            <Route
              path="/sigedoc/instalacion/options"
              element={<SigedocInstalacionOptions />}
            />
            {/* Formulario para cargar datos */}
            <Route
              path="/sigedoc/instalacion/options/formulario"
              element={<SigedocInstalacionForm />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
