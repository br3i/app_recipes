import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/laboratorio.css';

const API_URL = 'http://localhost:3307';

const LaboratorioComponent = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Fetching laboratorios...');
    fetchLaboratorios();
  }, []);

  const fetchLaboratorios = async () => {
    try {
      const response = await axios.get(`${API_URL}/laboratorios`);
      console.log('Laboratorios fetched:', response.data);
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Error fetching laboratorios:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        console.log('Updating laboratorio with id:', editId);
        const response = await axios.put(`${API_URL}/laboratorios/${editId}`, {
          nombre,
          capacidad,
          ubicacion,
          descripcion
        });
        console.log('Laboratorio updated:', response.data);
      } else {
        console.log('Creating new laboratorio...');
        const response = await axios.post(`${API_URL}/laboratorios`, {
          nombre,
          capacidad,
          ubicacion,
          descripcion
        });
        console.log('Laboratorio created:', response.data);
      }
      fetchLaboratorios();
      resetForm();
    } catch (error) {
      console.error('Error submitting laboratorio:', error);
      setError('Error submitting laboratorio. Please try again.');
    }
  };

  const handleEdit = (laboratorio) => {
    console.log('Editing laboratorio:', laboratorio);
    setEditMode(true);
    setEditId(laboratorio.id);
    setNombre(laboratorio.nombre);
    setCapacidad(laboratorio.capacidad);
    setUbicacion(laboratorio.ubicacion);
    setDescripcion(laboratorio.descripcion);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting laboratorio with id:', id);
      await axios.delete(`${API_URL}/laboratorios/${id}`);
      fetchLaboratorios();
    } catch (error) {
      console.error('Error deleting laboratorio:', error);
      setError('Error deleting laboratorio. Please try again.');
    }
  };

  const resetForm = () => {
    console.log('Resetting form...');
    setNombre('');
    setCapacidad('');
    setUbicacion('');
    setDescripcion('');
    setEditMode(false);
    setEditId(null);
    setError('');
  };

return (
    <div className="laboratorio-container">
      <h1>Gestión de Laboratorios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="laboratorio-form">
        <div>
          <label>Nombre</label>
          <input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Capacidad</label>
          <input type='number' value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
        </div>
        <div>
          <label>Ubicación</label>
          <input type='text' value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
        </div>
        <div>
          <label>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <button type='submit'>{editMode ? 'Actualizar' : 'Agregar'}</button>
        {editMode && <button type='button' onClick={resetForm}>Cancelar</button>}
      </form>
      <h2>Lista de Laboratorios</h2>
      <table className="laboratorio-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {laboratorios.map((laboratorio) => (
            <tr key={laboratorio.id}>
              <td>{laboratorio.nombre}</td>
              <td>{laboratorio.capacidad}</td>
              <td>{laboratorio.ubicacion}</td>
              <td>{laboratorio.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(laboratorio)}>Editar</button>
                <button onClick={() => handleDelete(laboratorio.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default LaboratorioComponent;
