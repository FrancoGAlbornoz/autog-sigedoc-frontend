import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";
const SigedocAltaForm = () => {
  const navigate = useNavigate();

  // 1. ESTADOS PARA LOS SELECTS
  const [pisos, setPisos] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  // 2. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    id_piso: "",
    id_oficina: "",
    id_sistema: 1, // SIGEDOC
    id_tipo_tramite: 1, // ALTA
    nombre_encargado: "",
    apellido_encargado: "",
    cargo: "",
    telefono: "",
    email: "",
    detalles: [],
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

  // --- LÓGICA DE AGENTES ---
  const agregarAgente = () => {
    if (formData.detalles.length >= 5) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Por seguridad y formato de la nota, solo se pueden cargar hasta 5 agentes por formulario.",
      });
      return;
    }

    setFormData({
      ...formData,
      detalles: [
        ...formData.detalles,
        {
          nombres: "",
          apellido: "",
          cuil: "",
          mail: "",
          telefono: "",
          perfil: "",
          id_oficina: formData.id_oficina,
        },
      ],
    });
  };

  const eliminarAgente = (index) => {
    const nuevosAgentes = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: nuevosAgentes });
  };

  const handleAgenteChange = (index, campo, valor) => {
    const nuevosAgentes = [...formData.detalles];
    nuevosAgentes[index][campo] = valor;
    setFormData({ ...formData, detalles: nuevosAgentes });
  };

  // --- ENVÍO AL BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones con Swal
    if (formData.detalles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Faltan agentes",
        text: "Debe agregar al menos un agente a la lista para generar el formulario.",
      });
      return;
    }

    const cuilRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "El email institucional del Responsable no tiene un formato válido.",
      });
      return;
    }

    for (let i = 0; i < formData.detalles.length; i++) {
      const agente = formData.detalles[i];
      if (!cuilRegex.test(agente.cuil)) {
        Swal.fire({
          icon: "error",
          title: `Error en fila ${i + 1}`,
          text: "El CUIL debe tener exactamente 11 números, sin guiones ni espacios.",
        });
        return;
      }
      if (!emailRegex.test(agente.mail)) {
        Swal.fire({
          icon: "error",
          title: `Error en fila ${i + 1}`,
          text: "El correo no tiene un formato válido.",
        });
        return;
      }
    }

    try {
      console.log("Paso 1: Guardando datos en la BD...");

      const resCrear = await api.post("/tramites", formData);
      const idTramiteGenerado = resCrear.data?.data?.tramite?.id_tramite;

      if (!idTramiteGenerado) {
        throw new Error(
          "El trámite se guardó, pero no pudimos leer el ID de la respuesta.",
        );
      }

      console.log(
        "Paso 2: Descargando DOCX del trámite ID:",
        idTramiteGenerado,
      );

      const resArchivo = await api.get(`/tramites/${idTramiteGenerado}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([resArchivo.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Alta_SIGEDOC_Tramite_${idTramiteGenerado}.docx`,
      );

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // SweetAlert de Éxito HERMOSO
      Swal.fire({
        icon: "success",
        title: "¡Formulario Generado!",
        html: `
          El trámite se guardó y el documento se descargó con éxito.<br/><br/>
          Anote su número de trámite:<br/>
          <span style="font-size: 2rem; font-weight: bold; color: #0d6efd;">#${idTramiteGenerado}</span><br/><br/>
          Lo necesitará más tarde para subir el archivo firmado.
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0d6efd",
        allowOutsideClick: false, // Obliga al usuario a hacer clic en Entendido
      }).then((result) => {
        if (result.isConfirmed) {
          // Recién cuando el usuario lee y da OK, lo mandamos para atrás
          navigate("/sigedoc/alta/options");
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
        onClick={() => navigate("/sigedoc/alta/options")}
        className="btn btn-link text-decoration-none text-muted mb-3 p-0 d-flex align-items-center"
      >
        <ArrowLeft size={18} className="me-1" /> Volver
      </button>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white py-3 text-center">
          <h4 className="m-0 fw-bold">Nueva Solicitud de Alta - SIGEDOC</h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* SECCIÓN 1: UBICACIÓN */}
            <h5 className="text-primary border-bottom pb-2 mb-3 fw-bold">
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
            <h5 className="text-primary border-bottom pb-2 mb-3 fw-bold">
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
                <label className="form-label fw-semibold">Mail</label>
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

            {/* SECCIÓN 3: TABLA DE AGENTES */}
            <h5 className="text-primary border-bottom pb-2 mb-3 fw-bold d-flex justify-content-between align-items-center">
              3. Agentes para Alta de Usuario Nominal
              <button
                type="button"
                className="btn btn-success btn-sm d-flex align-items-center shadow-sm"
                onClick={agregarAgente}
                disabled={formData.detalles.length >= 5}
              >
                <Plus size={16} className="me-1" />
                {formData.detalles.length >= 5
                  ? "Límite alcanzado (Máx 5)"
                  : "Agregar Agente"}
              </button>
            </h5>

            <div className="table-responsive mb-4">
              <table
                className="table table-bordered align-middle shadow-sm"
                style={{ fontSize: "0.9rem" }}
              >
                <thead className="table-light text-center">
                  <tr>
                    <th>Apellido</th>
                    <th>Nombres</th>
                    <th>CUIL</th>
                    <th>Mail</th>
                    <th>Teléfono</th>
                    <th>Perfil</th>
                    <th style={{ width: "40px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.detalles.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No hay agentes agregados.
                      </td>
                    </tr>
                  ) : (
                    formData.detalles.map((agente, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={agente.apellido}
                            onChange={(e) =>
                              handleAgenteChange(
                                index,
                                "apellido",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={agente.nombres}
                            onChange={(e) =>
                              handleAgenteChange(
                                index,
                                "nombres",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center"
                            value={agente.cuil}
                            onChange={(e) => {
                              const soloNumeros = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              handleAgenteChange(index, "cuil", soloNumeros);
                            }}
                            maxLength={11}
                            placeholder="Ej: 20123456789"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            value={agente.mail}
                            onChange={(e) =>
                              handleAgenteChange(index, "mail", e.target.value)
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={agente.telefono}
                            onChange={(e) =>
                              handleAgenteChange(
                                index,
                                "telefono",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={agente.perfil}
                            onChange={(e) =>
                              handleAgenteChange(
                                index,
                                "perfil",
                                e.target.value,
                              )
                            }
                            placeholder="Ej: Admin"
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm border-0"
                            onClick={() => eliminarAgente(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5 shadow-sm fw-bold"
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

export default SigedocAltaForm;
