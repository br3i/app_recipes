import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaNutricional from './TablaNutricional'; // Importa el componente TablaNutricional
import '../utils/BotRecomendaciones.css';
import { useModal } from '../context/ModalContext'; // Importar useModal

const API_URL = 'http://localhost:4000';

const BotRecomendaciones = () => {
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);
  const [busquedaIngrediente, setBusquedaIngrediente] = useState('');
  const [objetivos, setObjetivos] = useState([]);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState('');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [historialRecomendaciones, setHistorialRecomendaciones] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [id_cliente, setClienteId] = useState(null);

  const { showModal, hideModal } = useModal(); // Usar useModal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem('usuario');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData && userData.usuario && userData.usuario.id_usuario) {
            const id_cliente = userData.usuario.id_usuario;
            setClienteId(id_cliente); // Almacena el userId en el estado local
            console.log('ID del cliente obtenido del localStorage:', id_cliente);
            fetchHistorial(id_cliente); // Llama a fetchHistorial al obtener el ID del cliente
          } else {
            console.error('No se encontró el ID de usuario válido en los datos almacenados.');
          }
        } else {
          console.error('No se encontraron datos de usuario en localStorage.');
        }
      } catch (error) {
        console.error('Error al procesar los datos de usuario desde localStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchHistorial = async (id_cliente) => {
    try {
      const response = await axios.get(`${API_URL}/historial-recomendaciones/${id_cliente}`);
      setHistorialRecomendaciones(Array.isArray(response.data) ? response.data : []);
      console.log('Historial de recomendaciones obtenido:', response.data);
    } catch (error) {
      console.error('Error fetching historial de recomendaciones:', error);
    }
  };

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await axios.get(`${API_URL}/objetivos/`);
        setObjetivos(response.data);
        console.log('Objetivos obtenidos:', response.data);
      } catch (error) {
        console.error('Error fetching objetivos:', error);
      }
    };

    const fetchIngredientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/ingredientes`);
        setIngredientesDisponibles(response.data);
        console.log('Ingredientes obtenidos:', response.data);
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
    if (!ingredientesSeleccionados.some((ing) => ing.id_ingrediente === ingrediente.id_ingrediente)) {
      setIngredientesSeleccionados((prevState) => [
        ...prevState,
        { ...ingrediente }
      ]);
      setBusquedaIngrediente('');
      setIngredientesFiltrados([]);
      console.log('Ingrediente agregado:', ingrediente);
    }
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
    console.log('Objetivo seleccionado:', e.target.value);
  };

  const handleRemoveIngredient = (id) => {
    setIngredientesSeleccionados((prevState) =>
      prevState.filter((ing) => ing.id_ingrediente !== id)
    );
    console.log('Ingrediente removido:', id);
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
      console.log('Datos enviados para obtener recomendaciones:', data);
      const response = await axios.post(`${API_URL}/recomendaciones/`, data);
      setRecomendaciones(response.data);

      const guardarRecomendacionesData = {
        recomendaciones: response.data,
        objetivo: objetivoSeleccionado,
        id_cliente
      };

      console.log('Datos que se enviarán para guardar recomendaciones:', guardarRecomendacionesData);

      await axios.post(`${API_URL}/guardar-recomendaciones/`, guardarRecomendacionesData);

      const fecha = new Date().toLocaleDateString();
      const hora = new Date().toLocaleTimeString();
      
      setHistorialRecomendaciones((prevHistorial) => {
        const newHistorial = [...prevHistorial];
        newHistorial.push({ fecha, hora, data: response.data });
        return newHistorial;
      });

      console.log('Recomendaciones recibidas:', response.data);

      // Muestra el modal con las recomendaciones recibidas
      showModal(
        <div>
          <h2>Recomendaciones</h2>
          <div id="recomendaciones-grid">
            {response.data.map((rec) => (
              <div key={rec.id_receta} className="recomendacion-card">
                <h4>{rec.nombre}</h4>
                <p><strong>Objetivo:</strong> {rec.objetivo.nombre_objetivo}</p>
                <p><strong>Calorías Totales:</strong> {rec.calorias_totales}</p>
                <p><strong>Tiempo de Cocción:</strong> {rec.tiempo_coccion} minutos</p>
                <h5>Ingredientes:</h5>
                <ul>
                  {rec.ingredientes.map((ing) => (
                    <li key={ing.id_ingrediente}>{ing.nombre}: {ing.recetas_ingredientes.cantidad}g</li>
                  ))}
                </ul>
                <p><strong>Instrucciones:</strong> {rec.instrucciones_prep}</p>
              </div>
            ))}
          </div>
          <button onClick={hideModal}>Cerrar</button>
        </div>
      );
      await fetchHistorial(id_cliente);

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <>
      <button
        className={`button-obtain-recomendations toggle-sidebar ${showHistorial ? 'expanded' : 'collapsed'}`}
        onClick={() => setShowHistorial(!showHistorial)}
      >
        {showHistorial ? '<' : '>'}
      </button>
      <div id="sidebar" className={showHistorial ? 'expanded' : 'collapsed'}>
        <h4>Historial de Recomendaciones</h4>
        <ul>
          {Array.isArray(historialRecomendaciones) && historialRecomendaciones.map((item) => (
            <li key={item.id_historico_recomendaciones}>
              <strong>{item.recetas_ingrediente?.receta?.nombre}</strong>
              <div className="recomendaciones-por-hora">
                <p><strong>Objetivo:</strong> {item.objetivos_nutricionale?.nombre_objetivo}</p>
                <p><strong>Calorías Totales:</strong> {item.recetas_ingrediente?.receta?.calorias_totales}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div id="bot-recomendaciones-container" className={showHistorial ? 'with-sidebar' : ''}>
        <div id='selection-ingredientes'>
          <div id='bloque-busqueda-ingredientes'>
            <h3>Ingredientes</h3>
            <div id="busqueda-ingredientes">
              <input
                type="text"
                value={busquedaIngrediente}
                onChange={handleBusquedaIngredienteChange}
                placeholder="Buscar ingrediente"
              />
              <ul id="lista-ingredientes">
                {ingredientesFiltrados.map((ing) => (
                  <li key={ing.id_ingrediente} onClick={() => agregarIngrediente(ing)}>
                    {ing.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
         <div id='bloque-ingredientes-seleccionados'>
            <h3>Ingredientes Seleccionados</h3>
            <ul id="ingredientes-seleccionados">
              {ingredientesSeleccionados.map((ing) => (
                <li key={ing.id_ingrediente}>
                  <span className="ingrediente-nombre">{ing.nombre}</span>
                  <input
                    className="ingrediente-cantidad"
                    type="number"
                    value={ing.cantidad}
                    onChange={(e) => handleCantidadChange(ing.id_ingrediente, e.target.value)}
                    placeholder="Cantidad"
                  />
                  <span className="remove-ingredient" onClick={() => handleRemoveIngredient(ing.id_ingrediente)}>×</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3>Objetivo Nutricional</h3>
        <select value={objetivoSeleccionado} onChange={handleObjetivoChange}>
          <option value="">Seleccionar objetivo</option>
          {objetivos.map((obj) => (
            <option key={obj.id_objetivo} value={obj.nombre_objetivo}>
              {obj.nombre_objetivo}
            </option>
          ))}
        </select>
        <button className="button-obtain-recomendations" onClick={handleSubmit}>Obtener Recomendaciones</button>
        <div id="recomendaciones-section">
          <h3>Recomendaciones</h3>
          <div id="recomendaciones-grid">
            {recomendaciones.map((rec) => (
              <div key={rec.id_receta} className="recomendacion-card">
                <div className='recipe-general-information'>
                  <h4>{rec.nombre}</h4>
                  <p><strong>Objetivo:</strong> {rec.objetivo.nombre_objetivo}</p>
                  <p><strong>Calorías Totales:</strong> {rec.calorias_totales}</p>
                  <p><strong>Tiempo de Cocción:</strong> {rec.tiempo_coccion} minutos</p>
                  <h5>Ingredientes:</h5>
                  <ul>
                    {rec.ingredientes.map((ing) => (
                      <li key={ing.id_ingrediente}>{ing.nombre}: {ing.recetas_ingredientes.cantidad}g</li>
                    ))}
                  </ul>
                  <p><strong>Instrucciones:</strong> {rec.instrucciones_prep}</p>
                </div>
                <TablaNutricional receta={rec} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BotRecomendaciones;
