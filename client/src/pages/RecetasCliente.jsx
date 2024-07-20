import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../utils/RecetasCliente.css'

const RecetasClientes = () => {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/recetas'); // Ajusta la URL según tu API
      setRecetas(response.data); // Asumiendo que tu API devuelve un array de recetas
    } catch (error) {
      console.error('Error al obtener las recetas:', error);
    }
  };

  const getRandomImage = () => {
    // Generar un número aleatorio para incluirlo en la URL y evitar el caché
    const randomNum = Math.floor(Math.random() * 1000);
    // URL de servicio que proporciona imágenes aleatorias
    const randomImageApiUrl = `https://picsum.photos/800/600?random=${randomNum}`;
    return randomImageApiUrl;
  };
  return (
    <div className="recetas-clientes-container">
      <h2>Nuestras Recetas</h2>
      <Carousel interval={5000} prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true"></span>} nextIcon={<span className="carousel-control-next-icon" aria-hidden="true"></span>}>
        {recetas.map((receta) => (
          <Carousel.Item key={receta.id}>
            <div className="carousel-content">
              <h3>{receta.nombre}</h3>
              <p>{receta.descripcion}</p>
              <img src={getRandomImage()} alt={receta.nombre} className="carousel-image" />
              <h4>Ingredientes:</h4>
              <ul>
                {receta.ingredientes.map((ingrediente, index) => (
                  <li key={index}>{ingrediente.nombre}: {ingrediente.recetas_ingredientes.cantidad}g</li>
                ))}
              </ul>
              <p>Tiempo de cocción: {receta.tiempo_coccion} minutos</p>
              <p>Objetivo: {receta.objetivo.nombre_objetivo}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default RecetasClientes;
