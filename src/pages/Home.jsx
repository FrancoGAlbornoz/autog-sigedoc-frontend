import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const sistemas = [
    { id: 'sigedoc', nombre: 'SIGEDOC', activo: true },
    { id: 'safyc', nombre: 'SAFyC', activo: false },
    { id: 'sial', nombre: 'SIAL', activo: false },
  ];

  return (
    <div className="container text-center mb-5">
      <h5 className="mb-4 mb-md-5 text-muted text-uppercase fw-semibold fs-6 fs-md-5 px-2">
        Seleccione el sistema que necesita para empezar un trámite
      </h5>

      {/* g-3 para poco espacio en móvil, g-4 en desktop */}
      <div className="row justify-content-center g-3 g-md-4 px-2">
        {sistemas.map((sistema) => (
          <div key={sistema.id} className="col-12 col-sm-6 col-lg-3">
            <button
              onClick={() => sistema.activo && navigate('/sigedoc')}
              className={`card h-100 w-100 shadow-sm border-2 py-4 py-md-5 transition-all ${
                sistema.activo 
                  ? 'btn btn-outline-primary bg-white text-dark border-info' 
                  : 'btn btn-light disabled opacity-75'
              }`}
              style={{ 
                minHeight: '160px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseOver={(e) => sistema.activo && (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <h3 className="fw-bold fs-4 fs-md-3 m-0">{sistema.nombre}</h3>
                {!sistema.activo && (
                  <span className="badge bg-secondary mt-2 fw-normal">Próximamente</span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;