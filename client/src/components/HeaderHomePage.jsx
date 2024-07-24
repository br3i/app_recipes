// src/components/HeaderHomePage.jsx
import React, { useEffect, useRef } from 'react';
import '../utils/HeaderHomePage.css';
import logo from '../components/public/logo.png';

const HeaderHomePage = ({ handleNavClick, handleStartClick, handleCreateAccountClick, menuOpen, toggleMenu, closeMenu }) => {
  const menuRef = useRef(null);

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
  }, [menuRef, closeMenu]);

  return (
    <>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" />
          <span className="logo-text">SMART PLATE</span>
        </a>
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <nav className="homepage-navbar">
          <a href="#!" onClick={() => handleNavClick('home')}>Inicio</a>
          <a href="#about" onClick={() => handleNavClick('about')}>Sobre nosotros</a>
          <a href="#recipes" onClick={() => handleNavClick('recipes')}>Recetas</a>
          <a href="#how-it-works" onClick={() => handleNavClick('how-it-works')}>Cómo funciona</a>
          <a href="#create-account" className="btn-black" onClick={handleCreateAccountClick}>Crear Cuenta</a>
          <button className="btn-green" onClick={handleStartClick}>Empezar</button>
        </nav>
      </header>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <a href="#!" onClick={() => handleNavClick('home')}>Inicio</a>
        <a href="#about" onClick={() => handleNavClick('about')}>Sobre nosotros</a>
        <a href="#recipes" onClick={() => handleNavClick('recipes')}>Recetas</a>
        <a href="#how-it-works" onClick={() => handleNavClick('how-it-works')}>Cómo funciona</a>
        <a href="#create-account" className="btn-black" onClick={handleCreateAccountClick}>Crear Cuenta</a>
        <button className="btn-green" onClick={handleStartClick}>Empezar</button>
      </div>
    </>
  );
};

export default HeaderHomePage;
