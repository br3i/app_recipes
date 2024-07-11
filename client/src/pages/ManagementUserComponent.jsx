import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const ManagementUserComponent = () => {
  const [users, setUsers] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo_usuario: '',
    informacion_contacto: '',
    especialidad: '', // Solo para nutricionistas
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/usuarios`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario.id_usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      informacion_contacto: usuario.informacion_contacto,
      especialidad: usuario.nutricionista ? usuario.nutricionista.especialidad : '',
    });
  };

  const guardarCambios = async () => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/id/${usuarioEditando}`, formData);
      console.log('Usuario actualizado:', response.data);
      // Actualizar la lista de usuarios después de guardar cambios
      const updatedUsers = users.map((user) =>
        user.id_usuario === usuarioEditando ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setUsuarioEditando(null);
      setFormData({
        nombre: '',
        email: '',
        tipo_usuario: '',
        informacion_contacto: '',
        especialidad: '',
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const cancelarEdicion = () => {
    setUsuarioEditando(null);
    setFormData({
      nombre: '',
      email: '',
      tipo_usuario: '',
      informacion_contacto: '',
      especialidad: '',
    });
  };

  const eliminarUsuario = async (idUsuario) => {
    try {
      await axios.delete(`${API_URL}/usuarios/${idUsuario}`);
      const updatedUsers = users.filter((user) => user.id_usuario !== idUsuario);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="ingredientes-admin">
      <h2 className="ingredientes-title">Administrador de Usuarios</h2>

      <div className="ingredientes-table-container">
        <table className="ingredientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Tipo de Usuario</th>
              <th>Información de Contacto</th>
              <th>Especialidad</th> {/* Mostrar solo para nutricionistas */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td className="td-editable">
                  {usuarioEditando === usuario.id_usuario ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                    />
                  ) : (
                    usuario.nombre
                  )}
                </td>
                <td className="td-editable">
                  {usuarioEditando === usuario.id_usuario ? (
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  ) : (
                    usuario.email
                  )}
                </td>
                <td className="td-editable">
                  {usuarioEditando === usuario.id_usuario ? (
                    <select
                      name="tipo_usuario"
                      value={formData.tipo_usuario}
                      onChange={handleFormChange}
                    >
                      <option value="administrador">Administrador</option>
                      <option value="nutricionista">Nutricionista</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  ) : (
                    usuario.tipo_usuario
                  )}
                </td>
                <td className="td-editable">
                  {usuarioEditando === usuario.id_usuario ? (
                    <input
                      type="text"
                      name="informacion_contacto"
                      value={formData.informacion_contacto}
                      onChange={handleFormChange}
                    />
                  ) : (
                    usuario.informacion_contacto
                  )}
                </td>
                <td className="td-editable">
                  {usuario.tipo_usuario === 'nutricionista' && usuarioEditando === usuario.id_usuario ? (
                    <input
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleFormChange}
                    />
                  ) : usuario.tipo_usuario === 'nutricionista' ? (
                    usuario.nutricionista ? (
                      usuario.nutricionista.especialidad
                    ) : (
                      ''
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {usuarioEditando === usuario.id_usuario ? (
                    <>
                      <button onClick={guardarCambios}>Guardar</button>
                      <button onClick={cancelarEdicion}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => editarUsuario(usuario)}>Editar</button>
                      <button onClick={() => eliminarUsuario(usuario.id_usuario)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagementUserComponent;
