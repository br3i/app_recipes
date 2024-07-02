import React, { useState } from 'react';
import axios from 'axios';
import '../utils/passwordReset.css';

const PasswordResetComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/usuarios/reset-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError('Error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="password-reset-container">
      <h1>Restablecer Contraseña</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="password-reset-form">
        <div className="form-group">
          <label>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type='submit' className="submit-button">Restablecer Contraseña</button>
      </form>
    </div>
  );
};

export default PasswordResetComponent;

