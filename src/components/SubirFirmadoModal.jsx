import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Send,
  X,
  RefreshCw,
  Hash,
} from "lucide-react";
import api from "../api/axios";

const SubirFirmadoModal = ({ show, handleClose }) => {
  const [archivo, setArchivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // Nuevo estado para que el usuario escriba su número de trámite
  const [tramiteId, setTramiteId] = useState("");
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!tiposPermitidos.includes(file.type)) {
        alert(
          "Formato no válido. Por favor, suba un PDF o una foto (JPG, PNG).",
        );
        e.target.value = null;
        return;
      }
      setArchivo(file);
    }
  };

  const handleConfirmar = async () => {
    // Validamos que haya puesto el ID y el archivo
    if (!archivo || !tramiteId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      // Ya lo cambiamos a "documento" como pedía tu multer!
      formData.append("documento", archivo);

      // Usamos el ID que escribió el usuario
      await api.post(`/tramites/${tramiteId}/subir-firmado`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("¡Documento subido y enviado al correo externo con éxito!");

      // Limpiamos todo y cerramos
      setArchivo(null);
      setTramiteId("");
      handleClose();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      // Si el backend tira un 404 porque puso un número que no existe, le avisamos:
      if (error.response?.status === 404) {
        alert("El número de trámite ingresado no existe. Por favor verifique.");
      } else {
        alert("Hubo un error al procesar y enviar el documento.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const cancelar = () => {
    setArchivo(null);
    setTramiteId("");
    handleClose();
  };

  const esImagen = archivo?.type.startsWith("image/");

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      ></div>

      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">
                <UploadCloud className="me-2" size={20} />
                Subir Documento Firmado
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={cancelar}
                disabled={isUploading}
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* INPUT PARA EL NÚMERO DE TRÁMITE */}
              <div className="mb-4">
                <label className="form-label fw-bold text-secondary d-flex align-items-center">
                  <Hash size={18} className="me-1" /> N° de Trámite
                </label>
                <input
                  type="number"
                  className="form-control form-control-lg text-center fw-bold"
                  placeholder="Ej: 125"
                  value={tramiteId}
                  onChange={(e) => setTramiteId(e.target.value)}
                  disabled={isUploading}
                />
                <div className="form-text text-center">
                  Ingrese el número que se le asignó al generar el formulario.
                </div>
              </div>

              <input
                type="file"
                accept=".pdf, image/jpeg, image/png, image/jpg"
                className="d-none"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {!archivo ? (
                <div
                  className="border border-2 border-dashed border-primary rounded p-5 bg-light text-center transition-all"
                  style={{ cursor: "pointer" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <UploadCloud size={48} className="text-primary mb-2" />
                  <h6 className="fw-bold text-primary">
                    Haga clic aquí para seleccionar el archivo
                  </h6>
                  <small className="text-muted">
                    Se permite formato PDF o foto desde el celular (JPG, PNG)
                  </small>
                </div>
              ) : (
                <div className="bg-light rounded p-4 border border-success text-center">
                  {esImagen ? (
                    <ImageIcon size={40} className="text-success mb-2" />
                  ) : (
                    <FileText size={40} className="text-success mb-2" />
                  )}

                  <h6
                    className="fw-bold text-dark text-truncate px-3"
                    title={archivo.name}
                  >
                    {archivo.name}
                  </h6>
                  <p className="small text-muted mb-3">
                    Tamaño: {(archivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <div className="alert alert-warning text-start d-flex align-items-center p-2 mb-3">
                    <AlertTriangle
                      size={30}
                      className="me-2 text-warning flex-shrink-0"
                    />
                    <small style={{ fontSize: "0.85rem" }}>
                      <strong>Atención:</strong> Al confirmar, este archivo se
                      adjuntará al trámite{" "}
                      <strong>N° {tramiteId || "..."}</strong> y se enviará
                      automáticamente.
                    </small>
                  </div>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    <RefreshCw size={14} className="me-1" /> Cambiar archivo
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer bg-light d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary text-white fw-bold"
                onClick={cancelar}
                disabled={isUploading}
              >
                <X size={18} className="me-1" /> Cancelar
              </button>

              <button
                type="button"
                className="btn btn-success fw-bold px-4"
                onClick={handleConfirmar}
                // Se bloquea si falta el archivo, falta el ID, o está subiendo
                disabled={!archivo || !tramiteId || isUploading}
              >
                {isUploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} className="me-2" /> CONFIRMAR Y ENVIAR
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubirFirmadoModal;
