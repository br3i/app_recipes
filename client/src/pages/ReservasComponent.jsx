import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../utils/reservas.css';

const API_URL = 'http://localhost:3307';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [laboratorioId, setLaboratorioId] = useState('');
  const [espacioId, setEspacioId] = useState('');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tipoReserva, setTipoReserva] = useState('');
  const [estado, setEstado] = useState('');
  const [cantidadEquipos, setCantidadEquipos] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservas`);
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reservaData = {
        usuario_id: usuarioId,
        laboratorio_id: laboratorioId,
        espacio_id: espacioId,
        fecha_reserva: fechaReserva,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        tipo_reserva: tipoReserva,
        estado,
        cantidad_equipos: cantidadEquipos,
      };

      if (editing) {
        await axios.put(`${API_URL}/reservas/${currentReserva.id}`, reservaData);
      } else {
        await axios.post(`${API_URL}/reservas`, reservaData);
      }
      fetchReservas();
      setUsuarioId('');
      setLaboratorioId('');
      setEspacioId('');
      setFechaReserva('');
      setHoraInicio('');
      setHoraFin('');
      setTipoReserva('');
      setEstado('');
      setCantidadEquipos('');
      setEditing(false);
      setCurrentReserva(null);
    } catch (error) {
      console.error('Error saving reserva:', error);
    }
  };

  const handleEdit = (reserva) => {
    setEditing(true);
    setCurrentReserva(reserva);
    setUsuarioId(reserva.usuario_id);
    setLaboratorioId(reserva.laboratorio_id);
    setEspacioId(reserva.espacio_id);
    setFechaReserva(reserva.fecha_reserva);
    setHoraInicio(reserva.hora_inicio);
    setHoraFin(reserva.hora_fin);
    setTipoReserva(reserva.tipo_reserva);
    setEstado(reserva.estado);
    setCantidadEquipos(reserva.cantidad_equipos);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reservas/${id}`);
      fetchReservas();
    } catch (error) {
      console.error('Error deleting reserva:', error);
    }
  };

  return (
    <div className="reservas-container">
      <h1>Administrar Reservas</h1>
      <form onSubmit={handleSubmit} className="reserva-form">
        <div className="form-group">
          <label>Usuario ID</label>
          <input type="number" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Laboratorio ID</label>
          <input type="number" value={laboratorioId} onChange={(e) => setLaboratorioId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Espacio ID</label>
          <input type="number" value={espacioId} onChange={(e) => setEspacioId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha Reserva</label>
          <input type="date" value={fechaReserva} onChange={(e) => setFechaReserva(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hora Inicio</label>
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hora Fin</label>
          <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Tipo Reserva</label>
          <input type="text" value={tipoReserva} onChange={(e) => setTipoReserva(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Cantidad de Equipos</label>
          <input type="number" value={cantidadEquipos} onChange={(e) => setCantidadEquipos(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button">{editing ? 'Actualizar' : 'Agregar'} Reserva</button>
      </form>
      <ul className="reservas-list">
        {reservas.map((reserva) => (
          <li key={reserva.id} className="reserva-item">
            <div className="reserva-info">
              <span><strong>Fecha:</strong> {reserva.fecha_reserva}</span>
              <span><strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_fin}</span>
              <span><strong>Tipo:</strong> {reserva.tipo_reserva}</span>
              <span><strong>Estado:</strong> {reserva.estado}</span>
              <span><strong>Equipos:</strong> {reserva.cantidad_equipos}</span>
            </div>
            <div className="reserva-actions">
              <button onClick={() => handleEdit(reserva)} className="edit-button">Editar</button>
              <button onClick={() => handleDelete(reserva.id)} className="delete-button">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservas;

