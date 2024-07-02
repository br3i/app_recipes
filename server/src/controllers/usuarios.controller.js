import { sequelize } from "../database/database.js";
import { trim } from "../utilities/trim.js";
import UsuariosService from "../services/usuarios.service.js";

import bcrypt from "bcryptjs";

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = req.body; // Suponiendo que req.body puede ser un array o un objeto
    console.log("Valores que llegan en el Json", data);

    const usuariosArray = Array.isArray(data) ? data : [data]; // Convertir a array si es un solo objeto
    const createdUsuarios = [];
    const failedUsuarios = [];

    for (const userData of usuariosArray) {
      const { nombre, email, contrasena, tipo_usuario, informacion_contacto, especialidad } = userData;

      try {
        // Verificar si el usuario ya existe antes de intentar crearlo
        const existingUsuario = await UsuariosService.getUsuarioByEmail(email);
        if (existingUsuario) {
          failedUsuarios.push(email);
          continue; // Saltar la creación si ya existe
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const newUsuario = await UsuariosService.createUsuario({
          nombre,
          email,
          contrasena: hashedPassword,
          tipo_usuario,
          informacion_contacto,
          especialidad
        }, transaction);

        createdUsuarios.push(newUsuario);
      } catch (error) {
        console.error(`Error creating user ${email}:`, error);
        failedUsuarios.push(email);
      }
    }

    await transaction.commit();

    let responseMessage = {};

    if (failedUsuarios.length > 0) {
      responseMessage.error = `Existió errores al crear algunos usuarios. Estos usuarios no se insertaron en la base de datos: ${failedUsuarios.join(', ')}`;
    }

    if (createdUsuarios.length > 0) {
      responseMessage.exito = `Estos usuarios se crearon: ${createdUsuarios.map(user => user.email).join(', ')}`;
    }

    if (failedUsuarios.length > 0 && createdUsuarios.length > 0) {
      res.status(207).json(responseMessage);
    } else if (failedUsuarios.length > 0) {
      res.status(400).json(responseMessage);
    } else {
      res.json(responseMessage);
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating users:', error);
    res.status(500).json({ error: error.message });
  }
};

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

// Obtener usuario por ID
export const getUsuarioID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /usuarios/id/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const usuario = await UsuariosService.getUsuarioById(trim(id));
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
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por correo
export const getUsuarioEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`GET /usuarios/correo/${email}`);

    const usuario = await UsuariosService.getUsuarioByEmail(trim(email));
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por nombre
export const getUsuarioNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /usuarios/nombre/${nombre}`);

    const usuarios = await UsuariosService.getUsuariosByNombre(trim(nombre));
    if (!usuarios) {
      return res.status(404).json({ error: "Usuarios no encontrados" });
    }

    res.json(usuarios);
  } catch (error) {
    console.error('Error fetching users by name:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuarios por tipo de usuario
export const getUsuariosTipo = async (req, res) => {
  try {
    const { tipo_usuario } = req.params;
    console.log(`GET /usuarios/tipo/${tipo_usuario}`);

    const usuariosFiltrados = await UsuariosService.getUsuariosByTipo(trim(tipo_usuario));
    res.json(usuariosFiltrados);
  } catch (error) {
    console.error('Error fetching users by type:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuarios por especialidad
export const getUsuariosEspecialidad = async (req, res) => {
  try {
    const { especialidad } = req.params;
    console.log(`GET /usuarios/especialidad/${especialidad}`);

    const usuariosFiltrados = await UsuariosService.getUsuariosByEspecialidad(trim(especialidad));
    if(usuariosFiltrados.length === 0){
      return res.status(404).json({ error: "Usuarios no encontrados" });
    }

    res.json(usuariosFiltrados);   
  } catch (error) {
    console.error('Error fetching users by specialty:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario por ID
export const updateUsuarioId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userData = req.body;
    console.log(`PUT /usuarios/id/${id}`, userData);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
    const updatedUsuario = await UsuariosService.updateUsuarioById(trim(id), {
      nombre: userData.nombre,
      email: userData.email,
      contrasena: hashedPassword,
      tipo_usuario: userData.tipo_usuario,
      informacion_contacto: userData.informacion_contacto,
      especialidad: userData.especialidad,
    }, transaction);

    await transaction.commit();
    res.json(updatedUsuario);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating user by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario por correo
export const updateUsuarioEmail = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email } = req.params;
    const userData = req.body;
    console.log(`PUT /usuarios/correo/${email}`, userData);

    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
    const updatedUsuario = await UsuariosService.updateUsuarioByEmail(trim(email), {
      nombre: userData.nombre,
      contrasena: hashedPassword,
      tipo_usuario: userData.tipo_usuario,
      informacion_contacto: userData.informacion_contacto,
      especialidad: userData.especialidad,
    }, transaction);

    await transaction.commit();
    res.json(updatedUsuario);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating user by email:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario por ID
export const deleteUsuarioById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /usuarios/id/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const deleteResult = await UsuariosService.deleteUsuarioId(trim(id), transaction);
    await transaction.commit();

    if (!deleteResult) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario por correo
export const deleteUsuarioByEmail = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email } = req.params;
    console.log(`DELETE /usuarios/correo/${email}`);

    const deleteResult = await UsuariosService.deleteUsuarioEmail(trim(email), transaction);
    await transaction.commit();

    if (!deleteResult) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting user by email:', error);
    res.status(500).json({ error: error.message });
  }
};

// Autenticación (Login)
export const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`Login attempt with email: ${email} y contraseña: ${contrasena}`);
    
    if (!email || !contrasena) {
      console.log('Email or password not provided');
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const usuario = await UsuariosService.getUsuarioByEmail(email);
    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!usuario.contrasena) {
      console.log('Contraseña no encontrada para el usuario');
      return res.status(400).json({ error: "Contraseña no encontrada para el usuario" });
    }

    console.log('Fetched user:', usuario);
    console.log('Comparing passwords:', contrasena, usuario.contrasena);

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", usuario });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const usuario = await UsuariosService.getUsuarioById(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(oldPassword, usuario.contrasena);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UsuariosService.updateUsuario(id, { contrasena: hashedNewPassword }, transaction);

    await transaction.commit();
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting user by email:', error);
    res.status(500).json({ error: error.message });
  }
};