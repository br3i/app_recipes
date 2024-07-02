import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/espacios.css';

const API_URL = 'http://localhost:3307';

const Espacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [laboratorioId, setLaboratorioId] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentEspacio, setCurrentEspacio] = useState(null);

  useEffect(() => {
    fetchEspacios();
    fetchLaboratorios();
  }, []);

  const fetchEspacios = async () => {
    try {
      const response = await axios.get(`${API_URL}/espacios`);
      setEspacios(response.data);
    } catch (error) {
      console.error('Error fetching espacios:', error);
    }
  };

  const fetchLaboratorios = async () => {
    try {
      const response = await axios.get(`${API_URL}/laboratorios`);
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Error fetching laboratorios:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/espacios/${currentEspacio.id}`, { nombre, descripcion, laboratorio_id: laboratorioId });
      } else {
        await axios.post(`${API_URL}/espacios`, { nombre, descripcion, laboratorio_id: laboratorioId });
      }
      fetchEspacios();
      setNombre('');
      setDescripcion('');
      setLaboratorioId('');
      setEditing(false);
      setCurrentEspacio(null);
    } catch (error) {
      console.error('Error saving espacio:', error);
    }
  };

  const handleEdit = (espacio) => {
    setEditing(true);
    setCurrentEspacio(espacio);
    setNombre(espacio.nombre);
    setDescripcion(espacio.descripcion);
    setLaboratorioId(espacio.laboratorio_id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/espacios/${id}`);
      fetchEspacios();
    } catch (error) {
      console.error('Error deleting espacio:', error);
    }
  };

  const getLaboratorioNombre = (id) => {
    const laboratorio = laboratorios.find(lab => lab.id === id);
    return laboratorio ? laboratorio.nombre : 'Desconocido';
  };

  return (
    <div className="espacios-container">
      <h1>Administrar Espacios</h1>
      <form onSubmit={handleSubmit} className="espacio-form">
        <div className="form-group">
          <label>Nombre</label>
          <input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input type='text' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Laboratorio</label>
          <select value={laboratorioId} onChange={(e) => setLaboratorioId(e.target.value)} required>
            <option value=''>Selecciona un laboratorio</option>
            {laboratorios.map((laboratorio) => (
              <option key={laboratorio.id} value={laboratorio.id}>
                {laboratorio.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className="submit-button">{editing ? 'Actualizar' : 'Agregar'} Espacio</button>
      </form>
      <ul className="espacios-list">
        {espacios.map((espacio) => (
          <li key={espacio.id} className="espacio-item">
            <div className="espacio-info">
              <span><strong>Nombre:</strong> {espacio.nombre}</span>
              <span><strong>Descripción:</strong> {espacio.descripcion}</span>
              <span><strong>Laboratorio:</strong> {getLaboratorioNombre(espacio.laboratorio_id)}</span>
            </div>
            <div className="espacio-actions">
              <button onClick={() => handleEdit(espacio)} className="edit-button">Editar</button>
              <button onClick={() => handleDelete(espacio.id)} className="delete-button">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Espacios;

