import { sequelize } from "../database/database.js";
import { Administradores } from "../models/administradores.js";
import { Nutricionista } from "../models/nutricionistas.js";
import { Usuarios } from "../models/usuarios.js";
import { createAdmin, deleteAdmin, updateAdmin } from "../utilities/utilitiesAdministrador.js";
import { createNutricionista, deleteNutricionista, updateNutricionista } from "../utilities/utilitiesNutricionista.js";

// Consulta usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      include: [
        {
          model: Administradores,
          as: 'administrador', // Alias para la relación
          required: false // Para incluir los usuarios que no son administradores
        },
        {
          model: Nutricionista,
          as: 'nutricionista', // Alias para la relación
          required: false // Para incluir los usuarios que no son nutricionistas
        }
      ]
    });

    // Eliminar keys con null
    const usuariosFiltrados = usuarios.map(usuario => {
      const usuarioFiltrado = { ...usuario.dataValues };

      // Filtrar keys
      Object.keys(usuarioFiltrado).forEach(key => {
        if (usuarioFiltrado[key] === null) {
          delete usuarioFiltrado[key];
        }
      });

      return usuarioFiltrado;
    });

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

    //Crea el nuevo usuario
    const newUsuario = await Usuarios.create({
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.contrasena,
      tipo_usuario: userData.tipo_usuario,
      informacion_contacto: userData.informacion_contacto,
    }, { transaction });

    // Verificar tipo de usuario y realizar acciones adicionales
    switch (userData.tipo_usuario) {
      //Crea el administrador en la tabla administrador
      case 'administrador':
        await createAdmin({
          id_usuario: newUsuario.id_usuario
        }, transaction);
        break;
      //Crea el nutricionista en la tabla nutricionista
      case 'nutricionista':
        await createNutricionista({
          id_usuario: newUsuario.id_usuario,
          especialista: userData.especialista
        }, transaction);
        break;
      default:
        break;
    }

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
    const usuario = await Usuarios.findByPk(id, { transaction });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.nombre = userData.nombre;
    usuario.email = userData.email;
    usuario.contrasena = userData.contrasena;
    usuario.tipo_usuario = userData.tipo_usuario;
    usuario.informacion_contacto = userData.informacion_contacto;
    await usuario.save({ transaction });

    // Verificar tipo de usuario y realizar acciones adicionales
    switch (userData.tipo_usuario) {
      case 'administrador':
        await updateAdmin(usuario.id_usuario, transaction);
        break;
      case 'nutricionista':
        await updateNutricionista(usuario.id_usuario,userData.especialista, transaction);
        break;
      default:
        break;
    }

    await transaction.commit();
    res.json(usuario);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtiene un usuario por ID
/*export const getUsuario = async (req, res) => {
  try {
    const { id */
export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findByPk(id, {
      include: [
        {
          model: Administradores,
          as: 'administrador', // Alias para la relación
          required: false // Para incluir los usuarios que no son administradores
        },
        {
          model: Nutricionista,
          as: 'nutricionista', // Alias para la relación
          required: false // Para incluir los usuarios que no son nutricionistas
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar keys con null
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

// Elimina un usuario
export const deleteUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findByPk(id, { transaction });

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar tipo de usuario y realizar acciones adicionales
    switch (usuario.tipo_usuario) {
      case 'administrador':
        await deleteAdmin(usuario.id_usuario, transaction);
        break;
      case 'nutricionista':
        await deleteNutricionista(usuario.id_usuario, transaction);
        break;
      default:
        break;
    }

    await usuario.destroy({ transaction });
    await transaction.commit();
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};