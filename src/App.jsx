import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import SigedocSelection from "./pages/SIGEDOC/SigedocSelect";
import SigedocAltaForm from "./pages/SIGEDOC/SigedocAltaForm";
import SigedocAltaOptions from "./pages/SIGEDOC/SigedocAltaOptions";
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

            {/* Pantalla 2: Selección de Trámite (Alta, Baja, Mod) */}
            <Route path="/sigedoc" element={<SigedocSelection />} />
            <Route path="/sigedoc/admin" element={<AdminSigedoc />} />
            {/* Pantalla 3: Formulario de Alta */}
            <Route
              path="/sigedoc/alta/options/formulario"
              element={<SigedocAltaForm />}
            />
            <Route
              path="/sigedoc/alta/options"
              element={<SigedocAltaOptions />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
