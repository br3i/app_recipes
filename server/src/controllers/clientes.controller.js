import ClientesService from '../services/clientes.service.js';
import { sequelize } from "../database/database.js";
import bcrypt from "bcryptjs";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    console.log('GET /clientes');
    const clientes = await ClientesService.getAllClientes();
    console.log('Sending response with clients:', clientes);
    res.json(clientes);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un cliente por ID
export const getClienteId = async (req, res) => {
  const { id } = req.params;
  console.log(`GET /clientes/${id}`);
  try {
    const cliente = await ClientesService.getClienteById(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    console.log('Sending response with client:', cliente);
    res.json(cliente);
  } catch (error) {
    console.error(`Error fetching client with ID: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un cliente
export const createCliente = async (req, res) => {
  const { nombre_cliente, contrasena, correo } = req.body;

  try {
    const nuevoCliente = await ClientesService.createCliente({ nombre_cliente, contrasena, correo });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  console.log(`PUT /clientes/${id}`);
  console.log('Request body:', req.body);
  try {
    const cliente = await ClientesService.getClienteById(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const updatedCliente = await ClientesService.updateCliente(id, req.body, transaction);
    await transaction.commit();
    console.log('Sending response with updated client:', updatedCliente);
    res.json(updatedCliente);
  } catch (error) {
    await transaction.rollback();
    console.error(`Error updating client with ID: ${req.body.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  console.log(`DELETE /clientes/${id}`);
  try {
    const cliente = await ClientesService.getClienteById(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await ClientesService.deleteCliente(id, transaction);
    await transaction.commit();
    console.log('Sending response: Cliente eliminado');
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error deleting client with ID: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Autenticación (Login)
export const loginCliente = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const result = await ClientesService.loginClienteService(correo, contrasena);
    res.json(result);
  } catch (error) {
    console.error('Error logging in client:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cambiar contraseña
export const changePasswordCliente = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  try {
    const result = await ClientesService.changePasswordCliente(id, newPassword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
