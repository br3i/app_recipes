import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../utils/HomePage.css';
import logo from '../components/public/logo.png';
import cookingImage from '../components/public/imagen-pag-principal.png';
import LoginComponent from '../pages/LoginComponent';
import RegisterClient from '../pages/RegisterClient';
import AboutUs from '../pages/AboutUs';
import ProfileForm from '../pages/ProfileComponent';
import PasswordReset from '../pages/PasswordResetComponent';
import ComoFunciona from '../pages/ComoFunciona';
import RecetasCliente from '../pages/RecetasCliente';
import CarouselItem from '../components/ComentarioCarousel';

const API_URL = 'http://localhost:4000';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [recetasCount, setRecetasCount] = useState(0);
  const [objetivosCount, setObjetivosCount] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await axios.get(`${API_URL}/recetas`);
        setRecetasCount(response.data.length);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    const fetchObjetivos = async () => {
      try {
        const response = await axios.get(`${API_URL}/objetivos`);
        setObjetivosCount(response.data.length);
      } catch (error) {
        console.error('Error fetching objetivos:', error);
      }
    };

    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`${API_URL}/comentarios20`);
        setComentarios(response.data.comentarios);
      } catch (error) {
        console.error('Error fetching comentarios:', error);
      }
    };

    fetchRecetas();
    fetchObjetivos();
    fetchComentarios();
  }, []);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleStartClick = () => {
    setCurrentPage('login');
    setMenuOpen(false);
  };

  const handleCreateAccountClick = () => {
    setCurrentPage('register');
    setMenuOpen(false);
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
    <div className="homepage-container">
      <Helmet>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Helmet>
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
      <div className="image-side"></div>
      <main className="homepage-main">
        {currentPage === 'home' && (
          <>
            <section className="intro-section">
              <div className="intro-text">
                <h2>COCINA CON LO QUE TIENES!</h2>
              </div>
              <div className="intro-image">
                <img src={cookingImage} alt="Cooking" />
              </div>
            </section>
            <div className="stats-container">
              <div className="stats-row">
                <div className="stat">
                  <h3>{recetasCount}</h3>
                  <p>RECETAS</p>
                </div>
                <div className="stat">
                  <h3>{objetivosCount}</h3>
                  <p>OBJETIVOS</p>
                </div>
                <div className="stat">
                  <h3>3</h3>
                  <p>RECOMENDACIONES</p>
                </div>
              </div>
              <div className="stat">
                <p>Ninguna razón para no usarla</p>
              </div>
            </div>
            <div className="comments-carousel-container">
              <div className="comments-carousel">
                {comentarios.concat(comentarios).map((comentario, index) => (
                  <CarouselItem
                    key={index}
                    nombre={comentario.nombre}
                    descripcion={comentario.descripcion}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'recipes' && <RecetasCliente />}
        {currentPage === 'how-it-works' && <ComoFunciona />}
        {currentPage === 'login' && <LoginComponent />}
        {currentPage === 'register' && <RegisterClient />}
        {currentPage === 'profile' && <ProfileForm />}
        {currentPage === 'passwordReset' && <PasswordReset />}
      </main>
      <div className="image-side image-right"></div>
    </div>
  );
};

export default HomePage;
