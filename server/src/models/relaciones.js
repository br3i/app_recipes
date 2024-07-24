// src/models/index.js
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
Objetivos_Nutricionales.hasMany(Historico_Recomendaciones, { foreignKey: "id_objetivo", as: 'historico_recomendaciones' });
Historico_Recomendaciones.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo", as: 'objetivos_nutricionale' });

// Relaciones Recetas - Objetivos_Nutricionales
Recetas.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo", as: "objetivo" });
Objetivos_Nutricionales.hasMany(Recetas, { foreignKey: "id_objetivo", as: "recetas" });

// Relaciones Recetas - Recetas_Ingredientes
Recetas.hasMany(Recetas_Ingredientes, { foreignKey: "id_receta", as: "recetaIngredientes" });
Recetas_Ingredientes.belongsTo(Recetas, { foreignKey: "id_receta", as: "receta" });

// Relaciones recetas ingredientes - historico recomendaciones
Recetas_Ingredientes.hasMany(Historico_Recomendaciones, { foreignKey: "id_recetas_ingredientes", as: "historico_recomendaciones" });
Historico_Recomendaciones.belongsTo(Recetas_Ingredientes, { foreignKey: "id_recetas_ingredientes", as: 'recetas_ingrediente' });

// Relaciones Ingredientes - Recetas_Ingredientes
Ingredientes.hasMany(Recetas_Ingredientes, { foreignKey: "id_ingrediente", as: "ingredienteRecetas" });
Recetas_Ingredientes.belongsTo(Ingredientes, { foreignKey: "id_ingrediente", as: "ingrediente" });

// Relaciones Cliente - historico recomendaciones
Cliente.hasMany(Historico_Recomendaciones, { foreignKey: "id_cliente", as: "historico_recomendaciones" });
Historico_Recomendaciones.belongsTo(Cliente, { foreignKey: "id_cliente", as: "cliente" });

// Relaciones Recetas - Ingredientes (many-to-many)
Recetas.belongsToMany(Ingredientes, { through: Recetas_Ingredientes, foreignKey: "id_receta", as: "ingredientes" });
Ingredientes.belongsToMany(Recetas, { through: Recetas_Ingredientes, foreignKey: "id_ingrediente", as: "recetas" });
