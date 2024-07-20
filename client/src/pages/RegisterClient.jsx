// src/pages/RegisterClient.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../utils/login.css'; // Puedes ajustar los estilos según sea necesario
import '../utils/RegisterClient.css';
const API_URL = 'http://localhost:4000/clientes';

const RegisterClient = () => {
  const [name, setName] = useState('');
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        nombre_cliente: name,
        correo,
        contrasena: password,
        tipo_usuario: 'cliente', // Establecido como estático
        informacion_contacto: contactInfo,
      };
      
      const response = await axios.post(API_URL, payload);
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setError('');
    } catch (error) {
      setSuccess('');
      setError('Error en el registro. Por favor, intenta de nuevo.');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <div className="register-client-container">
      <h1>Crear Cuenta</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Información de Contacto</label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterClient;
