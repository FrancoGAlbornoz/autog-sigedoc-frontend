import { useState, useRef } from "react";
import api from "../api/axios";

const SubirFirmadoModal = ({ show, handleClose, tramiteId, onSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if(file){
      const tiposPermitidos = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
  
      if(!tiposPermitidos.includes(file.type)){
        alert("Tipo de archivo no permitido");
        e.target.value=null
        return
      }
      setArchivo(file)
    }
  };

  const handleConfirmar = async () => {
    if(!archivo) return alert("Debe seleccionar un archivo")

    setIsUploading(true)

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("tramiteId", tramiteId);

    try{
      await api.post("/tramites/subirFirmado", formData, {
        headers: {    
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess()
      alert("Archivo subido correctamente")
    }catch(error){
      console.error("Error al subir archivo:", error)
      alert("Error al subir archivo"
    }finally{
      setIsUploading(false)
      setArchivo(null)
      handleClose()
    }
  }


  return (
    <div>
      <h1>Subir Firmado Modal</h1>
    </div>
  );
};

export default SubirFirmadoModal;
