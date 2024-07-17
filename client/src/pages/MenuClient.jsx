// src/pages/MenuClient.jsx
import React, { useState } from 'react';
import '../utils/MenuClient.css'; // Importa el archivo de estilos

const MenuClient = () => {
  const [selectedObjective, setSelectedObjective] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [recommendedRecipes, setRecommendedRecipes] = useState([
    // Inicialmente, puede estar vacío o con recetas de ejemplo
    { title: 'Receta Ejemplo 1', description: 'Descripción de la receta 1' },
    { title: 'Receta Ejemplo 2', description: 'Descripción de la receta 2' },
  ]);

  const handleObjectiveChange = (event) => {
    setSelectedObjective(event.target.value);
    // Aquí puedes añadir lógica para obtener recetas basadas en el objetivo
  };

  return (
    <div className="menu-client">
      <div className="menu-client-left">
        <h2>Opciones del Cliente</h2>
        <ul>
          <li><a href="#profile">Perfil</a></li>
          <li><a href="#settings">Ajustes</a></li>
          <li><a href="#history">Historial de Recetas</a></li>
          {/* Añade más opciones según sea necesario */}
        </ul>
      </div>
      <div className="menu-client-center">
        <div className="objective-section">
          <h2>Objetivo</h2>
          <select value={selectedObjective} onChange={handleObjectiveChange}>
            <option value="">Selecciona un objetivo</option>
            <option value="weight-loss">Pérdida de peso</option>
            <option value="muscle-gain">Ganancia muscular</option>
            <option value="balanced-diet">Dieta equilibrada</option>
            {/* Añade más opciones según sea necesario */}
          </select>
        </div>
        <div className="ingredients-section">
          <h2>Ingredientes Disponibles</h2>
          <textarea
            value={availableIngredients}
            onChange={(e) => setAvailableIngredients(e.target.value)}
            placeholder="Ingresa los ingredientes disponibles"
          />
        </div>
      </div>
      <div className="menu-client-right">
        <h2>Recetas Recomendadas</h2>
        {recommendedRecipes.length === 0 ? (
          <p>No hay recetas recomendadas</p>
        ) : (
          <ul>
            {recommendedRecipes.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MenuClient;
