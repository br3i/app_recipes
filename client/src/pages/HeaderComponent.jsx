// HeaderComponent.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../components/public/logo.png';

const HeaderComponent = ({ handleNavigation }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <a href="/" className="logo">
        <img src={logo} alt="Logo" />
      </a>
      <nav className="navbar">
        <a href="#!" onClick={() => handleNavigation('manageUsers')}>Manage Users</a>
        <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
        <a href="#!" onClick={() => handleNavigation('ingredientes')}>Ingredientes Disponibles</a>
        <a href="#!" onClick={() => handleNavigation('recetas')}>Recetas Disponibles</a>
        <a href="#!" onClick={() => handleNavigation('passwordReset')}>Cambiar Contraseña</a>
      </nav>
      <button className="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  );
};

export default HeaderComponent;
