import ClientesService from '../services/clientes.service.js';

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
    console.error(`Error fetching client with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un cliente
export const createCliente = async (req, res) => {
  console.log('POST /clientes');
  console.log('Request body:', req.body);
  try {
    const newCliente = await ClientesService.createCliente(req.body);
    console.log('Sending response with new client:', newCliente);
    res.json(newCliente);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /clientes/${id}`);
  console.log('Request body:', req.body);
  try {
    const cliente = await ClientesService.getClienteById(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    const updatedCliente = await ClientesService.updateCliente(id, req.body);
    console.log('Sending response with updated client:', updatedCliente);
    res.json(updatedCliente);
  } catch (error) {
    console.error(`Error updating client with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /clientes/${id}`);
  try {
    const cliente = await ClientesService.getClienteById(id);
    if (!cliente) {
      console.log(`Client with ID: ${id} not found`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    await ClientesService.deleteCliente(id);
    console.log('Sending response: Client deleted');
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    console.error(`Error deleting client with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};
