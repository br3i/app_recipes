import UsuariosService from "../services/usuarios.service.js";
import { sequelize } from "../database/database.js";

// Consulta usuarios
export const getUsuarios = async (req, res) => {
  try {
    console.log("Iniciando getUsuarios");
    const usuariosConRelaciones = await UsuariosService.getAllUsuarios();
    console.log("Todos los usuarios procesados con sus relaciones.");
    res.json(usuariosConRelaciones);
  } catch (error) {
    console.error("Error en getUsuarios:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Consulta usuarios por Id
export const getUsuarioID = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuariosService.getUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuarioFiltrado = { ...usuario.dataValues };
    Object.keys(usuarioFiltrado).forEach(key => {
      if (usuarioFiltrado[key] === null) {
        delete usuarioFiltrado[key];
      }
    });

    res.json(usuarioFiltrado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consulta usuarios por tipo_usuario
export const getUsuariosTipo = async (req, res) => {
  try {
    const { tipo_usuario } = req.params;
    const usuariosFiltrados = await UsuariosService.getUsuariosByTipo(tipo_usuario);
    res.json(usuariosFiltrados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userData = req.body;
    //imprimir con console.log el contenido de userData
    console.log("Valores que llegan en el Json");
    console.log(userData);

    const newUsuario = await UsuariosService.createUsuario({
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.contrasena,
      tipo_usuario: userData.tipo_usuario,
      informacion_contacto: userData.informacion_contacto,
      especialidad: userData.especialidad,
    }, transaction);

    await transaction.commit();
    res.json(newUsuario);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un usuario
export const updateUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userData = req.body;

    const updatedUsuario = await UsuariosService.updateUsuario(id, {
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.contrasena,
      tipo_usuario: userData.tipo_usuario,
      informacion_contacto: userData.informacion_contacto,
      especialista: userData.especialista,
    }, transaction);

    await transaction.commit();
    res.json(updatedUsuario);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


// Elimina un usuario
export const deleteUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const deleteResult = await UsuariosService.deleteUsuario(id, transaction);
    await transaction.commit();
    res.json(deleteResult);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
