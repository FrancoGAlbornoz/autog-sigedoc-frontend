import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Para un botón de volver

const SigedocSelection = () => {
  const navigate = useNavigate();

  const opciones = [
    { id: 1, nombre: 'ALTA', activo: true },
    { id: 2, nombre: 'BAJA', activo: false },
    { id: 3, nombre: 'MODIFICACION', activo: false },
  ];

  return (
    <div className="container text-center mb-5">
      {/* Botón para volver atrás */}
      <div className="d-flex justify-content-start mb-4">
        <button 
          className="btn btn-link text-decoration-none text-muted d-flex align-items-center"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} className="me-2" /> Volver a Sistemas
        </button>
      </div>

      <h2 className="fw-bold mb-5 text-secondary">SIGEDOC</h2>

      <div className="row justify-content-center g-3 g-md-4 px-2">
        {opciones.map((opcion) => (
          <div key={opcion.id} className="col-12 col-sm-6 col-lg-4">
            <button
              onClick={() => opcion.activo && navigate('/sigedoc/alta')}
              className={`card h-100 w-100 shadow-sm border-2 py-5 transition-all ${
                opcion.activo 
                  ? 'btn btn-outline-primary bg-white text-dark border-info' 
                  : 'btn btn-light disabled opacity-75'
              }`}
              style={{ 
                minHeight: '180px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => opcion.activo && (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
    </div>
  );
};

export default SigedocSelection;