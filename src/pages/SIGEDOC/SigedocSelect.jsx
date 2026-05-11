import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import Swal from "sweetalert2";

const SigedocSelection = () => {
  const navigate = useNavigate();

  const opciones = [
    { id: 1, nombre: "ALTA", activo: true },
    { id: 2, nombre: "BAJA", activo: true },
    { id: 3, nombre: "INSTALACION SIGEDOC", activo: true },
    { id: 4, nombre: "MODIFICACION", activo: false },
  ];

  // --- LÓGICA DEL MODAL PARA ADMINS ---
  const handleAccesoAdmin = () => {
    Swal.fire({
      title: "Acceso Restringido",
      text: "Ingrese el token de seguridad",
      input: "password",
      inputPlaceholder: "Token...",
      showCancelButton: true,
      confirmButtonText: "Ingresar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0dcaf0",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) return "El token es obligatorio";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // LEEMOS DESDE EL ARCHIVO .ENV (Sin hardcodear)
        const tokenSecreto = import.meta.env.VITE_ADMIN_TOKEN;

        if (result.value === tokenSecreto) {
          localStorage.setItem("sigedoc_auth", "true");
          Swal.fire({
            icon: "success",
            title: "Acceso concedido",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            navigate("/sigedoc/admin");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "Token incorrecto.",
          });
        }
      }
    });
  };

  return (
    <div className="container text-center mb-5">
      <div className="d-flex justify-content-start mb-4">
        <button
          className="btn btn-link text-decoration-none text-muted d-flex align-items-center"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} className="me-2" /> Volver a Sistemas
        </button>
      </div>

      <h2 className="fw-bold mb-5 text-secondary">SIGEDOC</h2>

      <div className="row justify-content-center g-3 g-md-4 px-2">
        {opciones.map((opcion) => (
          <div key={opcion.id} className="col-12 col-sm-6 col-lg-4">
            <button
              onClick={() =>
                (opcion.activo &&
                  opcion.nombre === "ALTA" &&
                  navigate("/sigedoc/alta/options")) ||
                (opcion.activo &&
                  opcion.nombre === "BAJA" &&
                  navigate("/sigedoc/baja/options")) ||
                (opcion.activo &&
                  opcion.nombre === "INSTALACION SIGEDOC" &&
                  navigate("/sigedoc/instalacion/options"))
              }
              className={`card h-100 w-100 shadow-sm border-2 py-5 transition-all ${
                opcion.activo
                  ? "btn btn-outline-primary bg-white text-dark border-info"
                  : "btn btn-light disabled opacity-75"
              }`}
              style={{
                minHeight: "180px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                opcion.activo &&
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <h3 className="fw-bold m-0 text-uppercase">{opcion.nombre}</h3>
                {!opcion.activo && (
                  <span className="badge bg-secondary mt-2">Próximamente</span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* EL BOTÓN NINJA DE ADMINISTRACIÓN MÁS VISIBLE */}
      <div className="d-flex justify-content-end mt-5 pt-4">
        <button
          onClick={handleAccesoAdmin}
          className="btn btn-link text-muted border-0 p-0"
          style={{ opacity: 0.9, textDecoration: "none" }} // Opacidad subida a 0.4
          title="Gestión Interna"
        >
          <Lock size={18} />
        </button>
      </div>
    </div>
  );
};

export default SigedocSelection;
