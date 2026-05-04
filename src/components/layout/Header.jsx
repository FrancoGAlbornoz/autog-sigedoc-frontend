import React from 'react';

const Header = () => {
  return (
    <header className="py-3 py-md-4 mb-4 mb-md-5 shadow-sm" style={{ backgroundColor: '#99e6ff' }}>
      <div className="container text-center">
        {/* fs-4 en móviles, fs-2 en desktop */}
        <h1 className="fs-4 fs-md-2 fw-bold text-uppercase m-0 text-dark">
          Autogestión Sistemas Externos
        </h1>
      </div>
    </header>
  );
};

export default Header;