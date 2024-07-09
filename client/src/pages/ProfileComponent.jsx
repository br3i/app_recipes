import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../utils/profile.css';

const ProfileComponent = () => {
  const { user } = useAuth(); // Obtén la información del usuario desde el contexto de autenticación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    tipo_usuario: '',
    informacion_contacto: '',
    // Agrega aquí todos los otros atributos del usuario
  });

  useEffect(() => {
    // Cargar los datos del usuario cuando el componente se monta
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/usuarios/${user.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/usuarios/${user.id}`, formData);
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Perfil del Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
        </div>
        <div>
          <label>Tipo de Usuario:</label>
          <input type="text" name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange} disabled />
        </div>
        <div>
          <label>Información de Contacto:</label>
          <input type="text" name="informacion_contacto" value={formData.informacion_contacto} onChange={handleChange} />
        </div>

        {/* Agrega aquí campos para todos los otros atributos del usuario */}
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default ProfileComponent;
