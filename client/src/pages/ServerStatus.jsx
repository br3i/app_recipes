import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../utils/ServerStatus.css';

const ServerStatus = () => {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('http://localhost:4000/status');
        setIsServerDown(false);
      } catch (error) {
        setIsServerDown(true);
      }
    };

    // Verificar estado del servidor cada 10 segundos
    const intervalId = setInterval(checkServerStatus, 10000);

    // Verificar el estado al montar el componente
    checkServerStatus();

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {isServerDown && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Lo sentimos, el servidor ha dejado de funcionar.</h2>
            <p>Estamos trabajando para solucionar el problema. Por favor, vuelva a intentarlo más tarde.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ServerStatus;