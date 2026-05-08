import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  Send,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import api from "../../../api/axios";
import Swal from "sweetalert2";

const AdminSigedoc = () => {
  const navigate = useNavigate();
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. VALIDACIÓN DE SEGURIDAD (MOCK LOGIN)
  useEffect(() => {
    const isAuth = localStorage.getItem("sigedoc_auth");
    if (!isAuth) {
      navigate("/"); // Si no tiene la llave, lo mandamos al inicio
    }
  }, [navigate]);

  // 2. CARGAR TRÁMITES DESDE EL BACKEND
  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const res = await api.get("/tramites");
        // Nos aseguramos de acceder bien al array dependiendo de cómo lo devuelva tu backend
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Opcional: Podés ordenarlos para que los más nuevos salgan arriba
        const tramitesOrdenados = data.sort(
          (a, b) => b.id_tramite - a.id_tramite,
        );

        setTramites(tramitesOrdenados);
      } catch (error) {
        console.error("Error al cargar trámites:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudieron cargar los trámites. Verificá que el backend esté corriendo.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTramites();
  }, []);

  // 3. FUNCIÓN PARA VER/DESCARGAR EL DOCUMENTO FIRMADO
  // 3. FUNCIÓN PARA VER EL DOCUMENTO FIRMADO EN FIREBASE
  const verDocumento = (url_pdf) => {
    // Si la URL es null o vacía, significa que todavía no lo subieron
    if (!url_pdf) {
      Swal.fire({
        icon: "info",
        title: "Falta el documento",
        text: "El responsable todavía no subió el archivo firmado a este trámite.",
      });
      return;
    }

    // Si tiene la URL de Firebase, la abrimos directo en otra pestaña
    window.open(url_pdf, "_blank");
  };

  // 4. FUNCIÓN PARA CERRAR EL MOCK LOGIN
  const cerrarSesion = () => {
    localStorage.removeItem("sigedoc_auth");
    navigate("/");
  };

  // Función auxiliar para pintar los estados con colores lindos
  const renderEstado = (estado) => {
    const estadoNormalizado = estado?.toLowerCase() || "en proceso";

    if (estadoNormalizado === "enviado") {
      return (
        <span className="badge bg-info text-dark w-100 py-2">
          <Send size={14} className="me-1" /> Enviado
        </span>
      );
    }
    if (estadoNormalizado === "completado") {
      return (
        <span className="badge bg-success w-100 py-2">
          <CheckCircle size={14} className="me-1" /> Completado
        </span>
      );
    }
    return (
      <span className="badge bg-warning text-dark w-100 py-2">
        <Clock size={14} className="me-1" /> En proceso
      </span>
    );
  };

  return (
    <div className="container-fluid px-4 py-4 mt-2">
      {/* HEADER DEL PANEL */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-primary m-0 d-flex align-items-center">
          <ShieldAlert size={28} className="me-2 text-danger" />
          Panel de Administración - SIGEDOC
        </h2>
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center fw-bold"
          onClick={cerrarSesion}
        >
          <LogOut size={16} className="me-1" /> Salir del Panel
        </button>
      </div>

      {/* CONTENEDOR DE LA TABLA */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <h5 className="m-0 fw-semibold text-secondary mb-2 mb-md-0">
            Trámites Registrados
          </h5>

          {/* Buscador estético (Por ahora visual, podemos darle lógica después) */}
          <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 bg-light"
              placeholder="Buscar trámite..."
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table table-hover align-middle mb-0"
              style={{ fontSize: "0.95rem" }}
            >
              <thead className="table-light text-center">
                <tr>
                  <th className="py-3">N° Trámite</th>
                  <th>Responsable</th>
                  <th>Cargo</th>
                  <th>Contacto</th>
                  <th style={{ width: "150px" }}>Estado</th>
                  <th style={{ width: "120px" }}>Documento</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : tramites.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-muted">
                      No hay trámites registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  tramites.map((tramite) => (
                    <tr key={tramite.id_tramite || tramite.id}>
                      <td className="fw-bold text-primary fs-5">
                        #{tramite.id_tramite || tramite.id}
                      </td>
                      <td className="text-start fw-semibold">
                        {tramite.apellido_encargado}, {tramite.nombre_encargado}
                      </td>
                      <td>{tramite.cargo}</td>
                      <td className="text-start">
                        <div className="d-flex flex-column">
                          <span className="text-dark">{tramite.email}</span>
                          <small className="text-muted">
                            Tel: {tramite.telefono}
                          </small>
                        </div>
                      </td>
                      <td>{renderEstado(tramite.estado)}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm shadow-sm"
                          onClick={() => verDocumento(tramite.url_pdf)}
                          title="Ver Documento Firmado"
                        >
                          <Eye size={18} /> Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSigedoc;
