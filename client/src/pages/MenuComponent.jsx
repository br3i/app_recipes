import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../utils/menu.css'; // Importa tus estilos CSS aquí

const MenuComponent = () => {
  const { logout } = useAuth();

  return (
    <div className="menu-container">
      <h2>Menu</h2>
      <nav>
        <ul className="menu-list">
        <li><Link to="/management-user">Manage Users</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
          <li><Link to="/ingredientes">Ingredientes Disponibles</Link></li>
          <li><Link to="/recetas">Recetas Disponibles</Link></li>
          <li><Link to="/password-reset">Cambiar Contraseña</Link></li>
        </ul>
      </nav>
      <button className="logout-button" onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default MenuComponent;


