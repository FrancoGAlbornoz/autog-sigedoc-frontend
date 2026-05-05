import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FilePlus, FileUp } from 'lucide-react';

const SigedocAltaOptions = () => {
  const navigate = useNavigate();

  const opciones = [
    { 
      id: 'generar', 
      nombre: 'GENERAR FORMULARIO', 
      icono: <FilePlus size={40} className="mb-3 text-primary" />,
      activo: true 
    },
    { 
      id: 'subir', 
      nombre: 'SUBIR Y ENVIAR FORMULARIO', 
      icono: <FileUp size={40} className="mb-3 text-secondary" />,
      activo: false 
    },
  ];

  return (
    <div className="container text-center mb-5">
      <div className="d-flex justify-content-start mb-4">
        <button 
          className="btn btn-link text-decoration-none text-muted d-flex align-items-center"
          onClick={() => navigate('/sigedoc')}
        >
          <ArrowLeft size={20} className="me-2" /> Volver
        </button>
      </div>

      <h2 className="fw-bold mb-5 text-secondary text-uppercase">Sigedoc - Alta</h2>

      <div className="row justify-content-center g-4 px-2">
        {opciones.map((opcion) => (
          <div key={opcion.id} className="col-12 col-md-5 col-lg-4">
            <button
              onClick={() => opcion.activo && navigate('/sigedoc/alta/options/formulario')}
              className={`card h-100 w-100 shadow-sm border-2 py-5 transition-all ${
                opcion.activo 
                  ? 'btn btn-outline-primary bg-white text-dark border-info' 
                  : 'btn btn-light disabled opacity-75'
              }`}
              style={{ minHeight: '220px', borderRadius: '15px' }}
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
    </div>
  );
};

export default SigedocAltaOptions;