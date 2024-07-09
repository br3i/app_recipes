// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../utils/AboutUs.css'; // Asegúrate de que este archivo exista en la carpeta utils
import logo from '../components/public/logo.png'; 

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <header className="aboutus-header">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
          <span className="logo-text">SMART PLATE</span>
        </Link>
        <nav className="aboutus-navbar">
          <Link to="/about">Sobre nosotros</Link>
          <Link to="/recipes">Recetas</Link>
          <Link to="/how-it-works">Cómo funciona</Link>
          <Link to="/create-account" className="btn-black">Crear Cuenta</Link>
          <Link to="/start" className="btn-green">Empezar</Link>
        </nav>
      </header>
      <main className="aboutus-main">
        <section className="team-section">
          <h2>Conoce a nuestro equipo</h2>
          <div className="team-info">
            <p>Somos un grupo de estudiantes de diferentes campos técnicos y políticos. Nuestra pasión es desarrollar soluciones innovadoras que faciliten la vida diaria.</p>
            <div className="team-members">
              <div className="team-member">
                <h3>Juan Pérez</h3>
                <p>Desarrollador Backend</p>
              </div>
              <div className="team-member">
                <h3>María Gómez</h3>
                <p>Desarrolladora Frontend</p>
              </div>
              <div className="team-member">
                <h3>Pedro Martínez</h3>
                <p>Especialista en UX/UI</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
