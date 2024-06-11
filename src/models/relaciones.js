import { Comentarios } from "./comentarios.js";
import { Historico_Recomendaciones } from "./historico_recomendaciones.js";
import { Cliente } from "./clientes.js";
import { Ingredientes } from "./ingredientes.js";
import { Recetas_Ingredientes } from "./recetas_ingredientes.js";
import { Recetas } from "./recetas.js";
import { Objetivos_Nutricionales } from "./objetivos_nutricionales.js";
import { Usuarios } from "./usuarios.js";
import { Nutricionista } from "./nutricionistas.js";
import { Administradores } from "./administradores.js";

// Relaciones Usuarios - Administradores
Usuarios.hasOne(Administradores, { foreignKey: "id_usuario", as: 'administrador' });
Administradores.belongsTo(Usuarios, { foreignKey: "id_usuario" });

// Relaciones Usuarios - Nutricionistas
Usuarios.hasOne(Nutricionista, { foreignKey: "id_usuario", as: 'nutricionista' });
Nutricionista.belongsTo(Usuarios, { foreignKey: "id_usuario" });

// Relación Usuarios - Clientes
Usuarios.hasOne(Cliente, { foreignKey: "id_usuario", as: 'cliente' });
Cliente.belongsTo(Usuarios, { foreignKey: "id_usuario" });

// Relaciones Usuarios - Comentarios
Usuarios.hasMany(Comentarios, { foreignKey: "id_usuario", as: 'comentarios' });
Comentarios.belongsTo(Usuarios, { foreignKey: "id_usuario" });

// Relaciones objetivos nutricionales - historico recomendaciones
Objetivos_Nutricionales.hasMany(Historico_Recomendaciones, { foreignKey: "id_objetivo" });
Historico_Recomendaciones.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo" });

// Relaciones Recetas - Objetivos_Nutricionales
Recetas.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo", as: "objetivo" });
Objetivos_Nutricionales.hasMany(Recetas, { foreignKey: "id_objetivo", as: "recetas" });

// Relaciones Recetas - Recetas_Ingredientes
Recetas.hasMany(Recetas_Ingredientes, { foreignKey: "id_receta", as: "recetas_ingredientes" });
Recetas_Ingredientes.belongsTo(Recetas, { foreignKey: "id_receta", as: "receta" });

// Relaciones recetas ingredientes - historico recomendaciones
Recetas_Ingredientes.hasMany(Historico_Recomendaciones, { foreignKey: "id_recetas_ingredientes" });
Historico_Recomendaciones.belongsTo(Recetas_Ingredientes, { foreignKey: "id_recetas_ingredientes" });

// Relaciones Ingredientes - Recetas_Ingredientes
Ingredientes.hasMany(Recetas_Ingredientes, { foreignKey: "id_ingrediente", as: "recetas_ingredientes" });
Recetas_Ingredientes.belongsTo(Ingredientes, { foreignKey: "id_ingrediente", as: "ingrediente" });

// Relaciones Cliente - historico recomendaciones
Cliente.hasMany(Historico_Recomendaciones, { foreignKey: "id_cliente", as: "historico_recomendaciones" });
Historico_Recomendaciones.belongsTo(Cliente, { foreignKey: "id_cliente", as: "cliente" });
