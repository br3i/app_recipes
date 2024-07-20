import { sequelize } from "../database/database.js";
import { trim } from "../utilities/trim.js";
import ComentariosService from '../services/comentarios.service.js';
import usuariosService from "../services/usuarios.service.js";

// Obtener todos los comentarios
export const getComentarios = async (req, res) => {
  try {
    console.log('GET /comentarios');
    const comentarios = await ComentariosService.getAllComentarios();
    console.log('Sending response with comments:', comentarios);
    res.json(comentarios);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un comentario por ID
export const getComentarioId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /comentarios/id/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const comentario = await ComentariosService.getComentarioById(trim(id));

    if (!comentario) {
      console.log(`Comment with ID: ${id} not found`);
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    console.log('Sending response with comment:', comentario);
    res.json(comentario);
  } catch (error) {
    console.error(`Error fetching comment with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener comentarios por ID de usuario
export const getComentariosIdUsuario = async (req, res) => {
  try {
    const { idU } = req.params;
    console.log(`GET /comentarios/idU/${idU}`);
    const comentarios = await ComentariosService.getComentariosByIdUsuario(trim(idU));
    
    if (comentarios.length === 0) {
      console.log(`Comment with user ID: ${idU} not found`);
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    
    console.log('Sending response with comments:', comentarios);
    res.json(comentarios);
  } catch (error) {
    console.error(`Error fetching comments for user ID: ${req.body.idU}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener comentarios por nombre de usuario
export const getComentariosNombreUsuario = async (req, res) => {
  try {
    const { nombreU } = req.params;
    console.log(`GET /comentarios/nombreU/${nombreU}`);
    const comentarios = await ComentariosService.getComentariosByNombreUsuario(trim(nombreU));
    
    if (comentarios.length === 0) {
      console.log(`Comentarios con nombre de usuario ${nombreU} no encontrados`);
      return res.status(404).json({ error: 'Comentarios no encontrados' });
    }

    console.log('Sending response with comments:', comentarios);
    res.json(comentarios);
  } catch (error) {
    console.error(`Error fetching comments for user name: ${req.body.nombreU}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un comentario
export const createComentario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    console.log(`POST /comentarios/${id}`);
    console.log('Request body:', req.body);
    
    if (Array.isArray(req.body)) {
      throw new Error('Solo se puede crear un comentario a la vez.');
    }

    const usuario = await usuariosService.getUsuarioById(trim(id));
    if (!usuario) {
      throw new Error('El usuario no existe.');
    }
    
    const newComentario = await ComentariosService.createComentario({
      id_usuario: trim(id),
      nombre: trim(nombre),
      descripcion: trim(descripcion),
    }, transaction);

    await transaction.commit();
    console.log('Created comment:', newComentario);
    res.json({ message: 'Comentario creado exitosamente', comentario: newComentario });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un comentario por ID
export const updateComentarioId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { id_usuario } = req.body;
    const comentarioData = req.body;

    console.log(`PUT /comentarios/id/${id}`);
    console.log('Request body:', comentarioData);
    console.log('id_usuario:', id_usuario);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }
    
    if (Array.isArray(comentarioData)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un único objeto de datos del comentario nutricional' });
    }

    const usuario = await usuariosService.getUsuarioById(id_usuario);
    if (!usuario) {
      throw new Error('El usuario al que se desea asociar no existe.');
    }

    const updatedComentario = await ComentariosService.updateComentarioId(trim(id), comentarioData, transaction);

    if (!updatedComentario) {
      await transaction.rollback();
      console.log(`Comentario con ID: ${id} no encontrado`);
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    await transaction.commit();
    console.log('Updated comment:', updatedComentario);
    res.json({ message: 'Comentario editado exitosamente', comentario: updatedComentario });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un comentario por ID
export const deleteComentarioId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /comentarios/id/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const deletedMessage = await ComentariosService.deleteComentarioId(trim(id), transaction);

    if (!deletedMessage || deletedMessage.error) {
      console.log(`Comentario con ID: ${id} no encontrado`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    await transaction.commit();
    console.log('Deleted comment:', deletedMessage);
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar comentarios por ID de usuario
export const deleteComentariosIdUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idU } = req.params;
    console.log(`DELETE /comentarios/idU/${idU}`);

    if (!/^\d+$/.test(trim(idU))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const deletedMessage = await ComentariosService.deleteComentariosByIdUsuario(trim(idU), transaction);

    if (!deletedMessage || deletedMessage.error || deletedMessage.deletedCount === 0) {
      console.log(`Comentarios con ID de usuario: ${trim(idU)} no encontrados`);
      await transaction.rollback();
      return res.status(404).json({ error: `Comentarios con ID de usuario: ${trim(idU)} no encontrados` });
    }

    await transaction.commit();
    console.log('Deleted comments for user:', deletedMessage);
    res.json({ message: 'Comentarios eliminados' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting comments for user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Enviar comentario por correo electrónico
export const sendComment = async (req, res) => {
  try {
    const { email, message } = req.body;
    console.log(`POST /comentarios/sendComment to ${email}`);
    
    if (!email || !message) {
      return res.status(400).json({ error: 'El correo electrónico y el mensaje son requeridos' });
    }

    const response = await ComentariosService.sendComment(email, message);
    console.log('Email sent:', response);
    res.json(response);
  } catch (error) {
    console.error('Error sending comment email:', error);
    res.status(500).json({ error: error.message });
  }
};
