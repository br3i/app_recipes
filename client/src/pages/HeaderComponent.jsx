import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../components/public/logo.png';
import '../utils/header.css';

const HeaderComponent = ({ handleNavigation, tipoUsuario }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

   const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header id="header">
        <a href="home" className="logo">
          <img src={logo} alt="Logo" />
        </a>
        <button id="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <nav id="navbar">
          <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
          {tipoUsuario === 'administrador' && (
            <a href="#!" onClick={() => handleNavigation('manage-usuarios')}>Administrar Usuarios</a>
          )}
          {(tipoUsuario === 'nutricionista' || tipoUsuario === 'administrador') && (
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

      <div id="side-menu" ref={menuRef} className={menuOpen ? 'open' : ''}>
                  <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
          {tipoUsuario === 'administrador' && (
            <a href="#!" onClick={() => handleNavigation('manage-usuarios')}>Administrar Usuarios</a>
          )}
          {(tipoUsuario === 'nutricionista' || tipoUsuario === 'administrador') && (
            <>
              <a href="#!" onClick={() => handleNavigation('manage-ingredientes')}>Ingredientes Disponibles</a>
              <a href="#!" onClick={() => handleNavigation('manage-recetas')}>Recetas Disponibles</a>
            </>
          )}
          <a href="#!" onClick={() => handleNavigation('bot-recomendaciones')}>Recomendaciones</a>
          <a href="#!" onClick={() => handleNavigation('comentarios-cliente')}>Comentarios</a>
        <button id="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </>
  );
};

export default HeaderComponent;
