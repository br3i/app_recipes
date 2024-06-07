import { sequelize } from "../database/database.js";
import { Comentarios } from "../models/comentarios.js";
import { Usuarios } from "../models/usuarios.js";

// Obtiene todos los Comentarios
export const getComentarios = async (req, res) => {
  try {
    const comentarios = await Comentarios.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuario', // Alias para la relación
          attributes: ['id_usuario', 'nombre', 'email'] // Atributos que deseas incluir del usuario
        }
      ]
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtiene un comentario por Id de comentario
export const getComentarioId = async (req, res) => {
    try {
        const { id } = req.params;
        const comentarios = await Comentarios.findAll({
        where: { id_comentario: id },
        include: { model: Usuarios, as: 'usuario' }
        });
    
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//  Obtiene un Comentario por ID de usuario
export const getComentarioIdUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const comentarios = await Comentarios.findAll({
        where: { id_usuario: id },
        include: { model: Usuarios, as: 'usuario' }
        });
    
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear un comentario
export const createComentario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {id} = req.params;
    const { nombre, descripcion } = req.body;
    const newComentario = await Comentarios.create({
      id_usuario: id,
      nombre: nombre,
      descripcion: descripcion,
    }, { transaction });

    await transaction.commit();
    res.json(newComentario);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un comentario
export const updateComentario = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const {id} = req.params;
        const userData = req.body;
        const comentario = await Comentarios.findByPk(id, { transaction });

        if(!comentario){
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        comentario.nombre = userData.nombre;
        comentario.descripcion = userData.descripcion;
        await comentario.save({ transaction });
        await transaction.commit();
        res.json(comentario);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
}

// Elimina un comentario por id_comentario
export const deleteComentario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const comentario = await Comentarios.findByPk(id, { transaction });

    if (!comentario) {
      await transaction.rollback();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await comentario.destroy({ transaction });
    await transaction.commit();
    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Elimina comentarios por id_usuario
export const deleteComentariosIdUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const comentarios = await Comentarios.findAll({
      where: {
        id_usuario: id
      },
      transaction
    });

    if (comentarios.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: "No se encontraron comentarios para este usuario" });
    }
    await Comentarios.destroy({
      where: {
        id_usuario: id
      },
      transaction
    });

    await transaction.commit();
    res.json({ message: "Comentarios eliminados" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};