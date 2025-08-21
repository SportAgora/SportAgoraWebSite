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

-- CATEGORIA
CREATE TABLE assunto (
    assunto_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    assunto_nome VARCHAR(70) NOT NULL UNIQUE
);

CREATE TABLE ingresso (
    ingresso_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingresso_nome VARCHAR(70) NOT NULL,
    ingresso_valor DECIMAL(6,2) NOT NULL,
    ingresso_quantidade INT NOT NULL,
    ingresso_meia BOOLEAN NOT NULL DEFAULT 0
);

-- EVENTOS
CREATE TABLE eventos (
    evento_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    categoria_id INT UNSIGNED NOT NULL,
    assunto_id INT UNSIGNED NOT NULL,
    evento_nome VARCHAR(150) NOT NULL,
    evento_foto VARCHAR(1500) NOT NULL,

    evento_data_publicacao DATETIME NOT NULL,
    evento_data_inicio DATETIME NOT NULL,
    evento_data_hora DATETIME NOT NULL,

    evento_descricao VARCHAR(1500) NOT NULL,
    evento_endereco_logradouro VARCHAR(200) NOT NULL,
    evento_endereco_bairro VARCHAR(100) NOT NULL,
    evento_endereco_cidade VARCHAR(50) NOT NULL,
    evento_endereco_uf CHAR(2) NOT NULL,
    evento_endereco_cep CHAR(8) NOT NULL,

    ingresso_id INT UNSIGNED NOT NULL,

    evento_ativo BOOLEAN DEFAULT 1,

    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id),
    FOREIGN KEY (assunto_id) REFERENCES assunto(assunto_id),
    FOREIGN KEY (ingresso_id) REFERENCES ingresso(ingresso_id)
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