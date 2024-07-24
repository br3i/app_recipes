import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../utils/recetas.css';
import API_URL from '../components/API_URL';
import { useModal } from '../context/ModalContext'; // Importa useModal


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
  const { showModal, hideModal } = useModal(); // Usa useModal


  const [crearFormData, setCrearFormData] = useState({
    nombre: '',
    instrucciones_prep: '',
    tiempo: '',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    azucares: '',
    fibra: '',
    sodio: '',
    id_objetivo: '',
    ingredientes: []
  });

  const resetCrearForm = () => {
    setCrearFormData({
      nombre: '',
      instrucciones_prep: '',
      tiempo: '',
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: '',
      azucares: '',
      fibra: '',
      sodio: '',
      id_objetivo: '',
      ingredientes: []
    });
  };

  const [formData, setFormData] = useState({
    nombre: '',
    instrucciones_prep: '',
    tiempo: '',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    azucares: '',
    fibra: '',
    sodio: '',
    id_objetivo: '',
    ingredientes: []
  });

  const [orden, setOrden] = useState({ campo: 'nombre', direccion: 'asc' });
  const recetasPorPagina = 10;
  const ingredientesPorPagina = 5;
  const { authTokens } = useAuth();
  const navigate = useNavigate();

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
    } else {
      showModal(<div>{error.response?.data?.error || 'Error obteniendo recetas'}</div>, 3000);
    }
  }
};


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
        }else {
          showModal(<div>{error.response?.data?.error || 'Error obteniendo objetivos'}</div>, 3000);
        }
      }
    };

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
        showModal(<div>{error.response?.data?.error || 'Error obteniendo ingredientes'}</div>, 3000);
      }
    };

    fetchObjetivos();
    fetchRecetas();
    fetchIngredientes();
  }, [authTokens, navigate]);

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
    } else {
      showModal(<div>{error.response?.data?.error || 'Error obteniendo recetas filtradas'}</div>, 3000);
    }
  }
};


  const handleCrearFormChange = (e) => {
    const { name, value } = e.target;
    setCrearFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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

  const resetTabla = () => {
    fetchRecetas();
    setObjetivoSeleccionado('');
    setComparacion('');
    setParametro('');
    setValorParametro('');
    setPaginaActual(1);
  };

const handleSort = (campo) => {
  const direccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
  setOrden({ campo, direccion });

  const sortedRecetas = [...recetas].sort((a, b) => {
    let valorA, valorB;

    if (campo === 'objetivo') {
      valorA = a.objetivo ? a.objetivo.nombre_objetivo.toLowerCase() : '';
      valorB = b.objetivo ? b.objetivo.nombre_objetivo.toLowerCase() : '';
    } else {
      valorA = a[campo] ? a[campo].toString().toLowerCase() : '';
      valorB = b[campo] ? b[campo].toString().toLowerCase() : '';
    }

    if (!valorA && valorB) return direccion === 'asc' ? 1 : -1;
    if (valorA && !valorB) return direccion === 'asc' ? -1 : 1;
    if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
    return 0;
  });

  setRecetas(sortedRecetas);
};


  const indiceUltimoReceta = paginaActual * recetasPorPagina;
  const indicePrimerReceta = indiceUltimoReceta - recetasPorPagina;
  const recetasActuales = recetas.slice(indicePrimerReceta, indiceUltimoReceta);

  const totalPaginas = Math.ceil(recetas.length / recetasPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const editarReceta = (receta) => {
    console.dir(receta);
    setRecetaEditando(receta.id_receta);
    setFormData({
      nombre: receta.nombre,
      instrucciones_prep: receta.instrucciones_prep,
      tiempo_coccion: receta.tiempo_coccion || '', // Asegúrate de asignar tiempo_coccion a tiempo
      calorias: receta.calorias_totales,
      proteinas: receta.proteinas_totales,
      carbohidratos: receta.carbohidratos_totales,
      grasas: receta.grasas_totales,
      azucares: receta.azucares_totales,
      fibra: receta.fibra_total,
      sodio: receta.sodio_total,
      id_objetivo: receta.id_objetivo,
      ingredientes: receta.ingredientes.map(ing => ({
        id_ingrediente: ing.id_ingrediente,
        nombre: ing.nombre,
        cantidad: ing.recetas_ingredientes.cantidad || 0
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

  const agregarIngredienteCrear = (ingrediente) => {
    setCrearFormData(prevState => ({
      ...prevState,
      ingredientes: [...prevState.ingredientes, { ...ingrediente, cantidad: 0 }]
    }));
    setBusquedaIngrediente('');
    setIngredientesFiltrados([]);
  };

  const eliminarIngredienteCrear = (idIngrediente) => {
    setCrearFormData(prevState => ({
      ...prevState,
      ingredientes: prevState.ingredientes.filter(ing => ing.id_ingrediente !== idIngrediente)
    }));
  };

  const handleIngredienteChangeCrear = (idIngrediente, cantidad) => {
    setCrearFormData(prevState => ({
      ...prevState,
      ingredientes: prevState.ingredientes.map(ing =>
        ing.id_ingrediente === idIngrediente ? { ...ing, cantidad } : ing
      )
    }));
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
    fetchRecetas();
    showModal(<div>{response.data.message || 'Receta actualizada con éxito'}</div>, 3000);
  } catch (error) {
    console.error('Error updating recipe:', error);
    if (error.response && error.response.status === 401) {
      navigate('/login');
    } else {
      showModal(<div>{error.response?.data?.error || 'Error actualizando receta'}</div>, 3000);
    }
  }
};


  const cancelarEdicion = () => {
    setRecetaEditando(null);
    setFormData({
      nombre: '',
      instrucciones_prep: '',
      tiempo: '',
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: '',
      azucares: '',
      fibra: '',
      sodio: '',
      id_objetivo: '',
      ingredientes: []
    });
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
      showModal(<div>{error.response?.data?.error || 'Error eliminando la receta'}</div>, 3000);
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

  const crearReceta = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${API_URL}/recetas`, crearFormData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens}`
      }
    });
    console.log('Receta creada:', response.data);
    fetchRecetas();
    resetCrearForm();
    showModal(<div>{response.data.message || 'Receta creada con éxito'}</div>, 3000);
  } catch (error) {
    console.error('Error creating recipe:', error);
    showModal(<div>{error.response?.data?.error || 'Error creando receta'}</div>, 3000);
  }
};


  return (
    <div id="management-recetas-wrapper">
      <h2 id="management-recetas-title">Administrador de Recetas</h2>

      <div id="search-container-administrar-recetas">
        <select id="search-select-recetas" value={objetivoSeleccionado} onChange={handleObjetivoChange}>
          <option value="">Todos los Objetivos</option>
          {objetivos.map(objetivo => (
            <option key={objetivo.id_objetivo} value={objetivo.nombre_objetivo}>{objetivo.nombre_objetivo}</option>
          ))}
        </select>
        <select id="search-comparison-recetas" value={comparacion} onChange={handleComparacionChange}>
          <option value="">Seleccionar Comparación</option>
          <option value="igual">Igual a</option>
          <option value="mayor">Mayor a</option>
          <option value="menor">Menor a</option>
        </select>
        <select id="search-parametro-recetas" value={parametro} onChange={handleParametroChange}>
          <option value="">Seleccionar Parámetro</option>
          <option value="tiempo">Tiempo Total</option>
          <option value="calorias">Calorías Totales</option>
          <option value="proteinas">Proteínas Totales</option>
          <option value="carbohidratos">Carbohidratos Totales</option>
          <option value="grasas">Grasas Totales</option>
          <option value="azucares">Azúcares Totales</option>
          <option value="fibra">Fibra Total</option>
          <option value="sodio">Sodio Total</option>
        </select>
        <input id="search-input-recetas" type="number" value={valorParametro} onChange={handleValorParametroChange} placeholder="Valor" />
        <button id="search-button-administrar-recetas" onClick={handleBuscarClick}>Buscar</button>
        <button id="reset-button-administrar-recetas" onClick={resetTabla}>Restablecer</button>
      </div>

      <div id="management-recetas-table-container">
        <table id="management-recetas-table">
          <thead>
            <tr>
              <th id="sortable-header-nombre" onClick={() => handleSort('nombre')}>Nombre</th>
              <th id="sortable-header-objetivo" onClick={() => handleSort('objetivo')}>Objetivo</th>
              <th id="sortable-header-instrucciones" onClick={() => handleSort('instrucciones_prep')}>Instrucciones</th>
              <th id="sortable-header-tiempo" onClick={() => handleSort('tiempo_coccion')}>Tiempo</th>
              <th id="sortable-header-calorias" onClick={() => handleSort('calorias_totales')}>Calorías</th>
              <th id="sortable-header-carbohidratos" onClick={() => handleSort('carbohidratos_totales')}>Carbohidratos</th>
              <th id="sortable-header-grasas" onClick={() => handleSort('grasas_totales')}>Grasas</th>
              <th id="sortable-header-azucares" onClick={() => handleSort('azucares_totales')}>Azúcares</th>
              <th id="sortable-header-fibra" onClick={() => handleSort('fibra_total')}>Fibra</th>
              <th id="sortable-header-sodio" onClick={() => handleSort('sodio_total')}>Sodio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recetasActuales.map(receta => (
              <tr key={receta.id_receta}>
                <td>{receta.nombre}</td>
                <td>{receta.objetivo ? receta.objetivo.nombre_objetivo : '-'}</td>
                <td>{receta.instrucciones_prep}</td>
                <td>{receta.tiempo_coccion}</td>
                <td>{receta.calorias_totales}</td>
                <td>{receta.carbohidratos_totales}</td>
                <td>{receta.grasas_totales}</td>
                <td>{receta.azucares_totales}</td>
                <td>{receta.fibra_total}</td>
                <td>{receta.sodio_total}</td>
                <td>
                  <button className="btn-rec-editar" onClick={() => editarReceta(receta)} disabled={recetaEditando !== null}>
                    Editar
                  </button>
                  <button className="btn-rec-eliminar" onClick={() => eliminarReceta(receta.id_receta)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => cambiarPagina(index + 1)}
            className={`pagination-button-administrar-recetas ${paginaActual === index + 1 ? 'pagination-button-active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

{recetaEditando === null && (
  <div id="crear-receta-form-container">
    <h3>Crear Nueva Receta</h3>
    <form id="crear-receta-form" onSubmit={crearReceta}>
      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={crearFormData.nombre}
        onChange={handleCrearFormChange}
        required
      />
      <label>Instrucciones de Preparación:</label>
      <textarea
        name="instrucciones_prep"
        value={crearFormData.instrucciones_prep}
        onChange={handleCrearFormChange}
        required
      />
      <label>Tiempo de Cocción (minutos):</label>
      <input
        type="number"
        name="tiempo_coccion"
        value={crearFormData.tiempo_coccion}
        onChange={handleCrearFormChange}
        required
      />
      <label>Objetivo:</label>
      <select name="id_objetivo" value={crearFormData.id_objetivo} onChange={handleCrearFormChange} required>
        <option value="">Seleccionar Objetivo</option>
        {objetivos.map(objetivo => (
          <option key={objetivo.id_objetivo} value={objetivo.id_objetivo}>{objetivo.nombre_objetivo}</option>
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
            <li key={ing.id_ingrediente} onClick={() => agregarIngredienteCrear(ing)}>
              {ing.nombre}
            </li>
          ))}
        </ul>
      </div>
      <ul className="lista-ingredientes">
        {crearFormData.ingredientes.map(ing => (
          <li key={ing.id_ingrediente}>
            <span>{ing.nombre}</span>
            <input
              type="number"
              value={ing.cantidad}
              onChange={(e) => handleIngredienteChangeCrear(ing.id_ingrediente, e.target.value)}
            />
            <button type="button" onClick={() => eliminarIngredienteCrear(ing.id_ingrediente)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={resetCrearForm}>Cancelar</button>
    </form>
  </div>
)}


{recetaEditando !== null && (
  <div id="editar-receta-form-container">
    <h3>Editar Receta</h3>
    <form id="editar-receta-form" onSubmit={guardarCambios}>
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
        name="tiempo_coccion" // Nombre correcto aquí
  value={formData.tiempo_coccion || ''}
        onChange={handleFormChange}
        required
      />
      
      <label>Objetivo:</label>
      <select name="id_objetivo" value={formData.id_objetivo} onChange={handleFormChange} required>
        <option value="">Seleccionar Objetivo</option>
        {objetivos.map(objetivo => (
          <option key={objetivo.id_objetivo} value={objetivo.id_objetivo}>{objetivo.nombre_objetivo}</option>
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