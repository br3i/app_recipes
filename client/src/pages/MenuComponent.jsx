import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../utils/menu.css'; // Importa tus estilos CSS aquí
import logo from '../components/public/logo.png';
import ProfileForm from './ProfileComponent'; // Asegúrate de tener este componente

const MenuComponent = () => {
  const [activePage, setActivePage] = useState('home'); // Estado para manejar la página activa
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <div className="menu-container">
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
      <br />
      <main className="content">
        {activePage === 'profile' && <ProfileForm />}
        {activePage === 'manageUsers' && <div>Manage Users Content</div>}
        {activePage === 'ingredientes' && <div>Ingredientes Disponibles Content</div>}
        {activePage === 'recetas' && <div>Recetas Disponibles Content</div>}
        {activePage === 'passwordReset' && <div>Cambiar Contraseña Content</div>}
        {activePage === 'home' && <div>Home Page Content</div>}
      </main>
    </div>
  );
};

export default MenuComponent;
