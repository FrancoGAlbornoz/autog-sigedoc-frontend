import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FilePlus, FileUp } from "lucide-react";
import SubirFirmadoModal from "../../components/SubirFirmadoModal";

const SigedocBajaOptions = () => {
  const navigate = useNavigate();

  // Estado para controlar si el modal se ve o no
  const [showModal, setShowModal] = useState(false);

  const opciones = [
    {
      id: "generar",
      nombre: "GENERAR FORMULARIO",
      // Volvemos al primary para que el hover funcione perfecto
      icono: <FilePlus size={40} className="mb-3 text-primary" />,
      activo: true,
      accion: () => navigate("/sigedoc/baja/options/formulario"),
    },
    {
      id: "subir",
      nombre: "SUBIR Y ENVIAR FORMULARIO",
      // Volvemos al success
      icono: <FileUp size={40} className="mb-3 text-success" />,
      activo: true,
      accion: () => setShowModal(true),
    },
  ];

  return (
    <div className="container text-center mb-5">
      <div className="d-flex justify-content-start mb-4">
        <button
          className="btn btn-link text-decoration-none text-muted d-flex align-items-center"
          onClick={() => navigate("/sigedoc")}
        >
          <ArrowLeft size={20} className="me-2" /> Volver
        </button>
      </div>

      <h2 className="fw-bold mb-5 text-secondary text-uppercase">
        Sigedoc - Baja de Usuarios
      </h2>

      <div className="row justify-content-center g-4 px-2">
        {opciones.map((opcion) => (
          <div key={opcion.id} className="col-12 col-md-5 col-lg-4">
            <button
              onClick={() => opcion.activo && opcion.accion()}
              className={`card h-100 w-100 shadow-sm border-2 py-5 transition-all ${
                opcion.activo
                  ? "btn btn-outline-primary bg-white text-dark border-info" // Estilos idénticos al de instalación
                  : "btn btn-light disabled opacity-75"
              }`}
              style={{ minHeight: "220px", borderRadius: "15px" }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                {opcion.icono}
                <h4 className="fw-bold m-0">{opcion.nombre}</h4>
                {!opcion.activo && (
                  <span className="badge bg-secondary mt-3">Próximamente</span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* MODAL PARA SUBIR EL ARCHIVO */}
      <SubirFirmadoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        tramiteId={1}
        onSuccess={() => {
          console.log("Archivo de baja subido joya");
        }}
      />
    </div>
  );
};

export default SigedocBajaOptions;
