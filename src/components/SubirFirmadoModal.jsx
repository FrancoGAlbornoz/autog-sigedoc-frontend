import { useState, useRef } from "react";
import api from "../api/axios";

const SubirFirmadoModal = ({ show, handleClose, tramiteId, onSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const tiposPermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Por favor, seleccione un archivo PDF");
        setArchivo(null);
      }

      const sizeMB = file.size / (1024 * 1024);

      if (sizeMB > 10) {
        alert("El archivo no puede superar los 10MB");
        setArchivo(null);
        return;
      }
    }
  };

  return (
    <div>
      <h1>Subir Firmado Modal</h1>
    </div>
  );
};

export default SubirFirmadoModal;
