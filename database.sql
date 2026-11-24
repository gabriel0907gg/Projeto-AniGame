Database.sql: CREATE DATABASE IF NOT EXISTS anigame_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE anigame_db;



CREATE TABLE IF NOT EXISTS usuarios

(

id INT AUTO_INCREMENT PRIMARY KEY,

nome VARCHAR(100) NOT NULL,

email VARCHAR(150) NOT NULL UNIQUE,

senha VARCHAR(255) NOT NULL,

tipo_usuario ENUM('comum','admin') NOT NULL DEFAULT 'comum',

data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS favoritos

(

id INT AUTO_INCREMENT PRIMARY KEY,

usuario_id INT NOT NULL,

midia_id BIGINT UNSIGNED NOT NULL,

tipo_midia ENUM('anime','game') NOT NULL,

data_adicionado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE, UNIQUE KEY uq_favorito(usuario_id,midia_id,tipo_midia),

INDEX idx_favoritos_midia(tipo_midia,midia_id)

);



CREATE TABLE IF NOT EXISTS avaliacoes

(

id INT AUTO_INCREMENT PRIMARY KEY,

usuario_id INT NOT NULL, midia_id BIGINT UNSIGNED NOT NULL,

tipo_midia ENUM('anime','game') NOT NULL, nota INT NOT NULL CHECK(nota BETWEEN 1 AND 10),

comentario TEXT, data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

UNIQUE KEY uq_avaliacao(usuario_id,midia_id,tipo_midia),

INDEX idx_avaliacoes_midia(tipo_midia,midia_id)

);



CREATE TABLE IF NOT EXISTS comentarios_resposta

(

id INT AUTO_INCREMENT PRIMARY KEY,

avaliacao_id INT NOT NULL,

usuario_id INT NOT NULL,

resposta TEXT NOT NULL,

data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(avaliacao_id) REFERENCES avaliacoes(id) ON DELETE CASCADE, FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE

); 