import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../utils/recetas.css';

const API_URL = 'http://localhost:4000';

const VisualizadorRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
  const [busquedaIngrediente, setBusquedaIngrediente] = useState('');
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState('');
  const [comparacion, setComparacion] = useState('');
  const [parametro, setParametro] = useState('');
  const [valorParametro, setValorParametro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [recetaEditando, setRecetaEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    instrucciones_prep: '',
    tiempo_coccion: '',
    calorias_totales: '',
    proteinas_totales: '',
    carbohidratos_totales: '',
    grasas_totales: '',
    azucares_totales: '',
    fibra_total: '',
    sodio_total: '',
    id_objetivo: '',
    ingredientes: []
  });
  const recetasPorPagina = 10;
  const ingredientesPorPagina = 5;
  const { authTokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await axios.get(`${API_URL}/objetivos/`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
        setObjetivos(response.data);
      } catch (error) {
        console.error('Error fetching objetivos:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    const fetchRecetas = async () => {
      try {
        const response = await axios.get(`${API_URL}/recetas/`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
        setRecetas(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchObjetivos();
    fetchRecetas();
  }, [authTokens, navigate]);

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/ingredientes/`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
        setIngredientesDisponibles(response.data);
      } catch (error) {
        console.error('Error fetching ingredientes:', error);
      }
    };

    fetchIngredientes();
  }, [authTokens]);

  const fetchRecetasFiltradas = async () => {
    try {
      let response;
      if (objetivoSeleccionado) {
        response = await axios.get(`${API_URL}/recetas/objetivo/${objetivoSeleccionado}`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
      } else if (comparacion && parametro && valorParametro) {
        response = await axios.get(`${API_URL}/recetas/${comparacion}/${parametro}/${valorParametro}`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
      } else {
        response = await axios.get(`${API_URL}/recetas/`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
      }
      setRecetas(response.data);
      setPaginaActual(1);
    } catch (error) {
      console.error('Error fetching filtered recipes:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleObjetivoChange = (event) => {
    setObjetivoSeleccionado(event.target.value);
  };

  const handleComparacionChange = (event) => {
    setComparacion(event.target.value);
  };

  const handleParametroChange = (event) => {
    setParametro(event.target.value);
  };

  const handleValorParametroChange = (event) => {
    setValorParametro(event.target.value);
  };

  const handleBuscarClick = () => {
    fetchRecetasFiltradas();
  };

  const indiceUltimoReceta = paginaActual * recetasPorPagina;
  const indicePrimerReceta = indiceUltimoReceta - recetasPorPagina;
  const recetasActuales = recetas.slice(indicePrimerReceta, indiceUltimoReceta);

  const totalPaginas = Math.ceil(recetas.length / recetasPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const editarReceta = (receta) => {
    setRecetaEditando(receta.id_receta);
    setFormData({
      nombre: receta.nombre,
      instrucciones_prep: receta.instrucciones_prep,
      tiempo_coccion: receta.tiempo_coccion,
      calorias_totales: receta.calorias_totales,
      proteinas_totales: receta.proteinas_totales,
      carbohidratos_totales: receta.carbohidratos_totales,
      grasas_totales: receta.grasas_totales,
      azucares_totales: receta.azucares_totales,
      fibra_total: receta.fibra_total,
      sodio_total: receta.sodio_total,
      id_objetivo: receta.id_objetivo,
      ingredientes: receta.ingredientes.map(ing => ({
        id_ingrediente: ing.id_ingrediente,
        nombre: ing.nombre,
        cantidad: ing.recetas_ingredientes.cantidad || 0 // Use the correct quantity
      }))
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBusquedaIngredienteChange = (e) => {
    const { value } = e.target;
    setBusquedaIngrediente(value);
    setIngredientesFiltrados(ingredientesDisponibles.filter(ing => 
      ing.nombre.toLowerCase().includes(value.toLowerCase())
    ));
  };

  const agregarIngrediente = (ingrediente) => {
    setFormData(prevState => ({
      ...prevState,
      ingredientes: [...prevState.ingredientes, { ...ingrediente, cantidad: 0 }]
    }));
    setBusquedaIngrediente('');
    setIngredientesFiltrados([]);
  };

  const eliminarIngrediente = (idIngrediente) => {
    setFormData(prevState => ({
      ...prevState,
      ingredientes: prevState.ingredientes.filter(ing => ing.id_ingrediente !== idIngrediente)
    }));
  };

  const handleIngredienteChange = (idIngrediente, cantidad) => {
    setFormData(prevState => ({
      ...prevState,
      ingredientes: prevState.ingredientes.map(ing =>
        ing.id_ingrediente === idIngrediente ? { ...ing, cantidad } : ing
      )
    }));
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/recetas/id/${recetaEditando}`, {
        ...formData,
        ingredientes: formData.ingredientes.map(ing => ({
          id_ingrediente: ing.id_ingrediente,
          cantidad: ing.cantidad
        }))
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens}`
        }
      });

      const updatedReceta = response.data;

      setRecetas(recetas.map(receta =>
        receta.id_receta === recetaEditando ? updatedReceta : receta
      ));
      setRecetaEditando(null);
    } catch (error) {
      console.error('Error updating recipe:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const cancelarEdicion = () => {
    setRecetaEditando(null);
  };

  const eliminarReceta = async (id) => {
    try {
      await axios.delete(`${API_URL}/recetas/id/${id}`, {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      });
      setRecetas(recetas.filter(receta => receta.id_receta !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const indiceUltimoIngrediente = paginaActual * ingredientesPorPagina;
  const indicePrimerIngrediente = indiceUltimoIngrediente - ingredientesPorPagina;
  const ingredientesActuales = ingredientesFiltrados.slice(indicePrimerIngrediente, indiceUltimoIngrediente);



  const paginarIngredientesFiltrados = () => {
    const indiceUltimoIngrediente = paginaActual * ingredientesPorPagina;
    const indicePrimerIngrediente = indiceUltimoIngrediente - ingredientesPorPagina;
    const ingredientesPaginados = ingredientesFiltrados.slice(indicePrimerIngrediente, indiceUltimoIngrediente);
  };

  useEffect(() => {
    paginarIngredientesFiltrados();
  }, [ingredientesFiltrados, paginaActual]);

return (
  <div className="recetas-admin">
    <div className="recetas-selectors">
      <select className="objetivo-select" value={objetivoSeleccionado} onChange={handleObjetivoChange}>
        <option value="">Todos los Objetivos</option>
        {objetivos.map(objetivo => (
          <option key={objetivo.id_objetivo} value={objetivo.nombre_objetivo}>{objetivo.descripcion}</option>
        ))}
      </select>
      <select className="comparacion-select" value={comparacion} onChange={handleComparacionChange}>
        <option value="">Seleccionar Comparación</option>
        <option value="igual">Igual a</option>
        <option value="mayor">Mayor a</option>
        <option value="menor">Menor a</option>
      </select>
      <select className="parametro-select" value={parametro} onChange={handleParametroChange}>
        <option value="">Seleccionar Parámetro</option>
        <option value="calorias_totales">Calorías Totales</option>
        <option value="proteinas_totales">Proteínas Totales</option>
        <option value="carbohidratos_totales">Carbohidratos Totales</option>
        <option value="grasas_totales">Grasas Totales</option>
        <option value="azucares_totales">Azúcares Totales</option>
        <option value="fibra_total">Fibra Total</option>
        <option value="sodio_total">Sodio Total</option>
      </select>
      <input className="valor-parametro-input" type="number" value={valorParametro} onChange={handleValorParametroChange} placeholder="Valor" />
      <button onClick={handleBuscarClick}>Buscar</button>
    </div>
    <div className="recetas-table-container">
      <table className="recetas-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Objetivo</th>
            <th>Instrucciones</th>
            <th>Calorías Totales</th>
            <th>Carbohidratos Totales</th>
            <th>Grasas Totales</th>
            <th>Azúcares Totales</th>
            <th>Fibra Total</th>
            <th>Sodio Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recetasActuales.map(receta => (
            <tr key={receta.id_receta}>
              <td>{receta.nombre}</td>
              <td>{receta.objetivo ? receta.objetivo.nombre_objetivo : '-'}</td>
              <td>{receta.instrucciones_prep}</td>
              <td>{receta.calorias_totales}</td>
              <td>{receta.carbohidratos_totales}</td>
              <td>{receta.grasas_totales}</td>
              <td>{receta.azucares_totales}</td>
              <td>{receta.fibra_total}</td>
              <td>{receta.sodio_total}</td>
              <td>
                <button onClick={() => editarReceta(receta)} disabled={recetaEditando !== null}>
                  Editar
                </button>
                <button onClick={() => eliminarReceta(receta.id_receta)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="pagination">
      {Array.from({ length: totalPaginas }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => cambiarPagina(index + 1)}
          className={`pagina-button ${paginaActual === index + 1 ? 'active' : ''}`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    {recetaEditando !== null && (
      <div className="editar-receta visible">
        <h2>Editar Receta</h2>
        <form onSubmit={guardarCambios}>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            required
          />
          <label>Instrucciones de Preparación:</label>
          <textarea
            name="instrucciones_prep"
            value={formData.instrucciones_prep}
            onChange={handleFormChange}
            required
          />
          <label>Tiempo de Cocción (minutos):</label>
          <input
            type="number"
            name="tiempo_coccion"
            value={formData.tiempo_coccion}
            onChange={handleFormChange}
            required
          />
          <label>Calorías Totales:</label>
          <input
            type="number"
            name="calorias_totales"
            value={formData.calorias_totales}
            onChange={handleFormChange}
            required
          />
          <label>Proteínas Totales:</label>
          <input
            type="number"
            name="proteinas_totales"
            value={formData.proteinas_totales}
            onChange={handleFormChange}
            required
          />
          <label>Carbohidratos Totales:</label>
          <input
            type="number"
            name="carbohidratos_totales"
            value={formData.carbohidratos_totales}
            onChange={handleFormChange}
            required
          />
          <label>Grasas Totales:</label>
          <input
            type="number"
            name="grasas_totales"
            value={formData.grasas_totales}
            onChange={handleFormChange}
            required
          />
          <label>Azúcares Totales:</label>
          <input
            type="number"
            name="azucares_totales"
            value={formData.azucares_totales}
            onChange={handleFormChange}
            required
          />
          <label>Fibra Total:</label>
          <input
            type="number"
            name="fibra_total"
            value={formData.fibra_total}
            onChange={handleFormChange}
            required
          />
          <label>Sodio Total:</label>
          <input
            type="number"
            name="sodio_total"
            value={formData.sodio_total}
            onChange={handleFormChange}
            required
          />
          <label>Objetivo:</label>
          <select name="id_objetivo" value={formData.id_objetivo} onChange={handleFormChange}>
            <option value="">Seleccionar Objetivo</option>
            {objetivos.map(objetivo => (
              <option key={objetivo.id_objetivo} value={objetivo.id_objetivo}>{objetivo.descripcion}</option>
            ))}
          </select>
          <h3>Ingredientes</h3>
          <div className="busqueda-ingredientes">
            <input
              type="text"
              value={busquedaIngrediente}
              onChange={handleBusquedaIngredienteChange}
              placeholder="Buscar ingrediente"
            />
            <ul>
              {ingredientesActuales.map(ing => (
                <li key={ing.id_ingrediente} onClick={() => agregarIngrediente(ing)}>
                  {ing.nombre}
                </li>
              ))}
            </ul>
          </div>
          <ul className="lista-ingredientes">
            {formData.ingredientes.map(ing => (
              <li key={ing.id_ingrediente}>
                <span>{ing.nombre}</span>
                <input
                  type="number"
                  value={ing.cantidad}
                  onChange={(e) => handleIngredienteChange(ing.id_ingrediente, e.target.value)}
                />
                <button type="button" onClick={() => eliminarIngrediente(ing.id_ingrediente)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={cancelarEdicion}>Cancelar</button>
        </form>
      </div>
    )}
  </div>
);


};

export default VisualizadorRecetas;
