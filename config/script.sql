-- CRIAR BASE
CREATE DATABASE IF NOT EXISTS SPORTAGORA;
USE SPORTAGORA;

-- USUÁRIO (mesclado com perfil)
CREATE TABLE IF NOT EXISTS usuario (
    usu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_email VARCHAR(55) NOT NULL UNIQUE,
    usu_nome VARCHAR(100) NOT NULL UNIQUE,
    usu_senha VARCHAR(72) NOT NULL,
    usu_nasc DATE,
    usu_foto VARCHAR(255) DEFAULT NULL,
    usu_banner VARCHAR(255) DEFAULT NULL,
    tipo ENUM('comum', 'organizador', 'administrador') NOT NULL DEFAULT 'comum',
    perf_nome VARCHAR(100) NOT NULL,
    usu_status BOOLEAN DEFAULT 0
);

-- ESPORTES
CREATE TABLE IF NOT EXISTS esporte (
    esporte_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    esporte_nome VARCHAR(70) NOT NULL UNIQUE,
    esporte_foto VARCHAR(1500) NOT NULL,
    esporte_banner VARCHAR(1500) NOT NULL
);

-- INGRESSOS
CREATE TABLE IF NOT EXISTS ingresso (
    ingresso_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingresso_nome VARCHAR(70) NOT NULL,
    ingresso_valor DECIMAL(12,2) NOT NULL,
    ingresso_quantidade INT NOT NULL,
    ingresso_meia BOOLEAN NOT NULL DEFAULT 0,
    ingresso_vendido INT DEFAULT 0
);

-- EVENTOS
CREATE TABLE IF NOT EXISTS eventos (
    evento_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    esporte_id INT UNSIGNED NOT NULL,
    evento_nome VARCHAR(150) NOT NULL,
    evento_foto VARCHAR(1500) NOT NULL,
    evento_data_publicacao DATETIME NOT NULL,
    evento_data_inicio DATETIME NOT NULL,
    evento_data_fim DATETIME NOT NULL,
    evento_data_hora DATETIME NOT NULL,
    evento_descricao VARCHAR(1500) NOT NULL,
    evento_endereco_cep CHAR(8) NOT NULL,
    evento_endereco_numero CHAR(8) NOT NULL,
    evento_endereco_complemento VARCHAR(100) NOT NULL,
    evento_endereco_uf CHAR(2) NOT NULL,
    evento_endereco_cidade VARCHAR(100) NOT NULL,
    evento_ativo BOOLEAN DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id),
    FOREIGN KEY (esporte_id) REFERENCES esporte(esporte_id)
);

-- VINCULO EVENTO - INGRESSO
CREATE TABLE IF NOT EXISTS evento_ingresso (
  evento_id INT UNSIGNED NOT NULL,
  ingresso_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (evento_id, ingresso_id),
  FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE,
  FOREIGN KEY (ingresso_id) REFERENCES ingresso(ingresso_id) ON DELETE CASCADE
);

-- INSCRIÇÃO
CREATE TABLE IF NOT EXISTS inscricao_evento (
    inscricao_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    evento_id INT UNSIGNED NOT NULL,
    ingresso_id INT UNSIGNED NOT NULL,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE,
    FOREIGN KEY (ingresso_id) REFERENCES ingresso(ingresso_id) ON DELETE CASCADE
);

-- ASSINATURA
CREATE TABLE IF NOT EXISTS assinatura (
    assinatura_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    assinatura_plano VARCHAR(50) NOT NULL,
    assinatura_status ENUM('ativo', 'inativo', 'cancelado') DEFAULT 'inativo',
    assinatura_inicio DATE,
    assinatura_fim DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id)
);

-- PRÁTICAS ESPORTIVAS
CREATE TABLE IF NOT EXISTS pratica_esportivas (
    pratica_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    pratica_mapa BLOB,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id)
);

-- ENDEREÇO DAS PRÁTICAS
CREATE TABLE IF NOT EXISTS endereco_prat (
    endereco_prat_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pratica_id INT UNSIGNED NOT NULL,
    endereco_prat_logradouro VARCHAR(200) NOT NULL,
    endereco_prat_bairro VARCHAR(100) NOT NULL,
    endereco_prat_cidade VARCHAR(50) NOT NULL,
    endereco_prat_uf CHAR(2) NOT NULL,
    endereco_prat_cep CHAR(8) NOT NULL,
    FOREIGN KEY (pratica_id) REFERENCES pratica_esportivas(pratica_id)
);

-- DENÚNCIAS
CREATE TABLE IF NOT EXISTS denuncia (
    den_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    den_usuario_id INT UNSIGNED NOT NULL,
    den_evento_id INT UNSIGNED NOT NULL,
    den_descricao TEXT NOT NULL,
    den_status ENUM('pendente','análise','resolvido') DEFAULT 'pendente',
    den_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (den_usuario_id) REFERENCES usuario(usu_id),
    FOREIGN KEY (den_evento_id) REFERENCES eventos(evento_id)
);

-- USUÁRIOS
INSERT INTO usuario (usu_email, usu_nome, usu_senha, usu_nasc, usu_foto, usu_banner, tipo, perf_nome, usu_status)
VALUES 
('admin@sportagora.com', 'adminMaster', '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', '1990-01-01', 'imagens/usuarios/default_user.jpg', 'imagens/usuarios/default_background.jpg', 'administrador', 'adminMaster', 1),
('user@sportagora.com', 'Usuario', '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', '1990-01-01', 'imagens/usuarios/default_user.jpg', 'imagens/usuarios/default_background.jpg', 'comum', 'Usuario', 1);

-- ESPORTES
INSERT INTO esporte (esporte_nome, esporte_foto, esporte_banner)
VALUES 
('Futebol', 'imagens/esportes/futebol_foto.png', 'imagens/esportes/futebol_banner.png'),
('Natação', 'imagens/esportes/natacao_foto.png', 'imagens/esportes/natacao_banner.png');

-- EVENTO
INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_inicio, evento_data_fim, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
VALUES (
1,1,'Campeonato de Futebol 1','imagens/esportes/futebol_banner.png','2025-09-23 12:00:00','2025-09-23 13:00:00','2030-12-31 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 1 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

-- Inserir ingressos do Evento 1
INSERT INTO ingresso (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia)
VALUES 
('Ingresso Padrão', 100, 300, 0),
('Ingresso Padrão', 50, 300, 1),
('Ingresso VIP', 350, 300, 0);

-- Vincular ingressos ao Evento 1
INSERT INTO evento_ingresso (evento_id, ingresso_id)
VALUES
(1,1),
(1,2),
(1,3);

-- EVENTO 2
INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_inicio, evento_data_fim, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
VALUES (
1,1,'Campeonato de Futebol 2','imagens/esportes/futebol_banner.png','2025-09-24 12:00:00','2025-09-24 13:00:00','2030-12-31 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 2 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

-- Inserir ingressos do Evento 2
INSERT INTO ingresso (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia)
VALUES 
('Ingresso Padrão', 100, 300, 0),
('Ingresso Padrão', 50, 300, 1),
('Ingresso VIP', 350, 300, 0);

-- Vincular ingressos ao Evento 2
INSERT INTO evento_ingresso (evento_id, ingresso_id)
VALUES
(2,4),
(2,5),
(2,6);

-- EVENTO 3
INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_inicio, evento_data_fim, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
VALUES (
1,1,'Campeonato de Futebol 3','imagens/esportes/futebol_banner.png','2025-09-25 12:00:00','2025-09-25 13:00:00','2030-12-31 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 3 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

-- Inserir ingressos do Evento 3
INSERT INTO ingresso (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia)
VALUES 
('Ingresso Padrão', 100, 300, 0),
('Ingresso Padrão', 50, 300, 1),
('Ingresso VIP', 350, 300, 0);

-- Vincular ingressos ao Evento 3
INSERT INTO evento_ingresso (evento_id, ingresso_id)
VALUES
(3,7),
(3,8),
(3,9);

-- EVENTO 4
INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_inicio, evento_data_fim, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
VALUES (
1,1,'Campeonato de Futebol 4','imagens/esportes/futebol_banner.png','2025-09-26 12:00:00','2025-09-26 13:00:00','2030-12-31 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 4 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

-- Inserir ingressos do Evento 4
INSERT INTO ingresso (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia)
VALUES 
('Ingresso Padrão', 100, 300, 0),
('Ingresso Padrão', 50, 300, 1),
('Ingresso VIP', 350, 300, 0);

-- Vincular ingressos ao Evento 4
INSERT INTO evento_ingresso (evento_id, ingresso_id)
VALUES
(4,10),
(4,11),
(4,12);

-- EVENTO 5
INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_inicio, evento_data_fim, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
VALUES (
1,1,'Campeonato de Futebol 5','imagens/esportes/futebol_banner.png','2025-09-27 12:00:00','2025-09-27 13:00:00','2030-12-31 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 5 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

-- Inserir ingressos do Evento 5
INSERT INTO ingresso (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia)
VALUES 
('Ingresso Padrão', 100, 300, 0),
('Ingresso Padrão', 50, 300, 1),
('Ingresso VIP', 350, 300, 0);

-- Vincular ingressos ao Evento 5
INSERT INTO evento_ingresso (evento_id, ingresso_id)
VALUES
(5,13),
(5,14),
(5,15);