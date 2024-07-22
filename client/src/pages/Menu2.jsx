import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import Paginas from './Paginas'; // Importar el componente Paginas
import { useAuth } from '../context/AuthContext';
import { usePage } from '../context/PageContext'; // Importar el hook de página
import '../utils/menu.css';

const MenuComponent = () => {
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const { logout } = useAuth();
  const { handleNavigation } = usePage();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem('usuario');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData && userData.usuario && userData.usuario.id_usuario) {
            const tipo_usuario = userData.usuario.tipo_usuario;
            setTipoUsuario(tipo_usuario);
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
  }, []);

  return (
    <div className="menu-container">
      <HeaderComponent handleNavigation={handleNavigation} tipoUsuario={tipoUsuario} />
      <Paginas />
      <div className="image-side image-left"></div>
      <div className="image-side image-right"></div>
    </div>
  );
};

export default MenuComponent;
