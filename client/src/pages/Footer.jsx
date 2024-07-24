// pages/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import '../utils/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h4>Sobre Nosotros</h4>
            <ul>
              <li><Link to="/about">Historia</Link></li>
              <li><Link to="/about">Misión</Link></li>
              <li><Link to="/about">Visión</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link to="/inicio">Inicio</Link></li>
              <li><Link to="/recetas">Recetas</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:polidevs@gmail.com">polidevs@gmail.com</a></li>
              <li><a href="#!">0967161147</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Redes Sociales</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61559322495642" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/tu-perfil" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/tu-perfil" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/tu-canal" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Smart Plate. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
