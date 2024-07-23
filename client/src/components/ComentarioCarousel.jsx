// src/components/CarouselItem.jsx
import React from 'react';
import '../utils/CarouselItem.css';

const CarouselItem = ({ nombre, descripcion }) => {
  return (
    <div className="comment-card">
      <h4>{nombre}</h4>
      <p>{descripcion}</p>
    </div>
  );
};

export default CarouselItem;
