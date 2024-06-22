import { Usuarios } from "../models/usuarios.js";
import { Administradores } from "../models/administradores.js";
import { Nutricionista } from "../models/nutricionistas.js";
import { createAdmin, deleteAdmin, updateAdmin } from "../utilities/utilitiesAdministrador.js";
import { createNutricionista, deleteNutricionista, updateNutricionista } from "../utilities/utilitiesNutricionista.js";

class UsuariosService {
  async getAllUsuarios() {
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

  async getUsuariosByTipo(tipo_usuario) {
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
  }

  async createUsuario(usuarioData, transaction) {
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
  }

  async updateUsuario(id, usuarioData, transaction) {
    console.log(`Updating user with ID: ${id}`);
    const usuario = await Usuarios.findByPk(id, { transaction });

    if (!usuario) {
      throw new Error('Usuario not found');
    }

    await usuario.update(usuarioData, { transaction });

    switch (usuarioData.tipo_usuario) {
      case 'administrador':
        await updateAdmin(usuario.id_usuario, transaction);
        console.log(`Updated admin for user ID: ${id}`);
        break;
      case 'nutricionista':
        await updateNutricionista(usuario.id_usuario, usuarioData.especialista, transaction);
        console.log(`Updated nutritionist for user ID: ${id}`);
        break;
      default:
        break;
    }
    console.log('Updated user:', usuario);
    return usuario;
  }

  async deleteUsuario(id, transaction) {
    console.log(`Deleting user with ID: ${id}`);
    const usuario = await Usuarios.findByPk(id, { transaction });

    if (!usuario) {
      throw new Error('Usuario not found');
    }

    switch (usuario.tipo_usuario) {
      case 'administrador':
        await deleteAdmin(usuario.id_usuario, transaction);
        console.log(`Deleted admin for user ID: ${id}`);
        break;
      case 'nutricionista':
        await deleteNutricionista(usuario.id_usuario, transaction);
        console.log(`Deleted nutritionist for user ID: ${id}`);
        break;
      default:
        break;
    }

    await usuario.destroy({ transaction });
    console.log(`User with ID: ${id} deleted`);
    return { message: 'Usuario eliminado' };
  }
}

export default new UsuariosService();
