CREATE TABLE "Usuarios" (
  "id_usuario" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "contrasena" VARCHAR(100) NOT NULL,
  "tipo_usuario" VARCHAR(50) NOT NULL,
  "informacion_contacto" TEXT
);

CREATE TABLE "Administrador" (
  "id_administrador" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL
);

CREATE TABLE "Nutricionista" (
  "id_nutricionista" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "especialista" VARCHAR(100)
);

CREATE TABLE "Ingredientes" (
  "id_ingrediente" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "categoria" VARCHAR(100),
  "calorias" DECIMAL,
  "proteinas" DECIMAL,
  "carbohidratos" DECIMAL,
  "grasas" DECIMAL,
  "azucar" DECIMAL,
  "fibra" DECIMAL,
  "sodio" DECIMAL
);

CREATE TABLE "Objetivos_Nutricionales" (
  "id_objetivo" SERIAL PRIMARY KEY,
  "nombre_objetivo" VARCHAR(100) NOT NULL,
  "descripcion" TEXT
);

CREATE TABLE "Recetas" (
  "id_receta" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "instrucciones_prep" TEXT,
  "tiempo_coccion" INT,
  "calorias_totales" DECIMAL,
  "proteinas_totales" DECIMAL,
  "carbohidratos_totales" DECIMAL,
  "grasas_totales" DECIMAL,
  "azucares_totales" DECIMAL,
  "fibra_total" DECIMAL,
  "sodio_total" DECIMAL,
  "id_objetivo" INT
);

CREATE TABLE "Recetas_Ingredientes" (
  "id_recetas_ingredientes" SERIAL PRIMARY KEY,
  "id_receta" INT NOT NULL,
  "id_ingrediente" INT NOT NULL,
  "cantidad" DECIMAL
);

CREATE TABLE "Clientes" (
  "id_cliente" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "nombre_ingrediente" VARCHAR(100) NOT NULL,
  "cantidad_ingrediente" DECIMAL
);

CREATE TABLE "Historico_Recomendaciones" (
  "id_historico_recomendaciones" SERIAL PRIMARY KEY,
  "id_objetivo" INT NOT NULL,
  "id_recetas_ingredientes" INT NOT NULL,
  "id_cliente" INT NOT NULL
);

CREATE TABLE "Comentarios" (
  "id_comentario" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "nombre" VARCHAR(100) NOT NULL,
  "descripcion" TEXT
);

ALTER TABLE "Administrador" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario");

ALTER TABLE "Nutricionista" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario");

ALTER TABLE "Recetas" ADD FOREIGN KEY ("id_objetivo") REFERENCES "Objetivos_Nutricionales" ("id_objetivo");

ALTER TABLE "Recetas_Ingredientes" ADD FOREIGN KEY ("id_receta") REFERENCES "Recetas" ("id_receta");

ALTER TABLE "Recetas_Ingredientes" ADD FOREIGN KEY ("id_ingrediente") REFERENCES "Ingredientes" ("id_ingrediente");

ALTER TABLE "Clientes" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario");

ALTER TABLE "Historico_Recomendaciones" ADD FOREIGN KEY ("id_objetivo") REFERENCES "Objetivos_Nutricionales" ("id_objetivo");

ALTER TABLE "Historico_Recomendaciones" ADD FOREIGN KEY ("id_recetas_ingredientes") REFERENCES "Recetas_Ingredientes" ("id_recetas_ingredientes");

ALTER TABLE "Historico_Recomendaciones" ADD FOREIGN KEY ("id_cliente") REFERENCES "Clientes" ("id_cliente");

ALTER TABLE "Comentarios" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id_usuario");
