import app from "./app.js";
import { regenerarBD, sequelize } from "./database/database.js";

if(regenerarBD){
  import('./models/usuarios.js');
  import('./models/administradores.js');
  import('./models/nutricionistas.js');
  import('./models/recetas.js');
  import('./models/ingredientes.js');
  import('./models/comentarios.js');
  import('./models/historico_recomendaciones.js');
  import('./models/clientes.js');
  import('./models/objetivos_nutricionales.js');
  import('./models/recetas_ingredientes.js');
  import('./models/relaciones.js');
}

async function main() {
  try{
    await sequelize.sync({force: regenerarBD});
    app.listen(4000);
    console.log("Server listening on port 4000");
  } catch (error){
    console.log("Unable to connect to the database:", error)
  }
}

main();