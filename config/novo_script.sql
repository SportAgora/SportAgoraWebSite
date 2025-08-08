CREATE DATABASE SPORTAGORA;
 
USE SPORTAGORA;
 
-- USUÁRIO (mesclado com perfil)
CREATE TABLE usuario (
    usu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_email VARCHAR(55) NOT NULL UNIQUE,
    usu_nome VARCHAR(100) NOT NULL UNIQUE,
    usu_senha VARCHAR(72) NOT NULL,
    usu_nasc DATE,
    usu_foto VARCHAR(255) DEFAULT NULL,
    usu_banner VARCHAR(255) DEFAULT NULL,
    tipo ENUM('comum', 'organizador', 'administrador') NOT NULL DEFAULT 'comum',
    perf_nome VARCHAR(100) NOT NULL ,  -- nome do perfil ou do usuário
    usu_status BOOLEAN DEFAULT 1
);
  
-- CATEGORIA
CREATE TABLE categoria (
    categoria_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    categoria_nome VARCHAR(70) NOT NULL UNIQUE
);
 
-- EVENTOS
CREATE TABLE eventos (
    evento_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    organizador_id INT UNSIGNED NOT NULL,
    categoria_id INT UNSIGNED NOT NULL,
    evento_foto BLOB,
    evento_descricao VARCHAR(15000) NOT NULL,
    evento_valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id),
    FOREIGN KEY (organizador_id) REFERENCES organizadores(org_id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
);
 
-- ENDEREÇO DOS EVENTOS
CREATE TABLE endereco_eventos (
    endereco_evento_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    evento_id INT UNSIGNED NOT NULL,
    endereco_evento_logradouro VARCHAR(200) NOT NULL,
    endereco_evento_bairro VARCHAR(100) NOT NULL,
    endereco_evento_cidade VARCHAR(50) NOT NULL,
    endereco_evento_uf CHAR(2) NOT NULL,
    endereco_evento_cep CHAR(8) NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id)
);
 
-- PRÁTICAS ESPORTIVAS
CREATE TABLE pratica_esportivas (
    pratica_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    pratica_mapa BLOB,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id)
);
 
-- ENDEREÇO DAS PRÁTICAS
CREATE TABLE endereco_prat (
    endereco_prat_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pratica_id INT UNSIGNED NOT NULL,
    endereco_prat_logradouro VARCHAR(200) NOT NULL,
    endereco_prat_bairro VARCHAR(100) NOT NULL,
    endereco_prat_cidade VARCHAR(50) NOT NULL,
    endereco_prat_uf CHAR(2) NOT NULL,
    endereco_prat_cep CHAR(8) NOT NULL,
    FOREIGN KEY (pratica_id) REFERENCES pratica_esportivas(pratica_id)
);

INSERT INTO usuario (
    usu_email,
    usu_nome,
    usu_senha,
    usu_nasc,
    usu_foto,
    usu_banner,
    tipo,
    perf_nome
) VALUES (
    'admin@sportagora.com',               -- Email (único)
    'adminMaster',                        -- Nome (único)
    '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', -- Senha: Sport@123
    '1990-01-01',                         -- Data de nascimento
    'imagens/usuarios/default_user.jpg',  -- Foto
    'imagens/usuarios/default_background.jpg', -- Banner
    'administrador',                      -- Tipo de usuário
    'adminMaster'                         -- Nome do perfil
);