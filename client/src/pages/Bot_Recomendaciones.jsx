import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/BotRecomendaciones.css'

const API_URL = 'http://localhost:4000';

const BotRecomendaciones = () => {
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);
  const [busquedaIngrediente, setBusquedaIngrediente] = useState('');
  const [objetivos, setObjetivos] = useState([]);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState('');
  const [recomendaciones, setRecomendaciones] = useState([]);

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await axios.get(`${API_URL}/objetivos/`);
        setObjetivos(response.data);
      } catch (error) {
        console.error('Error fetching objetivos:', error);
      }
    };

    const fetchIngredientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/ingredientes`);
        setIngredientesDisponibles(response.data);
      } catch (error) {
        console.error('Error fetching ingredientes:', error);
      }
    };

    fetchObjetivos();
    fetchIngredientes();
  }, []);

  const handleBusquedaIngredienteChange = (e) => {
    const { value } = e.target;
    setBusquedaIngrediente(value);
    setIngredientesFiltrados(
      ingredientesDisponibles.filter((ing) =>
        ing.nombre.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const agregarIngrediente = (ingrediente) => {
    setIngredientesSeleccionados((prevState) => [
      ...prevState,
      { ...ingrediente, cantidad: 0 }
    ]);
    setBusquedaIngrediente('');
    setIngredientesFiltrados([]);
  };

  const handleCantidadChange = (id, value) => {
    setIngredientesSeleccionados((prevState) =>
      prevState.map((ing) =>
        ing.id_ingrediente === id ? { ...ing, cantidad: value } : ing
      )
    );
  };

  const handleObjetivoChange = (e) => {
    setObjetivoSeleccionado(e.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      objetivo: objetivoSeleccionado,
      ingredientes: ingredientesSeleccionados.map((ing) => ({
        nombre: ing.nombre,
        cantidad: ing.cantidad
      }))
    };

    try {
      const response = await axios.post(`${API_URL}/recomendaciones/`, data);
      setRecomendaciones(response.data);
      console.log('Recomendaciones recibidas:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

return (
  <div className="bot-recomendaciones-container">
    <h3>Ingredientes</h3>
    <div className="busqueda-ingredientes">
      <input
        type="text"
        value={busquedaIngrediente}
        onChange={handleBusquedaIngredienteChange}
        placeholder="Buscar ingrediente"
      />
      <ul>
        {ingredientesFiltrados.map((ing) => (
          <li key={ing.id_ingrediente} onClick={() => agregarIngrediente(ing)}>
            {ing.nombre}
          </li>
        ))}
      </ul>
    </div>

    <h3>Ingredientes Seleccionados</h3>
    <ul>
      {ingredientesSeleccionados.map((ing) => (
        <li key={ing.id_ingrediente}>
          {ing.nombre}
          <input
            type="number"
            value={ing.cantidad}
            onChange={(e) => handleCantidadChange(ing.id_ingrediente, e.target.value)}
            placeholder="Cantidad (g)"
          />
        </li>
      ))}
    </ul>

    <h3>Objetivo Nutricional</h3>
    <select value={objetivoSeleccionado} onChange={handleObjetivoChange}>
      <option value="">Seleccionar objetivo</option>
      {objetivos.map((obj) => (
        <option key={obj.id_objetivo} value={obj.nombre_objetivo}>
          {obj.nombre_objetivo}
        </option>
      ))}
    </select>

    <button onClick={handleSubmit}>Obtener Recomendaciones</button>

    <div className="recomendaciones-section">
      <h3>Recomendaciones</h3>
      {recomendaciones.map((rec) => (
        <div key={rec.id_receta}>
          <h4>{rec.nombre}</h4>
          <p>Objetivo: {rec.objetivo.nombre_objetivo}</p>
          <p>Calorías Totales: {rec.calorias_totales}</p>
          <p>Carbohidratos Totales: {rec.carbohidratos_totales}</p>
          <p>Proteínas Totales: {rec.proteinas_totales}</p>
          <p>Grasas Totales: {rec.grasas_totales}</p>
          <p>Fibra Total: {rec.fibra_total}</p>
          <p>Azúcares Totales: {rec.azucares_totales}</p>
          <p>Sodio Total: {rec.sodio_total}</p>
          <p>Tiempo de Cocción: {rec.tiempo_coccion} minutos</p>
          <p>Instrucciones: {rec.instrucciones_prep}</p>
          <h5>Ingredientes:</h5>
          <ul>
            {rec.ingredientes.map((ing) => (
              <li key={ing.id_ingrediente}>{ing.nombre}: {ing.cantidad}g</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

};

export default BotRecomendaciones;
