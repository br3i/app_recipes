import { Cliente } from '../models/clientes.js';

// Crea un Cliente
export const utilitiesCreateCliente = async ({ nombre_cliente, correo, id_usuario_asociado }, transaction) => {
  try {
    console.log(`Esto es lo que llega a la función para nombre_cliente: ${nombre_cliente} , para correo: ${correo} y para id_usuario_asociado: ${id_usuario_asociado}`);

    // Aquí se crea el cliente asociado con el usuario
    const nuevoCliente = await Cliente.create({
      nombre_cliente,
      correo,
      id_usuario: id_usuario_asociado  // Asegurarse de que este campo está correctamente asignado
    }, { transaction });

    return nuevoCliente;
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error.message}`);
  }
};

// Actualiza un Cliente
export const updateCliente = async (id_cliente, { nombre_cliente, correo, ingredientes_cantidad }, transaction) => {
  try {
    const cliente = await Cliente.findOne({ where: { id_cliente }, transaction });
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }
    if (nombre_cliente) cliente.nombre_cliente = nombre_cliente;
    if (correo) cliente.correo = correo;
    if (ingredientes_cantidad) cliente.ingredientes_cantidad = ingredientes_cantidad;
    await cliente.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar cliente: " + error.message);
  }
};

// Elimina un Cliente
export const deleteCliente = async (id_cliente, transaction) => {
  try {
    const cliente = await Cliente.findOne({ where: { id_cliente }, transaction });
    if (cliente) {
      await cliente.destroy({ transaction });
    } else {
      throw new Error("Cliente no encontrado");
    }
  } catch (error) {
    throw new Error("Error al eliminar cliente: " + error.message);
  }
};
