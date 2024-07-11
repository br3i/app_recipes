// pages/AdminHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from './public/logo.png';
import '../utils/menu.css';

const AdminHeader = () => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <a href="/" className="logo">
        <img src={logo} alt="Logo" />
      </a>
      <nav className="navbar">
        <Link to="/management-user">Manage Users</Link>
        <Link to="/profile">Perfil</Link>
        <Link to="/ingredientes">Ingredientes Disponibles</Link>
        <Link to="/recetas">Recetas Disponibles</Link>
      </nav>
      <button className="logout-button" onClick={logout}>Cerrar sesión</button>
    </header>
  );
};

export default AdminHeader;
