import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../components/API_URL';
import '../utils/ManagementUsers.css';
import { useModal } from '../context/ModalContext'; // Importa useModal

const ManagementUserComponent = () => {
  const [users, setUsers] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const { showModal, hideModal } = useModal(); // Usa useModal
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo_usuario: '',
    informacion_contacto: '',
    especialidad: '',
  });
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    tipo_usuario: '',
    informacion_contacto: '',
    especialidad: '',
    contrasena: ''
  });
  const [busqueda, setBusqueda] = useState('');
  const [campoBusqueda, setCampoBusqueda] = useState('id');
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ campo: 'id_usuario', direccion: 'asc' });
  const usuariosPorPagina = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
      showModal(<div>{response.data.message || 'Datos de administrador obtenido con éxito'}</div>, 3000); // Línea añadida
    } catch (error) {
      console.error('Error fetching users:', error);
      showModal(<div>{error.response?.data?.error || 'Error obteniendo datos de usuario'}</div>, 3000); // Línea añadida
    }
  };


  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleNuevoUsuarioChange = (event) => {
    setNuevoUsuario({ ...nuevoUsuario, [event.target.name]: event.target.value });
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
      const updatedUsers = users.map((user) => {
        if (user.id_usuario === usuarioEditando) {
          if (formData.tipo_usuario === 'nutricionista') {
            return {
              ...user,
              ...formData,
              nutricionista: {
                ...user.nutricionista,
                especialidad: formData.especialidad
              }
            };
          } else {
            return {
              ...user,
              ...formData,
              nutricionista: null
            };
          }
        }
        return user;
      });
      setUsers(updatedUsers);
      setUsuarioEditando(null);
      setFormData({
        nombre: '',
        email: '',
        tipo_usuario: '',
        informacion_contacto: '',
        especialidad: '',
      });
      showModal(<div>{response.data.message || 'Datos actualizados con éxito'}</div>, 3000); // Línea añadida
    } catch (error) {
      console.error('Error updating user:', error);
      showModal(<div>{error.response?.data?.error || 'Error actualizando datos'}</div>, 3000); // Línea añadida
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

  const eliminarUsuario = async (email) => {
    try {
      http://localhost:4000/usuarios/correo/abb@b.c
      await axios.delete(`${API_URL}/usuarios/correo/${email}`);
      const updatedUsers = users.filter((user) => user.email !== email);
      setUsers(updatedUsers);
      showModal(<div>Usuario eliminado con éxito</div>, 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      showModal(<div>{error.response?.data?.error || 'Error eliminando usuario'}</div>, 3000);
    }
  };

  const handleSort = (campo) => {
    const direccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    setOrden({ campo, direccion });

    const obtenerValor = (usuario, campo) => {
      if (campo === 'especialidad') {
        return usuario.nutricionista ? usuario.nutricionista.especialidad || '' : '';
      }
      return usuario[campo] || '';
    };

    const sortedUsers = [...users].sort((a, b) => {
      const valorA = obtenerValor(a, campo).toString().toLowerCase();
      const valorB = obtenerValor(b, campo).toString().toLowerCase();
      
      if (!valorA && valorB) return direccion === 'asc' ? 1 : -1;
      if (valorA && !valorB) return direccion === 'asc' ? -1 : 1;

      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const buscarUsuarios = async () => {
    try {
      let response;
      switch (campoBusqueda) {
        case 'id':
          response = await axios.get(`${API_URL}/usuarios/id/${busqueda}`);
          setUsers([response.data]);
          break;
        case 'nombre':
          response = await axios.get(`${API_URL}/usuarios/nombre/${busqueda}`);
          setUsers(Array.isArray(response.data) ? response.data : [response.data]);
          break;
        case 'correo':
          response = await axios.get(`${API_URL}/usuarios/correo/${busqueda.toLowerCase()}`);
          setUsers([response.data]);
          break;
        case 'tipo':
          if (busqueda.toLowerCase() === 'cliente') {
            response = await axios.get(`${API_URL}/clientes`);
            const clientesData = response.data.map(cliente => ({
              id_usuario: cliente.id_usuario,
              nombre: cliente.nombre_cliente,
              email: cliente.correo,
              tipo_usuario: 'cliente',
              informacion_contacto: cliente.usuario.informacion_contacto,
              especialidad: '',
            }));
            setUsers(clientesData);
          } else {
            response = await axios.get(`${API_URL}/usuarios/tipo/${busqueda.toLowerCase()}`);
            setUsers(response.data);
          }
          break;
        case 'especialidad':
          response = await axios.get(`${API_URL}/usuarios/especialidad/${busqueda.toLowerCase()}`);
          setUsers(response.data);
          break;
        default:
          fetchUsers();
      }
    } catch (error) {
      console.error('Error searching users:', error);
      showModal(<div>{error.response?.data?.error || 'Error buscando usuarios'}</div>, 3000); // Línea añadida
    }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/usuarios`, nuevoUsuario);
      console.log('Usuario creado:', response.data);
      fetchUsers();
      setNuevoUsuario({
        nombre: '',
        email: '',
        tipo_usuario: '',
        informacion_contacto: '',
        especialidad: '',
        contrasena: ''
      });
      showModal(<div>{response.data.message || 'Usuario creado con éxito'}</div>, 3000); // Línea añadida
    } catch (error) {
      console.error('Error creating user:', error);
      showModal(<div>{error.response?.data?.error || 'Error creando usuario'}</div>, 3000); // Línea añadida
    }
  };

  const resetTabla = () => {
    fetchUsers();
    setBusqueda('');
    setCampoBusqueda('id');
    setPaginaActual(1);
  };

  const indiceUltimoUsuario = paginaActual * usuariosPorPagina;
  const indicePrimerUsuario = indiceUltimoUsuario - usuariosPorPagina;
  const usuariosActuales = users.slice(indicePrimerUsuario, indiceUltimoUsuario);

  const totalPaginas = Math.ceil(users.length / usuariosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div id="management-users-wrapper">
      <h2 id="management-users-title">Administrador de Usuarios</h2>

      <div id="search-container-administrar-usuarios">
        <input
          type="text"
          id="search-input-administrar-usuarios"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
        />
        <select id="search-select-administrar-usuarios" value={campoBusqueda} onChange={(e) => setCampoBusqueda(e.target.value)}>
          <option value="id">ID</option>
          <option value="nombre">Nombre</option>
          <option value="correo">Email</option>
          <option value="tipo">Tipo de Usuario</option>
          <option value="especialidad">Especialidad</option>
        </select>
        <button id="search-button-administrar-usuarios" onClick={buscarUsuarios}>Buscar</button>
        <button id="reset-button-administrar-usuarios" onClick={resetTabla}>Restablecer</button>
      </div>

      <div id="management-users-table-container">
        <table id="management-users-table">
          <thead>
            <tr>
              <th id="sortable-header-id" onClick={() => handleSort('id_usuario')}>ID</th>
              <th id="sortable-header-nombre" onClick={() => handleSort('nombre')}>Nombre</th>
              <th id="sortable-header-email" onClick={() => handleSort('email')}>Email</th>
              <th id="sortable-header-tipo" onClick={() => handleSort('tipo_usuario')}>Tipo de Usuario</th>
              <th id="sortable-header-info" onClick={() => handleSort('informacion_contacto')}>Información de Contacto</th>
              <th id="sortable-header-especialidad" onClick={() => handleSort('especialidad')}>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosActuales.map((usuario) => (
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
                      <button className="btn-mu-editar" onClick={guardarCambios}>Guardar</button>
                      <button className="btn-mu-eliminar" onClick={cancelarEdicion}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-mu-editar" onClick={() => editarUsuario(usuario)}>Editar</button>
                      <button className="btn-mu-eliminar" onClick={() => eliminarUsuario(usuario.email)}>Eliminar</button>
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
            className={`pagination-button-administrar-usuarios ${paginaActual === index + 1 ? 'pagination-button-active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div id="nuevo-usuario-form-container">
        <h3>Crear Nuevo Usuario</h3>
        <form id="nuevo-usuario-form" onSubmit={crearUsuario}>
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleNuevoUsuarioChange}
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            name="email"
            value={nuevoUsuario.email}
            onChange={handleNuevoUsuarioChange}
            placeholder="Email"
            required
          />
          <select
            name="tipo_usuario"
            value={nuevoUsuario.tipo_usuario}
            onChange={handleNuevoUsuarioChange}
            required
          >
            <option value="">Seleccione el tipo de usuario</option>
            <option value="administrador">Administrador</option>
            <option value="nutricionista">Nutricionista</option>
            <option value="cliente">Cliente</option>
          </select>
          <input
            type="text"
            name="informacion_contacto"
            value={nuevoUsuario.informacion_contacto}
            onChange={handleNuevoUsuarioChange}
            placeholder="Información de Contacto"
          />
          {nuevoUsuario.tipo_usuario === 'nutricionista' && (
            <input
              type="text"
              name="especialidad"
              value={nuevoUsuario.especialidad}
              onChange={handleNuevoUsuarioChange}
              placeholder="Especialidad"
            />
          )}
          <input
            type="password"
            name="contrasena"
            value={nuevoUsuario.contrasena}
            onChange={handleNuevoUsuarioChange}
            placeholder="Contraseña"
            required
          />
          <button type="submit" id="btn-crear-usuario">Crear Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default ManagementUserComponent;
