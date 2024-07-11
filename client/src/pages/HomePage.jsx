import React, { useState } from 'react';
import '../utils/HomePage.css';
import logo from '../components/public/logo.png';
import cookingImage from '../components/public/receta.jpg';
import LoginComponent from '../pages/LoginComponent'; // Importa el componente LoginComponent
import RegisterClient from '../pages/RegisterClient'; // Importa el componente RegisterClient

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Estado para controlar la página actual
  const [showLogin, setShowLogin] = useState(false); // Estado para controlar la visualización del LoginComponent
  const [showRegister, setShowRegister] = useState(false); // Estado para controlar la visualización del RegisterClient

  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  const handleStartClick = () => {
    setShowLogin(true); // Muestra el LoginComponent
    setShowRegister(false); // Asegúrate de ocultar el formulario de registro
  };

  const handleCreateAccountClick = () => {
    setShowRegister(true); // Muestra el RegisterClient
    setShowLogin(false); // Asegúrate de ocultar el LoginComponent
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" />
          <span className="logo-text">SMART PLATE</span>
        </a>
        <nav className="homepage-navbar">
          <a href="/" onClick={() => handleNavClick('home')}>Inicio</a>
          <a href="#about" onClick={() => handleNavClick('about')}>Sobre nosotros</a>
          <a href="#recipes" onClick={() => handleNavClick('recipes')}>Recetas</a>
          <a href="#how-it-works" onClick={() => handleNavClick('how-it-works')}>Cómo funciona</a>
          <a href="#create-account" className="btn-black" onClick={handleCreateAccountClick}>Crear Cuenta</a>
          <button className="btn-green" onClick={handleStartClick}>Empezar</button>
        </nav>
      </header>
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
                <h3>180</h3>
                <p>RECETAS</p>
              </div>
              <div className="stat">
                <h3>12</h3>
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
          </>
        )}
        {currentPage === 'about' && (
          <section className="aboutus-section">
            <h1>¡Bienvenidos a Recetas Saludables!</h1>
            <p>
              Somos un grupo de estudiantes de la carrera de Software de la Escuela Superior Politécnica de Chimborazo. En Poli Devs, nos apasiona el desarrollo de software y la creación de soluciones innovadoras que aborden desafíos reales.
            </p>
            <p>
              Nuestro equipo está compuesto por estudiantes dedicados y motivados que combinan sus habilidades en programación, diseño y gestión de proyectos para ofrecer productos y servicios de alta calidad. Desde nuestra fundación, hemos trabajado en diversos proyectos que buscan mejorar la experiencia del usuario y aportar valor en el campo de la tecnología.
            </p>
            <p>
              Nos enorgullece nuestro enfoque colaborativo y nuestra constante búsqueda de aprendizaje y mejora. Estamos comprometidos con la excelencia y la innovación, y nuestro objetivo es aplicar nuestros conocimientos para crear soluciones prácticas y efectivas.
            </p>
            <p>
              Gracias por visitar nuestra página. Si tienes alguna pregunta o deseas colaborar con nosotros, no dudes en ponerte en contacto. ¡Estamos aquí para ayudarte!
            </p>
          </section>
        )}
        {/* Mostrar el LoginComponent si showLogin es verdadero */}
        {showLogin && <LoginComponent />}
        {/* Mostrar el RegisterClient si showRegister es verdadero */}
        {showRegister && (
          <div className="register-form">
            <RegisterClient />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
