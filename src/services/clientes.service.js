import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Cliente } from "../models/clientes.js";

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

  async createCliente(clienteData) {
    console.log('Creating new client with data:', clienteData);
    const hashedPassword = await bcrypt.hash(clienteData.contrasena, 10);  // Hashing the password
    const newCliente = await Cliente.create({ ...clienteData, contrasena: hashedPassword });

    console.log('Created client:', newCliente);
    return newCliente;
  }

  async updateCliente(id, clienteData) {
    console.log(`Updating client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Client not found');
    }

    await cliente.update(clienteData);
    console.log('Updated client:', cliente);
    return cliente;
  }

  async deleteCliente(id) {
    console.log(`Deleting client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Client not found');
    }

    await cliente.destroy();
    console.log(`Client with ID: ${id} deleted`);
    return { message: 'Client deleted' };
  }

  async loginCliente(email, contrasena) {
    console.log(`Logging in client with email: ${email}`);
    const cliente = await Cliente.findOne({ where: { email } });
    
    if (!cliente) {
      throw new Error('Client not found');
    }

    const isPasswordValid = await bcrypt.compare(contrasena, cliente.contrasena);
    
    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign({ id: cliente.id_cliente, tipo_usuario: cliente.tipo_usuario }, SECRET_KEY, { expiresIn: '1h' });
    
    console.log('Login successful, token generated:', token);
    
    return { message: 'Login successful', token };
  }

  async changePasswordCliente(id, newPassword) {
    console.log(`Changing password for client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Client not found');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await cliente.update({ contrasena: hashedNewPassword });
    
    return { message: 'Password updated successfully' };
  }
}

export default new ClientesService();
