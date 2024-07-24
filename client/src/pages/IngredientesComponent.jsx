import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../utils/ingredientes.css';
import API_URL from '../components/API_URL';

const VisualizadorIngredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [ingredienteEditando, setIngredienteEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    azucar: '',
    fibra: '',
    sodio: ''
  });
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    nombre: '',
    categoria: '',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    azucar: '',
    fibra: '',
    sodio: ''
  });
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarInputNuevaCategoria, setMostrarInputNuevaCategoria] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [campoBusqueda, setCampoBusqueda] = useState('id');
  const [comparacion, setComparacion] = useState('igual');
  const [orden, setOrden] = useState({ campo: 'id_ingrediente', direccion: 'asc' });
  const ingredientesPorPagina = 7;
  const { authTokens } = useAuth();
  const navigate = useNavigate();
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);

  useEffect(() => {
    fetchCategorias();
    fetchIngredientes();
  }, [authTokens, navigate]);

  useEffect(() => {
    const filtrarIngredientesPorCategoria = () => {
      const filtrados = categoriaSeleccionada
        ? ingredientes.filter(i => i.categoria === categoriaSeleccionada)
        : ingredientes;
      setIngredientesFiltrados(filtrados);
      setPaginaActual(1);
    };

    filtrarIngredientesPorCategoria();
  }, [categoriaSeleccionada, ingredientes]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/todas_categorias/`, {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      });
      const categorias = response.data.map((categoria, index) => ({
        id: index + 1,
        nombre: categoria
      }));
      setCategorias(categorias);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
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
      setIngredientes(response.data);
      setIngredientesFiltrados(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCategoriaChange = (event) => {
    setCategoriaSeleccionada(event.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const editarIngrediente = (ingrediente) => {
    setIngredienteEditando(ingrediente.id_ingrediente);
    setFormData({
      nombre: ingrediente.nombre,
      categoria: ingrediente.categoria,
      calorias: ingrediente.calorias,
      proteinas: ingrediente.proteinas,
      carbohidratos: ingrediente.carbohidratos,
      grasas: ingrediente.grasas,
      azucar: ingrediente.azucar,
      fibra: ingrediente.fibra,
      sodio: ingrediente.sodio
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/ingredientes/id/${ingredienteEditando}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens}`
        }
      });

      const updatedIngrediente = response.data;
      const updatedIngredientes = ingredientes.map(ingrediente =>
        ingrediente.id_ingrediente === ingredienteEditando ? updatedIngrediente : ingrediente
      );

      setIngredientes(updatedIngredientes);
      setIngredientesFiltrados(updatedIngredientes.filter(i => i.categoria === categoriaSeleccionada));
      setIngredienteEditando(null);
      setMostrarInputNuevaCategoria(false); 
      await fetchCategorias();
    } catch (error) {
      console.error('Error updating ingredient:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const cancelarEdicion = () => {
    setIngredienteEditando(null);
    setMostrarInputNuevaCategoria(false); 
  };

  const eliminarIngrediente = async (id) => {
    try {
      await axios.delete(`${API_URL}/ingredientes/${id}`, {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      });

      const updatedIngredientes = ingredientes.filter(ingrediente => ingrediente.id_ingrediente !== id);

      setIngredientes(updatedIngredientes);
      setIngredientesFiltrados(updatedIngredientes.filter(i => i.categoria === categoriaSeleccionada));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

const buscarIngredientes = async () => {
  try {
    let response;
    switch (campoBusqueda) {
      case 'id':
        response = await axios.get(`${API_URL}/ingredientes/${busqueda}`);
        setIngredientesFiltrados([response.data]);
        break;
      case 'nombre':
        response = await axios.get(`${API_URL}/ingredientes/nombre/${busqueda}`);
        setIngredientesFiltrados(Array.isArray(response.data) ? response.data : [response.data]);
        break;
      case 'categoria':
        response = await axios.get(`${API_URL}/ingredientes/categoria/${busqueda}`);
        setIngredientesFiltrados(response.data);
        break;
      default:
        response = await axios.get(`${API_URL}/ingredientes/${comparacion}/${campoBusqueda}/${busqueda}`);
        setIngredientesFiltrados(response.data);
    }
    setPaginaActual(1); // Reinicia la paginación a la primera página
  } catch (error) {
    console.error('Error searching ingredients:', error);
  }
};

  const handleSort = (campo) => {
    const direccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    setOrden({ campo, direccion });

    const sortedIngredientes = [...ingredientes].sort((a, b) => {
      const valorA = a[campo] ? a[campo].toString().toLowerCase() : '';
      const valorB = b[campo] ? b[campo].toString().toLowerCase() : '';

      if (!valorA && valorB) return direccion === 'asc' ? 1 : -1;
      if (valorA && !valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });

    setIngredientes(sortedIngredientes);
  };

  const indiceUltimoIngrediente = paginaActual * ingredientesPorPagina;
  const indicePrimerIngrediente = indiceUltimoIngrediente - ingredientesPorPagina;
  const ingredientesActuales = ingredientesFiltrados.slice(indicePrimerIngrediente, indiceUltimoIngrediente);

  const totalPaginas = Math.ceil(ingredientesFiltrados.length / ingredientesPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const handleNuevoIngredienteChange = (e) => {
    const { name, value } = e.target;

    if (name === 'categoria' && value === 'nueva_categoria') {
      setMostrarInputNuevaCategoria(true);
      setNuevoIngrediente(prevState => ({
        ...prevState,
        categoria: 'nueva_categoria'
      }));
    } else if (name === 'categoria') {
      setMostrarInputNuevaCategoria(false);
      setNuevaCategoria('');
      setNuevoIngrediente(prevState => ({
        ...prevState,
        categoria: value
      }));
    } else {
      setNuevoIngrediente(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const crearIngrediente = async (e) => {
    e.preventDefault();
    try {
      const categoria = mostrarInputNuevaCategoria ? nuevaCategoria : nuevoIngrediente.categoria;

      const response = await axios.post(`${API_URL}/ingredientes`, {
        ...nuevoIngrediente,
        categoria,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens}`
        }
      });
      console.log('Ingrediente creado:', response.data);
      fetchIngredientes();
      fetchCategorias();
      setNuevoIngrediente({
        nombre: '',
        categoria: '',
        calorias: '',
        proteinas: '',
        carbohidratos: '',
        grasas: '',
        azucar: '',
        fibra: '',
        sodio: ''
      });
      setNuevaCategoria('');
      setMostrarInputNuevaCategoria(false);
    } catch (error) {
      console.error('Error creating ingredient:', error);
    }
  };

  const resetTabla = () => {
    fetchIngredientes();
    setBusqueda('');
    setCampoBusqueda('id');
    setComparacion('igual');
    setCategoriaSeleccionada('');
    setPaginaActual(1);
  };

  const handleEditCategoriaChange = (event) => {
  if (event.target.value === 'nueva_categoria') {
    setMostrarInputNuevaCategoria(true);
    setFormData(prevState => ({
      ...prevState,
      categoria: ''
    }));
  } else {
    setMostrarInputNuevaCategoria(false);
    setFormData(prevState => ({
      ...prevState,
      categoria: event.target.value
    }));
  }
};

  return (
    <div id="management-ingredientes-wrapper">
      <h2 id="management-ingredientes-title">Administrador de Ingredientes</h2>

      <div id="search-container-administrar-ingredientes">
        <input
          type="text"
          id="search-input-ingredientes"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
        />
        <select id="search-select-ingredientes" value={campoBusqueda} onChange={(e) => setCampoBusqueda(e.target.value)}>
          <option value="">Seleccione un campo</option>
          <option value="id">ID</option>
          <option value="nombre">Nombre</option>
          <option value="categoria">Categoría</option>
          <option value="calorias">Calorías</option>
          <option value="proteinas">Proteínas</option>
          <option value="carbohidratos">Carbohidratos</option>
          <option value="grasas">Grasas</option>
          <option value="azucar">Azúcar</option>
          <option value="fibra">Fibra</option>
          <option value="sodio">Sodio</option>
        </select>
        <select id="search-comparison-ingredientes" value={comparacion} onChange={(e) => setComparacion(e.target.value)}>
          <option value="">Seleccione una comparación</option>
          <option value="igual">Igual</option>
          <option value="mayor">Mayor</option>
          <option value="menor">Menor</option>
        </select>
        <select 
          onChange={handleCategoriaChange} 
          value={categoriaSeleccionada}
          className="categoria-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <button id="search-button-administrar-ingredientes" onClick={buscarIngredientes}>Buscar</button>
        <button id="reset-button-administrar-ingredientes" onClick={resetTabla}>Restablecer</button>
      </div>

      <div id="management-ingredientes-table-container">
        <table id="management-ingredientes-table">
          <thead>
            <tr>
              <th id="sortable-header-id" onClick={() => handleSort('id_ingrediente')}>ID</th>
              <th id="sortable-header-nombre" onClick={() => handleSort('nombre')}>Nombre</th>
              <th id="sortable-header-categoria" onClick={() => handleSort('categoria')}>Categoría</th>
              <th id="sortable-header-calorias" onClick={() => handleSort('calorias')}>Calorías</th>
              <th id="sortable-header-proteinas" onClick={() => handleSort('proteinas')}>Proteínas</th>
              <th id="sortable-header-carbohidratos" onClick={() => handleSort('carbohidratos')}>Carbohidratos</th>
              <th id="sortable-header-grasas" onClick={() => handleSort('grasas')}>Grasas</th>
              <th id="sortable-header-azucar" onClick={() => handleSort('azucar')}>Azúcar</th>
              <th id="sortable-header-fibra" onClick={() => handleSort('fibra')}>Fibra</th>
              <th id="sortable-header-sodio" onClick={() => handleSort('sodio')}>Sodio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientesActuales.map((ingrediente) => (
              <tr key={ingrediente.id_ingrediente}>
                <td>{ingrediente.id_ingrediente}</td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.nombre
                  )}
                </td>
                <td className="td-editable">
  {ingredienteEditando === ingrediente.id_ingrediente ? (
    mostrarInputNuevaCategoria ? (
      <input
        type="text"
        name="categoria"
        value={formData.categoria}
        onChange={handleFormChange}
        placeholder="Nueva Categoría"
      />
    ) : (
      <select
        name="categoria"
        value={formData.categoria}
        onChange={handleEditCategoriaChange}
        className="categoria-select"
      >
        <option value="">Seleccione la categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.nombre}>
            {categoria.nombre}
          </option>
        ))}
        <option value="nueva_categoria">Nueva Categoría</option>
      </select>
    )
  ) : (
    ingrediente.categoria
  )}
</td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="calorias"
                      value={formData.calorias}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.calorias
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="proteinas"
                      value={formData.proteinas}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.proteinas
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="carbohidratos"
                      value={formData.carbohidratos}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.carbohidratos
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="grasas"
                      value={formData.grasas}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.grasas
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="azucar"
                      value={formData.azucar}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.azucar
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="fibra"
                      value={formData.fibra}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.fibra
                  )}
                </td>
                <td className="td-editable">
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <input
                      type="text"
                      name="sodio"
                      value={formData.sodio}
                      onChange={handleFormChange}
                    />
                  ) : (
                    ingrediente.sodio
                  )}
                </td>
                <td>
                  {ingredienteEditando === ingrediente.id_ingrediente ? (
                    <>
                      <button className="btn-ing-editar" onClick={guardarCambios}>Guardar</button>
                      <button className="btn-ing-eliminar" onClick={cancelarEdicion}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-ing-editar" onClick={() => editarIngrediente(ingrediente)}>Editar</button>
                      <button className="btn-ing-eliminar" onClick={() => eliminarIngrediente(ingrediente.id_ingrediente)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index}
            onClick={() => cambiarPagina(index + 1)}
            className={`pagination-button-administrar-ingredientes ${paginaActual === index + 1 ? 'pagination-button-active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div id="nuevo-ingrediente-form-container">
        <h3>Crear Nuevo Ingrediente</h3>
        <form id="nuevo-ingrediente-form" onSubmit={crearIngrediente}>
          <input
            type="text"
            name="nombre"
            value={nuevoIngrediente.nombre}
            onChange={handleNuevoIngredienteChange}
            placeholder="Nombre"
            required
          />
          <select
            name="categoria"
            value={nuevoIngrediente.categoria}
            onChange={handleNuevoIngredienteChange}
            required
          >
            <option value="">Seleccione la categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
            <option value="nueva_categoria">Nueva categoría</option>
          </select>
          {mostrarInputNuevaCategoria && (
            <input
              id='nueva-categoria-ingredientes'
              type="text"
              name="nuevaCategoria"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              placeholder="Nueva categoría"
              required
            />
          )}
          <input
            type="text"
            name="calorias"
            value={nuevoIngrediente.calorias}
            onChange={handleNuevoIngredienteChange}
            placeholder="Calorías"
          />
          <input
            type="text"
            name="proteinas"
            value={nuevoIngrediente.proteinas}
            onChange={handleNuevoIngredienteChange}
            placeholder="Proteínas"
          />
          <input
            type="text"
            name="carbohidratos"
            value={nuevoIngrediente.carbohidratos}
            onChange={handleNuevoIngredienteChange}
            placeholder="Carbohidratos"
          />
          <input
            type="text"
            name="grasas"
            value={nuevoIngrediente.grasas}
            onChange={handleNuevoIngredienteChange}
            placeholder="Grasas"
          />
          <input
            type="text"
            name="azucar"
            value={nuevoIngrediente.azucar}
            onChange={handleNuevoIngredienteChange}
            placeholder="Azúcar"
          />
          <input
            type="text"
            name="fibra"
            value={nuevoIngrediente.fibra}
            onChange={handleNuevoIngredienteChange}
            placeholder="Fibra"
          />
          <input
            type="text"
            name="sodio"
            value={nuevoIngrediente.sodio}
            onChange={handleNuevoIngredienteChange}
            placeholder="Sodio"
          />
          <button type="submit" id="btn-crear-ingrediente">Crear Ingrediente</button>
        </form>
      </div>
    </div>
  );
};

export default VisualizadorIngredientes;
