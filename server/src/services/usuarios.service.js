import { Usuarios } from "../models/usuarios.js";
import { Administradores } from "../models/administradores.js";
import { Nutricionista } from "../models/nutricionistas.js";
import { createAdmin, deleteAdminId, deleteAdminEmail, updateAdminId, updateAdminEmail } from "../utilities/utilitiesAdministrador.js";
import { createNutricionista, deleteNutricionistaId, deleteNutricionistaEmail, updateNutricionistaId, updateNutricionistaEmail } from "../utilities/utilitiesNutricionista.js";

class UsuariosService {
  async getAllUsuarios() {
    try {
      console.log('Fetching all users...');
      const usuarios = await Usuarios.findAll();
      console.log('Fetched users:', usuarios);

      const usuariosConRelaciones = await Promise.all(
        usuarios.map(async (usuario) => {
          let include = [];
          switch (usuario.tipo_usuario) {
            case 'administrador':
              include.push({ model: Administradores, as: 'administrador', required: true });
              break;
            case 'nutricionista':
              include.push({ model: Nutricionista, as: 'nutricionista', required: true });
              break;
            default:
              break;
          }
          const usuarioConRelacion = await Usuarios.findByPk(usuario.id_usuario, { include });
          return usuarioConRelacion;
        })
      );
      return usuariosConRelaciones;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getUsuarioById(id) {
    console.log(`Fetching user with ID: ${id}`);
    const usuario = await Usuarios.findByPk(id, {
      include: [
        { model: Administradores, as: 'administrador', required: false },
        { model: Nutricionista, as: 'nutricionista', required: false }
      ]
    });
    if (!usuario) {
      console.log(`User with ID: ${id} not found`);
    } else {
      console.log('Fetched user:', usuario);
    }
    return usuario;
  }

  async getUsuarioByEmail(email) {
    console.log(`Fetching user with email: ${email}`);
    const usuario = await Usuarios.findOne({where: { email },
      include: [
        { model: Administradores, as: 'administrador', required: false },
        { model: Nutricionista, as: 'nutricionista', required: false }
      ]
    });
    if (!usuario) {
      console.log(`User with email: ${email} not found`);
    } else {
      console.log('Fetched user:', usuario);
    }
    return usuario;
  }

    async getUsuariosByNombre(nombre) {
    console.log(`Fetching user with nombre: ${nombre}`);
    const usuario = await Usuarios.findOne({where: { nombre },
      include: [
        { model: Administradores, as: 'administrador', required: false },
        { model: Nutricionista, as: 'nutricionista', required: false }
      ]
    });
    if (!usuario) {
      console.log(`User with nombre: ${nombre} not found`);
    } else {
      console.log('Fetched user:', usuario);
    }
    return usuario;
  }


  async getUsuariosByTipo(tipo_usuario) {
    try {
      console.log(`Fetching users with type: ${tipo_usuario}`);
      let include = [];
      switch (tipo_usuario) {
        case 'administrador':
          include.push({ model: Administradores, as: 'administrador', required: true });
          break;
        case 'nutricionista':
          include.push({ model: Nutricionista, as: 'nutricionista', required: true });
          break;
        default:
          throw new Error(`Tipo de usuario no reconocido: ${tipo_usuario}`);
      }
      const usuarios = await Usuarios.findAll({ where: { tipo_usuario }, include });
      console.log('Fetched users by type:', usuarios);
      return usuarios;
    } catch (error) {
      console.error(`Error fetching users with type: ${tipo_usuario}`, error);
      throw error;
    }
  }

  async getUsuariosByEspecialidad(especialidad) {
    try {
      console.log(`Fetching users with especialidad: ${especialidad}`);
      const usuarios = await Usuarios.findAll({
        include: [
          {
            model: Nutricionista,
            as: 'nutricionista',
            where: { especialidad },
            required: true // Cambia a false si quieres que no sea obligatorio tener una especialidad
          }
        ]
      });

      console.log('Fetched users by especialidad:', usuarios.map(user => user.toJSON()));
      return usuarios;
    } catch (error) {
      console.error(`Error fetching users with especialidad: ${especialidad}`, error);
      throw error;
    }
  }

  async createUsuario(usuarioData, transaction) {
    try {

       const validUserTypes = ['administrador', 'nutricionista'];
    if (!validUserTypes.includes(usuarioData.tipo_usuario)) {
      throw new Error(`Tipo de usuario inválido: ${usuarioData.tipo_usuario}`);
    }
    
      console.log('Creating new user with data:', usuarioData);
      const newUsuario = await Usuarios.create(usuarioData, { transaction });

      switch (usuarioData.tipo_usuario) {
        case 'administrador':
          await createAdmin({ id_usuario: newUsuario.id_usuario }, transaction);
          console.log(`Created admin for user ID: ${newUsuario.id_usuario}`);
          break;
        case 'nutricionista':
          await createNutricionista({ id_usuario: newUsuario.id_usuario, especialidad: usuarioData.especialidad }, transaction);
          console.log(`Created nutritionist for user ID: ${newUsuario.id_usuario}`);
          break;
        default:
          break;
      }
      console.log('Created user:', newUsuario);
      return newUsuario;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUsuarioById(id, usuarioData, transaction) {
    try {
      console.log(`Updating user with ID: ${id}`);
      console.log(`Datos que llegan: ${JSON.stringify(usuarioData)}`);
      const usuario = await Usuarios.findByPk(id, { transaction });

      if (!usuario) {
        throw new Error('Usuario not found');
      }

      await usuario.update(usuarioData, { transaction });

      switch (usuarioData.tipo_usuario) {
        case 'administrador':
          await updateAdminId(usuario.id_usuario, transaction);
          console.log(`Updated admin for user ID: ${id}`);
          break;
        case 'nutricionista':
          await updateNutricionistaId(usuario.id_usuario, usuarioData.especialidad, transaction);
          console.log(`Updated nutritionist for user ID: ${id}`);
          break;
        default:
          break;
      }
      console.log('Updated user:', usuario);
      return usuario;
    } catch (error) {
      console.error(`Error updating user with ID: ${id}`, error);
      throw error;
    }
  }

  async updateUsuarioByEmail(email, usuarioData, transaction) {
    try {
      console.log(`Updating user with email: ${email}`);
      const usuario = await Usuarios.findOne({ where: { email } }, { transaction });

      if (!usuario) {
        throw new Error('Usuario not found');
      }

      await usuario.update(usuarioData, { transaction });

      switch (usuarioData.tipo_usuario) {
        case 'administrador':
          await updateAdminEmail(usuario.id_usuario, transaction);
          console.log(`Updated admin for user email: ${email}`);
          break;
        case 'nutricionista':
          await updateNutricionistaEmail(usuario.id_usuario, usuarioData.especialista, transaction);
          console.log(`Updated nutritionist for user email: ${email}`);
          break;
        default:
          break;
      }

      console.log('Updated user:', usuario);
      return usuario;
    } catch (error) {
      console.error(`Error updating user with email: ${email}`, error);
      throw error;
    }
  }

  async deleteUsuarioId(id, transaction) {
    try {
      console.log(`Deleting user with ID: ${id}`);
      const usuario = await Usuarios.findByPk(id, { transaction });

      if (!usuario) {
        throw new Error('Usuario not found');
      }

      switch (usuario.tipo_usuario) {
        case 'administrador':
          await deleteAdminId(usuario.id_usuario, transaction);
          console.log(`Deleted admin for user ID: ${id}`);
          break;
        case 'nutricionista':
          await deleteNutricionistaId(usuario.id_usuario, transaction);
          console.log(`Deleted nutritionist for user ID: ${id}`);
          break;
        default:
          break;
      }

      await usuario.destroy({ transaction });
      console.log(`User with ID: ${id} deleted`);
      return { message: 'Usuario eliminado' };
    } catch (error) {
      console.error(`Error deleting user with ID: ${id}`, error);
      throw error;
    }
  }

  async deleteUsuarioEmail(email, transaction) {
    try {
      console.log(`Deleting user with email: ${email}`);
      const usuario = await Usuarios.findOne({ where: { email } }, { transaction });

      if (!usuario) {
        throw new Error('Usuario not found');
      }

      switch (usuario.tipo_usuario) {
        case 'administrador':
          await deleteAdminId(usuario.id_usuario, transaction);
          console.log(`Deleted admin for user witj email: ${email}`);
          break;
        case 'nutricionista':
          await deleteNutricionistaId(usuario.id_usuario, transaction);
          console.log(`Deleted nutritionist for user with email: ${email}`);
          break;
        default:
          break;
      }

      await usuario.destroy({ transaction });
      console.log(`User with email: ${email} deleted`);
      return { message: 'Usuario eliminado' };
    } catch (error) {
      console.error(`Error deleting user with ID: ${email}`, error);
      throw error;
    }
  }
}

export default new UsuariosService();
