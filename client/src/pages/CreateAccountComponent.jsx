import React, { useState } from 'react';
import axios from 'axios';
import '../utils/create-account.css'; // Asegúrate de tener un archivo de estilos para este formulario

const API_URL = 'http://localhost:4000/usuarios';

const CreateAccountComponent = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [informacionContacto, setInformacionContacto] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        nombre,
        email,
        contrasena,
        tipo_usuario: 'cliente', // Valor estático
        informacion_contacto: informacionContacto
      };
      const response = await axios.post(API_URL, payload);
      setSuccessMessage('Cuenta creada exitosamente.');
      setError('');
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      setError('Error al crear cuenta. Por favor, intenta de nuevo.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="create-account-container">
      <h1>Crear Cuenta</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Información de Contacto</label>
          <input
            type="text"
            value={informacionContacto}
            onChange={(e) => setInformacionContacto(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default CreateAccountComponent;
