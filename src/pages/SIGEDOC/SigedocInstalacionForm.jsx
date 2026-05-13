import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const SigedocInstalacionForm = () => {
  const navigate = useNavigate();

  // 1. ESTADOS PARA LOS SELECTS
  const [pisos, setPisos] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  // 2. ESTADO DEL FORMULARIO (Sin agentes y con tipo_tramite = 3)
  const [formData, setFormData] = useState({
    id_piso: "",
    id_oficina: "",
    id_sistema: 1, // SIGEDOC
    id_tipo_tramite: 3, // <--- ¡CLAVE! 3 = INSTALACIÓN
    nombre_encargado: "",
    apellido_encargado: "",
    cargo: "",
    telefono: "",
    email: "",
    detalles: [], // Lo mandamos vacío porque no hay usuarios nominales acá
  });

  // 3. CARGAR PISOS
  useEffect(() => {
    const cargarPisos = async () => {
      try {
        const res = await api.get("/pisos");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPisos(data);
      } catch (err) {
        console.error("Error cargando pisos:", err);
        setPisos([]);
      }
    };
    cargarPisos();
  }, []);

  // 4. CARGAR OFICINAS
  useEffect(() => {
    const cargarOficinas = async () => {
      if (!formData.id_piso) {
        setOficinas([]);
        return;
      }
      try {
        const res = await api.get(`/oficinas/piso/${formData.id_piso}`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setOficinas(data);
      } catch (err) {
        console.error("Error cargando oficinas:", err);
        setOficinas([]);
      }
    };
    cargarOficinas();
  }, [formData.id_piso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_piso") {
      setFormData({ ...formData, id_piso: value, id_oficina: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- ENVÍO AL BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "El email institucional del Responsable no tiene un formato válido.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Generando documento...",
        text: "Por favor, espere unos segundos.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const resCrear = await api.post("/tramites", formData);
      const idTramiteGenerado = resCrear.data?.data?.tramite?.id_tramite;

      if (!idTramiteGenerado) {
        throw new Error("El trámite se guardó, pero no pudimos leer el ID.");
      }

      const resArchivo = await api.get(`/tramites/${idTramiteGenerado}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([resArchivo.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Instalacion_SIGEDOC_Tramite_${idTramiteGenerado}.docx`,
      );

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "¡Formulario Generado!",
        html: `
          El trámite de instalación se guardó y el documento se descargó con éxito.<br/><br/>
          Anote su número de trámite:<br/>
          <span style="font-size: 2rem; font-weight: bold; color: #0d6efd;">${idTramiteGenerado}</span><br/><br/>
          Lo necesitará más tarde para subir el archivo firmado.
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "var(--app-primary)",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sigedoc/instalacion/options"); // O la ruta a donde quieras volver
        }
      });
    } catch (error) {
      console.error("Error en el proceso:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al procesar el trámite. Revisá la consola para más detalles.",
      });
    }
  };

  return (
    <div className="container mt-4 mb-5 text-start">
      <button
        onClick={() => navigate("/sigedoc/instalacion/options")}
        className="btn btn-link text-decoration-none text-muted mb-3 p-0 d-flex align-items-center"
      >
        <ArrowLeft size={18} className="me-1" /> Volver
      </button>

      <div className="card shadow-sm border-0">
        <div
          className="card-header py-3 text-center"
          style={{ backgroundColor: "var(--app-primary)", color: "white" }}
        >
          <h4 className="m-0 fw-bold">
            Solicitud de Instalación de Certificado - SIGEDOC
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* SECCIÓN 1: UBICACIÓN */}
            <h5
              className="border-bottom pb-2 mb-3 fw-bold"
              style={{ color: "var(--app-primary)" }}
            >
              1. Ubicación de la Oficina
            </h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Piso</label>
                <select
                  className="form-select"
                  name="id_piso"
                  value={formData.id_piso}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un piso...</option>
                  {pisos.map((p, index) => {
                    const idReal = p.id?.id || p.id_piso || index;
                    const nombreReal = p.id?.nombre || p.nombre || "Sin nombre";
                    return (
                      <option key={`piso-${idReal}-${index}`} value={idReal}>
                        {nombreReal}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Oficina de Destino
                </label>
                <select
                  className="form-select"
                  name="id_oficina"
                  value={formData.id_oficina}
                  onChange={handleChange}
                  required
                  disabled={!formData.id_piso}
                >
                  <option value="">Seleccione una oficina...</option>
                  {oficinas.map((o, index) => {
                    const idReal = o.id?.id || o.id_oficina || index;
                    const nombreReal = o.id?.nombre || o.nombre || "Sin nombre";
                    return (
                      <option key={`ofi-${idReal}-${index}`} value={idReal}>
                        {nombreReal}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* SECCIÓN 2: DATOS DEL RESPONSABLE */}
            <h5
              className="border-bottom pb-2 mb-3 fw-bold"
              style={{ color: "var(--app-primary)" }}
            >
              2. Datos de Contacto del Responsable
            </h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre_encargado"
                  value={formData.nombre_encargado}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido_encargado"
                  value={formData.apellido_encargado}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Cargo</label>
                <input
                  type="text"
                  className="form-control"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Mail institucional
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-4">
              <button
                type="submit"
                className="btn btn-lg px-5 shadow-sm fw-bold text-white"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                <Save size={20} className="me-2" /> GUARDAR Y GENERAR DOCX
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigedocInstalacionForm;
