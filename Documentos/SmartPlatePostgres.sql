-- Tabla usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    informacion_contacto TEXT
);

-- Tabla administradores
CREATE TABLE administradores (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla nutricionistas
CREATE TABLE nutricionistas(
    id_nutricionista SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialista VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla ingredientes
CREATE TABLE ingredientes(
    id_ingrediente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    calorias DECIMAL,
    proteinas DECIMAL,
    carbohidratos DECIMAL,
    grasas DECIMAL,
    azucar DECIMAL,
    fibra DECIMAL,
    sodio DECIMAL
);

-- Tabla objetivos_nutricionales
CREATE TABLE objetivos_nutricionales(
    id_objetivo SERIAL PRIMARY KEY,
    nombre_objetivo VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla recetas
CREATE TABLE recetas(
    id_receta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    instrucciones_prep TEXT,
    tiempo_coccion INT,
    calorias_totales DECIMAL,
    proteinas_totales DECIMAL,
    carbohidratos_totales DECIMAL,
    grasas_totales DECIMAL,
    azucares_totales DECIMAL,
    fibra_total DECIMAL,
    sodio_total DECIMAL,
    id_objetivo INT,
    FOREIGN KEY (id_objetivo) REFERENCES objetivos_nutricionales(id_objetivo)
);

-- Tabla recetas_ingredientes
CREATE TABLE recetas_ingredientes(
    id_recetas_ingredientes SERIAL PRIMARY KEY,
    id_receta INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad DECIMAL,
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta),
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente)
);

-- Tabla ingrediente_usuario
CREATE TABLE ingrediente_usuario(
    id_ingrediente_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    codigo_usuario VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    nombre_ingrediente VARCHAR(100) NOT NULL,
    cantidad_ingrediente DECIMAL
);

-- Tabla historico_recomendaciones 
CREATE TABLE historico_recomendaciones (
    id_historico_recomendaciones SERIAL PRIMARY KEY,
    id_objetivo INT NOT NULL,
    id_recetas_ingredientes INT NOT NULL,
    id_ingrediente_usuario INT NOT NULL,
    FOREIGN KEY (id_objetivo) REFERENCES objetivos_nutricionales(id_objetivo),
    FOREIGN KEY (id_recetas_ingredientes) REFERENCES recetas_ingredientes(id_recetas_ingredientes),
    FOREIGN KEY (id_ingrediente_usuario) REFERENCES ingrediente_usuario(id_ingrediente_usuario)
);

-- Tabla comentarios
CREATE TABLE comentarios(
    id_comentario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);