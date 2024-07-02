import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Cliente } from "../models/clientes.js";
import { Usuarios } from "../models/usuarios.js"
import { utilitiesCreateCliente } from "../utilities/utilitiesClientes.js";

// Definimos nuestra clave secreta aquí (debe ser robusta y segura)
const SECRET_KEY = "your_secret_key_here";

class ClientesService {
  async getAllClientes() {
    console.log('Fetching all clients...');
    const clientes = await Cliente.findAll();
    console.log('Fetched clients:', clientes);
    return clientes;
  }

  async getClienteById(id) {
    console.log(`Fetching client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
    } else {
      console.log('Fetched client:', cliente);
    }
    return cliente;
  }

  async getClienteByNombre(nombre_cliente, transaction) {
    console.log(`Fetching client with nombre: ${nombre_cliente}`);
    const cliente = await Cliente.findOne({where: {nombre_cliente}}, transaction);
    if (!cliente) {
      console.log(`Client with name: ${nombre_cliente} not found`);
    } else {
      console.log('Fetched client:', cliente);
    }
    return cliente;
  }

  async createCliente({ nombre_cliente, contrasena, correo }){
    try {
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      // Crear el usuario primero
      const nuevoUsuario = await Usuarios.create({
        nombre: nombre_cliente,
        email: correo,
        contrasena: hashedPassword,
        tipo_usuario: 'cliente'
      });

      // Luego crear el cliente asociado usando la función de utilidades
      const nuevoCliente = await utilitiesCreateCliente({
        nombre_cliente,
        correo,
        id_usuario_asociado: nuevoUsuario.id_usuario  // Asociar con el usuario creado
      });

      return nuevoCliente;
    } catch (error) {
      console.error('Error creando el cliente:', error);
      throw new Error(error.message);
    }
  };

  async createClienteAntiguo(clienteData, transaction) {
    try {
      const existingCliente = await this.getClienteByNombre(clienteData.nombre_cliente);
      console.log('Creating new client with data:', clienteData);
      const { nombre_cliente, correo, contrasena } = clienteData;
      console.log(`Solo el valor para contraseña: ${contrasena}`);
      const hashedPassword = await bcrypt.hash(contrasena, 10);  // Hashing the password

      const newCliente = await createCliente(nombre_cliente, correo, hashedPassword);
      return newCliente;
    } catch (error){
      console.error('Error creando el cliente:', error);
      throw new Error(error.message);
    }
  }

  async updateCliente(id, clienteData, transaction) {
  try {
    console.log(`Updating client with ID: ${id}`);
    
    const cliente = await Cliente.findByPk(id, { transaction });

    if (!cliente) {
      throw new Error('Client not found');
    }

    // Verificar si el correo nuevo ya existe en la tabla usuarios
    if (clienteData.correo) {
      const existingUsuario = await Usuarios.findOne({
        where: { email: clienteData.correo },
        transaction
      });
      if (existingUsuario) {
        throw new Error('El correo ya está en uso');
      }
    }

    // Actualizar los campos del cliente
    const { nombre_cliente, correo, ingredientes_cantidad, tipo_usuario } = clienteData;

    if (nombre_cliente) {
      cliente.nombre_cliente = nombre_cliente;
    }
    if (correo) {
      cliente.correo = correo;
    }
    if (ingredientes_cantidad) {
      cliente.ingredientes_cantidad = ingredientes_cantidad;
    }

    await cliente.save({ transaction });

    // Buscar y actualizar la tabla de usuarios si hay campos relevantes
    const usuario = await Usuarios.findByPk(cliente.id_usuario, { transaction });

    if (!usuario) {
      throw new Error('User associated with the client not found');
    }

    if (correo) {
      usuario.email = correo;
    }
    if (nombre_cliente) {
      usuario.nombre = nombre_cliente;
    }
    if (tipo_usuario) {
      usuario.tipo_usuario = tipo_usuario;
    }

    await usuario.save({ transaction });

    console.log('Updated client:', cliente);
    return cliente;
  } catch (error) {
    console.error('Error in updateClienteService:', error);
    throw error;
  }
}

  async loginClienteService(email, contrasena){
    try {
      console.log(`Logging in client with email: ${email}`);

      // Buscar el usuario en la tabla de Usuarios
      const usuario = await Usuarios.findOne({ where: { email } });
      
      if (!usuario) {
        throw new Error('Client not found');
      }

      // Comparar la contraseña
      const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);
      
      if (!isPasswordValid) {
        throw new Error('Incorrect password');
      }

      // Buscar el cliente asociado al usuario
      const cliente = await Cliente.findOne({ where: { id_usuario: usuario.id_usuario } });

      if (!cliente) {
        throw new Error('Client not found');
      }

      // Generar el token JWT
      const token = jwt.sign({ id: cliente.id_cliente, tipo_usuario: usuario.tipo_usuario }, SECRET_KEY, { expiresIn: '1h' });
      
      console.log('Login successful, token generated:', token);
      
      return { message: 'Login successful', token };
    } catch (error) {
      console.error('Error logging in client:', error);
      throw new Error(error.message);
    }
  };

  async changePasswordCliente(idCliente, newPassword) {
    try {
      // Encontrar el cliente por su ID
      const cliente = await Cliente.findByPk(idCliente);

      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      // Encontrar el usuario asociado por su ID de cliente
      const usuario = await Usuarios.findByPk(cliente.id_usuario);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña del usuario
      await usuario.update({ contrasena: hashedNewPassword });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      throw new Error(`Error al cambiar la contraseña del cliente: ${error.message}`);
    }
  }
}

export default new ClientesService();
