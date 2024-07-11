import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../utils/Layout.css'; // Estilos para el layout
import logo from '../components/public/logo.png'; 

const Layout = () => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" />
          <span className="logo-text">SMART PLATE</span>
        </a>
        <nav className="layout-navbar">
          <Link to="/">Inicio</Link>
          <Link to="/about">Sobre nosotros</Link>
          <Link to="/recipes">Recetas</Link>
          <Link to="/how-it-works">Cómo funciona</Link>
          <Link to="/create-account" className="btn-black">Crear Cuenta</Link>
          <Link to="/start" className="btn-green">Empezar</Link>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet /> {/* Renderiza el contenido de la ruta actual */}
      </main>
    </div>
  );
};

export default Layout;
