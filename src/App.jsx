import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import SigedocSelection from "./pages/SIGEDOC/SigedocSelection";

// --- IMPORTAMOS LOS COMPONENTES DE ALTA ---
import SigedocAltaOptions from "./pages/SIGEDOC/SigedocAltaOptions";
import SigedocAltaForm from "./pages/SIGEDOC/SigedocAltaForm";

// --- IMPORTAMOS LOS COMPONENTES DE INSTALACIÓN ---
import SigedocInstalacionOptions from "./pages/SIGEDOC/SigedocInstalacionOptions";
import SigedocInstalacionForm from "./pages/SIGEDOC/SigedocInstalacionForm";

// --- IMPORTAMOS LOS COMPONENTES DE BAJA ---
import SigedocBajaOptions from "./pages/SIGEDOC/SigedocBajaOptions";
import SigedocBajaForm from "./pages/SIGEDOC/SigedocBajaForm";

import AdminSigedoc from "./pages/SIGEDOC/admin/AdminSigedoc";

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light pb-5">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/sigedoc" element={<SigedocSelection />} />
            <Route path="/sigedoc/admin" element={<AdminSigedoc />} />

            {/* --- RUTAS DE ALTA --- */}
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
            <Route
              path="/sigedoc/instalacion/options"
              element={<SigedocInstalacionOptions />}
            />
            {/* Formulario para cargar datos */}
            <Route
              path="/sigedoc/instalacion/options/formulario"
              element={<SigedocInstalacionForm />}
            />

            {/* --- RUTAS DE BAJA --- */}
            <Route
              path="/sigedoc/baja/options"
              element={<SigedocBajaOptions />}
            />
            {/* Formulario para cargar datos */}
            <Route
              path="/sigedoc/baja/options/formulario"
              element={<SigedocBajaForm />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
