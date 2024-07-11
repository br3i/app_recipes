import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../utils/ingredientes.css';

const API_URL = 'http://localhost:4000';

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
  const ingredientesPorPagina = 7;
  const { authTokens } = useAuth();
  const navigate = useNavigate();
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_URL}/todas_categorias/`, {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        });
        // Mapear el array de strings a objetos con un id generado automáticamente
        const categorias = response.data.map((categoria, index) => ({
          id: index + 1, // Puedes usar un id único, como el índice + 1
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
        setIngredientesFiltrados(response.data); // Inicializar los ingredientes filtrados con todos los ingredientes
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

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

  const handleCategoriaChange = (event) => {
    setCategoriaSeleccionada(event.target.value);
  };

  const indiceUltimoIngrediente = paginaActual * ingredientesPorPagina;
  const indicePrimerIngrediente = indiceUltimoIngrediente - ingredientesPorPagina;
  const ingredientesActuales = ingredientesFiltrados.slice(indicePrimerIngrediente, indiceUltimoIngrediente);

  const totalPaginas = Math.ceil(ingredientesFiltrados.length / ingredientesPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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

      // Actualizar ingredientes y ingredientesFiltrados
      const updatedIngredientes = ingredientes.map(ingrediente =>
        ingrediente.id_ingrediente === ingredienteEditando ? updatedIngrediente : ingrediente
      );

      setIngredientes(updatedIngredientes);
      setIngredientesFiltrados(updatedIngredientes.filter(i => i.categoria === categoriaSeleccionada));
      setIngredienteEditando(null);
    } catch (error) {
      console.error('Error updating ingredient:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const cancelarEdicion = () => {
    setIngredienteEditando(null);
  };

  const eliminarIngrediente = async (id) => {
    try {
      await axios.delete(`${API_URL}/ingredientes/${id}`, {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      });

      // Actualizar ingredientes y ingredientesFiltrados
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

  return (
    <div className="ingredientes-admin">
      <h2 className="ingredientes-title">Administrador de Ingredientes</h2>
      
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

      <div className="ingredientes-table-container">
        <table className="ingredientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Calorías</th>
              <th>Proteínas</th>
              <th>Carbohidratos</th>
              <th>Grasas</th>
              <th>Azúcar</th>
              <th>Fibra</th>
              <th>Sodio</th>
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
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleFormChange}
                      className="categoria-select"
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.nombre}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
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
                      <button onClick={guardarCambios}>Guardar</button>
                      <button onClick={cancelarEdicion}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => editarIngrediente(ingrediente)}>Editar</button>
                  )}
                  <button onClick={() => eliminarIngrediente(ingrediente.id_ingrediente)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index}
            onClick={() => cambiarPagina(index + 1)}
            className={`pagina-button ${paginaActual === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisualizadorIngredientes;
