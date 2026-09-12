import React, { useState } from 'react';

interface Props {
  label?: string;
  helpText: string;
}

const QuickHelp: React.FC<Props> = ({ label = 'Ayuda.', helpText }) => {
  const [show, setShow] = useState(false);

  // Funciones para manejar eventos
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const toggle = () => setShow(!show);

  return (
    <div className="mb-2 position-absolute d-inline-block mx-1">
      <div className="d-flex align-items-center">
			{ /*        <label className="form-label mb-0 me-2">{label}</label> */}
        
        {/* El "Botón" de ayuda */}
        <span
          className="badge rounded-pill bg-secondary"
          style={{ cursor: 'pointer', fontSize: '0.7rem' }}
          onClick={toggle}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          ?
        </span>
      </div>

      {/* El Modal Pequeño (Popover Manual) */}
      {show && (
        <div 
          className="card shadow position-absolute" 
          style={{ 
            zIndex: 1050, 
            minWidth: '300px', 
            top: '100%', 
            left: '0',
            marginTop: '5px' ,
				borderLeft: '4px solid #01d099',
				padding: '0px',
          }}
        >
			<div className="card-header" 
				style={{
					marginLeft: '-4px',
					padding: '5px',
					fontSize: '1rem',
					marginBottom: '0px',
				}}>
				{label}
			</div>
          <div className="card-body p-2" style={{ fontSize: '0.85rem' }}>
            {helpText}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickHelp;