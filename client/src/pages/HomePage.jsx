import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Importa Helmet
import axios from 'axios';
import '../utils/HomePage.css';
import logo from '../components/public/logo.png';
import cookingImage from '../components/public/receta.jpg';
import LoginComponent from '../pages/LoginComponent'; // Importa el componente LoginComponent
import RegisterClient from '../pages/RegisterClient'; // Importa el componente RegisterClient
import AboutUs from '../pages/AboutUs'; // Importa el componente AboutUs
import ProfileForm from '../pages/ProfileComponent'; // Importa el componente ProfileForm
import PasswordReset from '../pages/PasswordResetComponent'; // Importa el componente PasswordReset
import ComoFunciona from '../pages/ComoFunciona'; // Importa el componente PasswordReset
import RecetasCliente from '../pages/RecetasCliente'
import RecetasBackUp from '../pages/RecetasComponent'

const API_URL = 'http://localhost:4000'; // Ajusta según tu configuración

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Estado para controlar la página actual
  const [recetasCount, setRecetasCount] = useState(0);
  const [objetivosCount, setObjetivosCount] = useState(0);
  const [comentarios, setComentarios] = useState([]); // Estado para almacenar los comentarios

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
        const response = await axios.get(`${API_URL}/comentarios`);
        setComentarios(response.data);
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
  };

  const handleStartClick = () => {
    setCurrentPage('login'); // Navega al LoginComponent
  };

  const handleCreateAccountClick = () => {
    setCurrentPage('register'); // Navega al RegisterClient
  };

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
        <nav className="homepage-navbar">
          <a href="#!" onClick={() => handleNavClick('home')}>Inicio</a>
          <a href="#about" onClick={() => handleNavClick('about')}>Sobre nosotros</a>
          <a href="#recipes" onClick={() => handleNavClick('recipes')}>Recetas</a>
          <a href="#how-it-works" onClick={() => handleNavClick('how-it-works')}>Cómo funciona</a>
          <a href="#create-account" className="btn-black" onClick={handleCreateAccountClick}>Crear Cuenta</a>
          <button className="btn-green" onClick={handleStartClick}>Empezar</button>
        </nav>
      </header>
      <div className="image-side image-left"></div> {/* Imagen izquierda */}
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
            <div className="stats">
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
              <div className="stat">
                <p>Ninguna razón para no usarla</p>
              </div>
            </div>
           <div className="comments-section">
            {comentarios.map((comentario) => (
              <div key={comentario.id_comentario} className="comment-card">
                <h4>{comentario.nombre}</h4>
                <p>{comentario.descripcion}</p>
              </div>
            ))}
          </div>

          </>
        )}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'recipes' && <RecetasCliente/>}
        {currentPage === 'how-it-works' && <ComoFunciona />}
        {currentPage === 'login' && <LoginComponent />}
        {currentPage === 'register' && <RegisterClient />}
        {currentPage === 'profile' && <ProfileForm />}
        {currentPage === 'passwordReset' && <PasswordReset />}
      </main>
      <div className="image-side image-right"></div> {/* Imagen derecha */}
    </div>
  );
};

export default HomePage;
