CREATE DATABASE SPORTAGORA;
 
USE SPORTAGORA;
 
-- ENDEREÇO DE USUÁRIO
CREATE TABLE endereco_usu (
    usu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_logradouro VARCHAR(200) NOT NULL,
    usu_bairro VARCHAR(100) NOT NULL,
    usu_cidade VARCHAR(50) NOT NULL,
    usu_uf CHAR(2) NOT NULL,
    usu_cep CHAR(8) NOT NULL
);
 
-- CONTATO ORGANIZADOR
CREATE TABLE contato_org (
    cont_org_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cont_org_email VARCHAR(100) NOT NULL UNIQUE,
    cont_org_celular CHAR(11) NOT NULL UNIQUE
);
 
-- CONTATO SOCIAL
CREATE TABLE contato_social (
    cont_soc_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cont_soc_instagram VARCHAR(30) UNIQUE,
    cont_soc_facebook VARCHAR(50) UNIQUE,
    cont_soc_tiktok VARCHAR(30) UNIQUE,
    cont_soc_x VARCHAR(50) UNIQUE,
    cont_soc_whatsapp CHAR(11) UNIQUE
);
 
-- PLANOS
CREATE TABLE planos (
    plano_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plano_titulo VARCHAR(25) NOT NULL UNIQUE,
    plano_descricao VARCHAR(200) NOT NULL UNIQUE,
    plano_valor DECIMAL(10,2) NOT NULL
);
 
-- USUÁRIO (mesclado com perfil)
CREATE TABLE usuario (
    usu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_cpf CHAR(11) UNIQUE,
    usu_email VARCHAR(55) NOT NULL UNIQUE,
    usu_nome VARCHAR(100) NOT NULL UNIQUE,
    usu_senha VARCHAR(72) NOT NULL,
    usu_nasc DATE,
    usu_foto VARCHAR(255) DEFAULT NULL,
    usu_banner VARCHAR(255) DEFAULT NULL,
    endereco_id INT UNSIGNED ,
    contato_id INT UNSIGNED ,
    plano_id INT UNSIGNED ,
    tipo ENUM('comum', 'organizador', 'administrador') NOT NULL DEFAULT 'comum',
    perf_nome VARCHAR(100) NOT NULL ,  -- nome do perfil ou do usuário
	contato_social_id INT UNSIGNED,
    usu_status BOOLEAN DEFAULT 1
  
    FOREIGN KEY (endereco_id) REFERENCES endereco_usu(usu_id),
    FOREIGN KEY (contato_id) REFERENCES contato_org(cont_org_id),
    FOREIGN KEY (plano_id) REFERENCES planos(plano_id),
    FOREIGN KEY (contato_social_id) REFERENCES contato_social(cont_soc_id)
);
 
-- POST
CREATE TABLE post (
    post_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    post_foto BLOB,
    post_descricao VARCHAR(200),
    post_titulo VARCHAR(30),
    post_comentario VARCHAR(255),
    post_curtidas INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id)
);
 
-- ORGANIZADORES (mantém contato_org_id)
CREATE TABLE organizadores (
    org_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    org_cnpj CHAR(14) NOT NULL UNIQUE,
    org_razao_social VARCHAR(50) NOT NULL UNIQUE,
    contato_org_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (contato_org_id) REFERENCES contato_org(cont_org_id)
);
 
-- PERFIL ORGANIZADOR
CREATE TABLE perfil_organizador (
    perfil_org_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    organizador_id INT UNSIGNED NOT NULL,
    contato_social_id INT UNSIGNED,
    foto_organizador BLOB,
    nome_organizador VARCHAR(100) NOT NULL,
 
    -- Novos campos para perfil organizador
    quantidade_seguidores INT UNSIGNED DEFAULT 0,
    quantidade_seguindo INT UNSIGNED DEFAULT 0,
    biografia VARCHAR(500),
    link_posts VARCHAR(255),
    curtidas INT UNSIGNED DEFAULT 0,
    banner BLOB,
 
    FOREIGN KEY (organizador_id) REFERENCES organizadores(org_id),
    FOREIGN KEY (contato_social_id) REFERENCES contato_social(cont_soc_id)
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