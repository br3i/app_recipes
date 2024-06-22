import { Cliente } from '../models/clientes.js';

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
    const newCliente = await Cliente.create(clienteData);
    console.log('Created client:', newCliente);
    return newCliente;
  }

  async updateCliente(id, clienteData) {
    console.log(`Updating client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      throw new Error('Cliente not found');
    }
    console.log('Client found:', cliente);
    const updatedCliente = await cliente.update(clienteData);
    console.log('Updated client:', updatedCliente);
    return updatedCliente;
  }

  async deleteCliente(id) {
    console.log(`Deleting client with ID: ${id}`);
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      throw new Error('Cliente not found');
    }
    console.log('Client found:', cliente);
    await cliente.destroy();
    console.log(`Client with ID: ${id} deleted`);
    return { message: 'Cliente eliminado' };
  }
}

export default new ClientesService();
