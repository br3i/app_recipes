import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../utils/ComoFunciona.css';

// Imágenes para el carrusel
import img1 from '../components/public/img3.jpeg'; // Reemplaza con la ruta correcta
import img2 from '../components/public/img2.webp'; // Reemplaza con la ruta correcta
import img3 from '../components/public/img1.jpeg'; // Reemplaza con la ruta correcta
import img4 from '../components/public/img4.jpeg'; // Reemplaza con la ruta correcta

const ComoFunciona = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/comentarios', { email, message });
      setResponse(res.data.message);
    } catch (error) {
      setResponse('Error al enviar el comentario.');
    }
  };

  return (
    <div className="comofunciona-container">
      <Carousel
        interval={5000}
        prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true"></span>}
        nextIcon={<span className="carousel-control-next-icon" aria-hidden="true"></span>}
      >
        <Carousel.Item>
          <div className="carousel-content">
            <h1>¿Cómo Funciona SmartPlate?</h1>
            <p><strong>SmartPlate</strong> es un sistema de recomendación de recetas alimenticias diseñado para ayudarte a maximizar el uso de los ingredientes disponibles en tu despensa y refrigerador. Aquí te explicamos cómo funciona:</p>
            <img src={img1} alt="Funcionamiento de SmartPlate" className="carousel-image" />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content">
            <ul>
              <li><strong>Acceso y Navegación Sin Registro:</strong> Puedes acceder a todas las funcionalidades principales de SmartPlate sin necesidad de crear una cuenta. Esto permite una experiencia de usuario fluida y rápida.</li>
              <li><strong>Interfaz Intuitiva:</strong> Nuestra interfaz está diseñada para ser fácil de usar, permitiendo a los usuarios navegar y utilizar el sistema sin complicaciones. Simplemente ingresa los ingredientes que tienes disponibles y selecciona un objetivo nutricional.</li>
            </ul>
            <img src={img2} alt="Interfaz de SmartPlate" className="carousel-image" />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content">
            <ul>
              <li><strong>Selección de Objetivo Nutricional:</strong> Elige entre diferentes objetivos nutricionales como alto en proteínas, bajo en grasas, rico en carbohidratos, entre otros. Esto asegura que las recetas recomendadas se adapten a tus necesidades y preferencias individuales.</li>
              <li><strong>Ingreso de Ingredientes:</strong> Introduce los ingredientes que tienes en casa, especificando las cantidades disponibles. Puedes editar esta lista en cualquier momento para reflejar tu inventario actual.</li>
            </ul>
            <img src={img3} alt="Objetivos Nutricionales" className="carousel-image" />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content">
            <ul>
              <li><strong>Recomendaciones Personalizadas:</strong> Utilizando un modelo de inteligencia artificial (IA) optimizado, SmartPlate analiza los ingredientes y tus objetivos nutricionales para generar tres opciones de recetas personalizadas. Estas recomendaciones se basan en algoritmos de búsqueda y análisis de datos para asegurar su relevancia y precisión.</li>
              <li><strong>Visualización de Recetas:</strong> Las recetas que coincidan con tus ingredientes y objetivos se muestran de manera clara y detallada. Cada receta incluye los pasos de preparación, tiempo de cocción y la información nutricional correspondiente.</li>
            </ul>
            <img src={img4} alt="Recomendaciones Personalizadas" className="carousel-image" />
          </div>
        </Carousel.Item>
      </Carousel>
      <button className="carousel-button-como-funciona" id='btn-prev-como-funciona' onClick={() => document.querySelector('.carousel-control-prev').click()}>&lt;</button>
      <button className="carousel-button-como-funciona" id='btn-next-como-funciona' onClick={() => document.querySelector('.carousel-control-next').click()}>&gt;</button>
    </div>
  );
};

export default ComoFunciona;

/*
<div className="newsletter-container">
        <h2>Deja tu comentario en este boletín</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Ingrese su mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">Enviar</button>
        </form>
        {response && <p>{response}</p>}
      </div>
*/
