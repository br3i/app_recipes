import IngredientesService from "../services/ingredientes.service.js";

export const calcularTotalesFromIngredientes = async (ingredientes) => {
  let calorias_totales = 0;
  let proteinas_totales = 0;
  let carbohidratos_totales = 0;
  let grasas_totales = 0;
  let azucares_totales = 0;
  let fibra_total = 0;
  let sodio_total = 0;

  for (const { id_ingrediente, cantidad } of ingredientes) {
    // Aquí debes implementar la lógica para obtener el ingrediente desde la base de datos
    const ingrediente = await IngredientesService.getIngredienteById(id_ingrediente);

    console.log(`Valor que llega a calculos de id_ingrediente: ${id_ingrediente} y el de cantidad: ${cantidad}`);
    if (!ingrediente) {
      throw new Error(`Ingrediente con ID ${id_ingrediente} no encontrado`);
    }

    calorias_totales += ingrediente.calorias * cantidad;
    proteinas_totales += ingrediente.proteinas * cantidad;
    carbohidratos_totales += ingrediente.carbohidratos * cantidad;
    grasas_totales += ingrediente.grasas * cantidad;
    azucares_totales += ingrediente.azucar * cantidad;
    fibra_total += ingrediente.fibra * cantidad;
    sodio_total += ingrediente.sodio * cantidad;
  }

  console.log(`Totales calculados:`, {
    calorias_totales,
    proteinas_totales,
    carbohidratos_totales,
    grasas_totales,
    azucares_totales,
    fibra_total,
    sodio_total
  });

  return {
    calorias_totales,
    proteinas_totales,
    carbohidratos_totales,
    grasas_totales,
    azucares_totales,
    fibra_total,
    sodio_total
  };
};