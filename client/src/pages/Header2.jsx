import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../components/public/logo.png';
import '../utils/header.css';

const HeaderComponent = ({ handleNavigation, tipoUsuario }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header id="header">
      <a href="/" className="logo">
        <img src={logo} alt="Logo" />
      </a>
      <nav id="navbar">
        <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
        {tipoUsuario === 'admin' && (
          <>
            <a href="#!" onClick={() => handleNavigation('manage-usuarios')}>Administrar Usuarios</a>
          </>
        )}
        {tipoUsuario === 'nutricionista' && (
          <>
            <a href="#!" onClick={() => handleNavigation('manage-ingredientes')}>Ingredientes Disponibles</a>
            <a href="#!" onClick={() => handleNavigation('manage-recetas')}>Recetas Disponibles</a>
          </>
        )}
        <a href="#!" onClick={() => handleNavigation('bot-recomendaciones')}>Recomendaciones</a>
        <a href="#!" onClick={() => handleNavigation('comentarios-cliente')}>Comentarios</a>
      </nav>
      <button id="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  );
};

export default HeaderComponent;
