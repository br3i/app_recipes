import { Op } from "sequelize";
import { Comentarios } from "../models/comentarios.js";

class ComentariosService {
  async getAllComentarios() {
    try {
      console.log('Fetching all comments...');
      const comentarios = await Comentarios.findAll();
      console.log('Fetched comments:', comentarios);
      return comentarios;
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  }

  async getComentarioById(id) {
    try {
      console.log(`Fetching comment with ID: ${id}`);
      const comentario = await Comentarios.findByPk(id);
      if (!comentario) {
        console.log(`Comment with ID: ${id} not found`);
      } else {
        console.log('Fetched comment:', comentario);
      }
      return comentario;
    } catch (error) {
      console.error(`Error fetching comment with ID: ${id}`, error);
      throw error;
    }
  }

  async getComentariosByIdUsuario(idUsuario) {
    try {
      console.log(`Fetching comments for user with ID: ${idUsuario}`);
      const comentarios = await Comentarios.findAll({ where: { id_usuario: idUsuario } });
      console.log('Fetched comments:', comentarios);
      return comentarios;
    } catch (error) {
      console.error(`Error fetching comments for user with ID: ${idUsuario}`, error);
      throw error;
    }
  }

  async getComentariosByNombreUsuario(nombreUsuario) {
    try {
      console.log(`Fetching comments for user with name: ${nombreUsuario}`);
       const comentarios = await Comentarios.findAll({
        where: {
          nombre: {
            [Op.iLike]: nombreUsuario
          }
        }
      });

      console.log('Fetched comments:', comentarios);
      return comentarios;
    } catch (error) {
      console.error(`Error fetching comments for user with name: ${nombreUsuario}`, error);
      throw error;
    }
  }

  async createComentario(comentarioData, transaction) {
    try {
      console.log('Creating new comment with data:', comentarioData);
      const newComentario = await Comentarios.create(comentarioData, { transaction });
      console.log('Created comment:', newComentario);
      return newComentario;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async updateComentarioId(id, comentarioData, transaction) {
    try {
      console.log(`Updating comment with ID: ${id}`);
      const comentario = await Comentarios.findByPk(id, { transaction });
      if (!comentario) {
        throw new Error('Comentario not found');
      }
      console.log('Comment found:', comentario);
      const updatedComentario = await comentario.update(comentarioData, { transaction });
      console.log('Updated comment:', updatedComentario);
      return updatedComentario;
    } catch (error) {
      console.error(`Error updating comment with ID: ${id}`, error);
      throw error;
    }
  }

  async deleteComentarioId(id, transaction) {
    try {
      console.log(`Deleting comment with ID: ${id}`);
      const comentario = await Comentarios.findByPk(id, { transaction });
      if (!comentario) {
        throw new Error('Comentario no encontrado');
      }
      console.log('Comment found:', comentario);
      await comentario.destroy({ transaction });
      console.log(`Comment with ID: ${id} deleted`);
      return { message: 'Comentario eliminado' };
    } catch (error) {
      console.error(`Error deleting comment with ID: ${id}`, error);
      throw error;
    }
  }

  async deleteComentariosByIdUsuario(idUsuario, transaction) {
    try {
      console.log(`Deleting comments for user with ID: ${idUsuario}`);
      const deletedCount = await Comentarios.destroy({ where: { id_usuario: idUsuario }, transaction });
      console.log(`Deleted ${deletedCount} comments for user with ID: ${idUsuario}`);
      return { deletedCount, message: `Se eliminaron ${deletedCount} comentarios del usuario` };
    } catch (error) {
      console.error(`Error deleting comments for user with ID: ${idUsuario}`, error);
      throw error;
    }
  }
}

export default new ComentariosService();
