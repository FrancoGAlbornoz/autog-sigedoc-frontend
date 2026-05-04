import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../api/axios";

const SigedocAltaForm = () => {
  const navigate = useNavigate();

  // 1. ESTADOS PARA LOS SELECTS
  const [pisos, setPisos] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  // 2. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    id_piso: "",
    id_oficina: "",
    id_sistema: 1,
    id_tipo_tramite: 1,
    nombre_encargado: "",
    apellido_encargado: "",
    cargo: "",
    telefono: "",
    email: "",
    detalles: [],
  });

  // 3. CARGAR PISOS AL INICIAR
  useEffect(() => {
    const cargarPisos = async () => {
      try {
        const res = await api.get("/pisos");
        // Blindaje: nos aseguramos de que siempre sea un array
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPisos(data);
      } catch (err) {
        console.error("Error cargando pisos:", err);
        setPisos([]);
      }
    };
    cargarPisos();
  }, []);

  // 4. CARGAR OFICINAS CUANDO CAMBIE EL PISO
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

    // Si cambia el piso, reseteamos la oficina seleccionada
    if (name === "id_piso") {
      setFormData({
        ...formData,
        id_piso: value,
        id_oficina: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  console.log("Revisando pisos:", pisos);
  console.log("Revisando Oficinas:", oficinas);
  return (
    <div className="container mt-4 mb-5">
      <button
        onClick={() => navigate("/sigedoc")}
        className="btn btn-link text-decoration-none text-muted mb-3 p-0"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white py-3">
          <h4 className="m-0 fw-bold">Nueva Solicitud de Alta - SIGEDOC</h4>
        </div>

        <div className="card-body p-4">
          <h5 className="text-primary border-bottom pb-2 mb-3">
            Ubicación de la Oficina
          </h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Piso</label>
              <select
                className="form-select"
                name="id_piso"
                value={formData.id_piso}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un piso...</option>
                {pisos.map((p, index) => {
                  // Según tu consola, los datos están dentro de p.id
                  const valIdPiso =
                    p.id_piso || (p.id && p.id.id_piso) || index;
                  const textoPiso =
                    p.nombre || (p.id && p.id.nombre) || "Sin nombre";

                  return (
                    <option key={`piso-${valIdPiso}`} value={valIdPiso}>
                      {textoPiso}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Oficina</label>
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
                  // Si o.id_oficina no existe, usamos el index para que React no chille
                  const valIdOfi =
                    o.id_oficina || (o.id && o.id.id_oficina) || index;
                  const textoOfi =
                    o.nombre || (o.id && o.id.nombre) || "Oficina sin nombre";

                  return (
                    <option key={`ofi-${valIdOfi}-${index}`} value={valIdOfi}>
                      {textoOfi}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <h5 className="text-primary border-bottom pb-2 mb-3">
            Datos del Responsable / Encargado
          </h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="nombre_encargado"
                value={formData.nombre_encargado}
                onChange={handleChange}
                placeholder="Ej: Juan"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                name="apellido_encargado"
                value={formData.apellido_encargado}
                onChange={handleChange}
                placeholder="Ej: Pérez"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Cargo</label>
              <input
                type="text"
                className="form-control"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Ej: Jefe de Despacho"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Teléfono de contacto</label>
              <input
                type="text"
                className="form-control"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="381..."
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email Institucional</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre@tucuman.gov.ar"
              />
            </div>
          </div>

          <div className="alert alert-secondary text-center">
            Próximo paso: Agregar tabla dinámica de agentes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigedocAltaForm;
