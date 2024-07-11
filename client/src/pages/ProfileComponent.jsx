// pages/ProfileComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../utils/profile.css';

const API_URL = 'http://localhost:4000';

const ProfileComponent = () => {
  const { user } = useAuth(); // Obtén la información del usuario desde el contexto de autenticación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    informacion_contacto: '',
    tipo_usuario: '', // Agrega aquí todos los otros atributos del usuario
  });
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId

  useEffect(() => {
    // Función para obtener y procesar los datos del usuario desde localStorage
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const userObject = JSON.parse(userData);
          if (userObject && userObject.usuario && userObject.usuario.id_usuario) {
            const id = userObject.usuario.id_usuario;
            setUserId(id); // Almacena el userId en el estado local
            
            // Realizar la solicitud GET usando el ID de usuario
            const response = await axios.get(`${API_URL}/usuarios/id/${id}`);
            const { contrasena, ...userDataWithoutPassword } = response.data; // Extraemos la contraseña del objeto response.data
            setFormData(userDataWithoutPassword);
          } else {
            console.error('No se encontró el ID de usuario válido en los datos almacenados.');
          }
        } else {
          console.error('No se encontraron datos de usuario en localStorage.');
        }
      } catch (error) {
        console.error('Error al procesar los datos de usuario desde localStorage:', error);
      }
    };

    fetchUserData();
  }, []); // Ejecutar solo una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizamos el estado formData
    setFormData({ ...formData, [name]: value });
    console.log("Nuevos Datos: ", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clonamos el objeto formData para no modificarlo directamente
    const updatedFormData = { ...formData };
    delete updatedFormData.tipo_usuario;

    // Verificamos si la contraseña ha sido modificada en el formulario
    if (updatedFormData.contrasena === '') {
      // Si la contraseña está vacía en el formData, la eliminamos
      delete updatedFormData.contrasena;
    }

    try {
      await axios.put(`${API_URL}/usuarios/id/${userId}`, updatedFormData);
      alert('Información actualizada correctamente');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.toLowerCase();
        if (errorMessage.includes('usuarios_email_key')) {
          alert('No se puede tener dos emails iguales.');
        } else {
          alert(`Error al actualizar la información del usuario: ${errorMessage}`);
        }
      } else {
        alert('Error al actualizar la información del usuario. Por favor, inténtelo nuevamente.');
      }
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
          <input type="password" name="contrasena" value={formData.contrasena || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Tipo de Usuario:</label>
          <span>{formData.tipo_usuario}</span>
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
