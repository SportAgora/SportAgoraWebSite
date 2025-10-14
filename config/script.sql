    -- CRIAR BASE
    CREATE DATABASE IF NOT EXISTS SPORTAGORA;
    USE SPORTAGORA;

    -- USUÁRIO (mesclado com perfil)
    CREATE TABLE IF NOT EXISTS usuarios (
        usu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        usu_email VARCHAR(55) NOT NULL UNIQUE,
        usu_nome VARCHAR(30) NOT NULL,
        usu_senha VARCHAR(72) NOT NULL, -- VALOR ALTO PELA SENHA SER CRIPTOGRAFADA
        usu_nasc DATE,
        usu_foto VARCHAR(255) DEFAULT NULL,
        usu_banner VARCHAR(255) DEFAULT NULL,
        tipo ENUM('c', 'o', 'a') NOT NULL DEFAULT 'c',
        usu_status BOOLEAN DEFAULT 0
    );

    -- ESPORTES
    CREATE TABLE IF NOT EXISTS esportes (
        esporte_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        esporte_nome VARCHAR(70) NOT NULL UNIQUE,
        esporte_foto VARCHAR(255) NOT NULL,
        esporte_banner VARCHAR(255) NOT NULL
    );

    -- EVENTOS
    CREATE TABLE IF NOT EXISTS eventos (
        evento_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT UNSIGNED NOT NULL,
        esporte_id INT UNSIGNED NOT NULL,
        evento_nome VARCHAR(150) NOT NULL,
        evento_foto VARCHAR(255) NOT NULL,
        evento_data_publicacao DATETIME NOT NULL,
        evento_data_hora DATETIME NOT NULL,
        evento_descricao VARCHAR(5000) NOT NULL,
        evento_endereco_cep CHAR(8) NOT NULL,
        evento_endereco_numero CHAR(4) NOT NULL,
        evento_endereco_complemento VARCHAR(100) NOT NULL,
        evento_endereco_uf CHAR(2) NOT NULL,
        evento_endereco_cidade VARCHAR(30) NOT NULL,
        evento_ativo BOOLEAN DEFAULT 1,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usu_id),
        FOREIGN KEY (esporte_id) REFERENCES esportes(esporte_id)
    );

    -- INGRESSOS
    CREATE TABLE IF NOT EXISTS ingressos (
        ingresso_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        ingresso_nome VARCHAR(70) NOT NULL,
        ingresso_valor DECIMAL(6,2) NOT NULL,
        ingresso_quantidade INT NOT NULL,
        ingresso_meia BOOLEAN NOT NULL DEFAULT 0,
        ingresso_vendido INT DEFAULT 0,
        evento_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (evento_id) REFERENCES eventos(evento_id)
    );

    -- INSCRIÇÃO
    CREATE TABLE IF NOT EXISTS inscricao_evento (
        inscricao_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT UNSIGNED NOT NULL,
        evento_id INT UNSIGNED NOT NULL,
        ingresso_id INT UNSIGNED NOT NULL,
        telefone VARCHAR(11) NOT NULL,
        cpf VARCHAR(11) NOT NULL,
        genero ENUM('masculino','feminino','naoIdentificar') NOT NULL DEFAULT 'naoIdentificar',
        data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        pagamento_feito BOOLEAN DEFAULT FALSE,
        entrada_validada BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usu_id) ON DELETE CASCADE,
        FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE,
        FOREIGN KEY (ingresso_id) REFERENCES ingressos(ingresso_id) ON DELETE CASCADE
    );

    -- PRÁTICAS ESPORTIVAS
    CREATE TABLE IF NOT EXISTS locais (
        local_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        local_nome VARCHAR(100) NOT NULL,
        local_foto VARCHAR(255) NOT NULL,
        local_endereco VARCHAR(255) NOT NULL,
        local_latitude DECIMAL(10,6) NOT NULL,
        local_longitude DECIMAL(10,6) NOT NULL,
        local_link VARCHAR (500) NOT NULL, -- os links do google maps podem ser gigantescos
        local_ativo BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS local_esporte (
        local_id INT UNSIGNED NOT NULL,
        esporte_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (local_id) REFERENCES locais(local_id),
        FOREIGN KEY (esporte_id) REFERENCES esportes(esporte_id)
    );


    CREATE TABLE IF NOT EXISTS solicitacoes (
        solicitacao_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        solicitacao_nome VARCHAR(100) NOT NULL,
        solicitacao_foto VARCHAR(255) NOT NULL,
        solicitacao_endereco VARCHAR(100) NOT NULL,
        solicitacao_link VARCHAR(500) NOT NULL, -- os links do google maps podem ser gigantescos
        solicitacao_status BOOLEAN NOT NULL DEFAULT FALSE,
        usuario_id INT UNSIGNED NOT NULL, -- foreing key
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usu_id)
    );

    CREATE TABLE IF NOT EXISTS solicitacoes_esportes (
        solicitacao_id INT UNSIGNED NOT NULL,
        esporte_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(solicitacao_id),
        FOREIGN KEY (esporte_id) REFERENCES esportes(esporte_id)
    );


    -- DENÚNCIAS
    CREATE TABLE IF NOT EXISTS denuncias (
        den_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        den_usuario_id INT UNSIGNED NOT NULL,
        den_evento_id INT UNSIGNED NOT NULL,
        den_descricao TEXT NOT NULL,
        den_status ENUM('pendente','análise','resolvido') DEFAULT 'pendente',
        den_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (den_usuario_id) REFERENCES usuarios(usu_id),
        FOREIGN KEY (den_evento_id) REFERENCES eventos(evento_id)
    );

    -- USUÁRIOS
    INSERT INTO usuarios (usu_email, usu_nome, usu_senha, usu_nasc, usu_foto, usu_banner, tipo, usu_status)
    VALUES 
    ('admin@sportagora.com', 'adminMaster', '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', '1990-01-01', 'imagens/usuarios/default_user.jpg', 'imagens/usuarios/default_background.jpg', 'a',  1),
    ('user@sportagora.com', 'Usuario', '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', '1990-01-01', 'imagens/usuarios/default_user.jpg', 'imagens/usuarios/default_background.jpg', 'c', 1);

    -- ESPORTES
    INSERT INTO esportes (esporte_nome, esporte_foto, esporte_banner)
    VALUES 
    ('Futebol', 'imagens/esportes/futebol_foto.png', 'imagens/esportes/futebol_banner.png'),
    ('Natação', 'imagens/esportes/natacao_foto.png', 'imagens/esportes/natacao_banner.png');

    -- EVENTO
    INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
    VALUES (
    1,1,'Campeonato de Futebol 1','imagens/esportes/futebol_banner.png','2025-09-23 12:00:00','2025-09-23 13:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 1 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

    -- Inserir ingressos do Evento 1
    INSERT INTO ingressos (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia, evento_id)
    VALUES 
    ('Ingresso Padrão', 100, 300, 0, 1),
    ('Ingresso Padrão', 50, 300, 1, 1),
    ('Ingresso VIP', 350, 300, 0, 1);


    -- EVENTO 2
    INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
    VALUES (
    1,1,'Campeonato de Futebol 2','imagens/esportes/futebol_banner.png','2025-09-24 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 2 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

    -- Inserir ingressos do Evento 2
    INSERT INTO ingressos (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia, evento_id)
    VALUES 
    ('Ingresso Padrão', 100, 300, 0, 2),
    ('Ingresso Padrão', 50, 300, 1, 2),
    ('Ingresso VIP', 350, 300, 0, 2);

    -- EVENTO 3
    INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao,  evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
    VALUES (
    1,1,'Campeonato de Futebol 3','imagens/esportes/futebol_banner.png','2025-09-25 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 3 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

    -- Inserir ingressos do Evento 3
    INSERT INTO ingressos (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia, evento_id)
    VALUES 
    ('Ingresso Padrão', 100, 300, 0, 3),
    ('Ingresso Padrão', 50, 300, 1, 3),
    ('Ingresso VIP', 350, 300, 0, 3);

    -- EVENTO 4
    INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
    VALUES (
    1,1,'Campeonato de Futebol 4','imagens/esportes/futebol_banner.png','2025-09-26 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 4 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

    -- Inserir ingressos do Evento 4
    INSERT INTO ingressos (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia, evento_id)
    VALUES 
    ('Ingresso Padrão', 100, 300, 0, 4),
    ('Ingresso Padrão', 50, 300, 1, 4),
    ('Ingresso VIP', 350, 300, 0, 4);

    -- EVENTO 5
    INSERT INTO eventos (usuario_id, esporte_id, evento_nome, evento_foto, evento_data_publicacao, evento_data_hora, evento_descricao, evento_endereco_cep, evento_endereco_numero, evento_endereco_complemento, evento_endereco_uf, evento_endereco_cidade, evento_ativo)
    VALUES (
    1,1,'Campeonato de Futebol 5','imagens/esportes/futebol_banner.png','2025-09-27 12:00:00','2031-10-12 16:00:00','<h1>Grande Clássico de Futebol 2025</h1><p>Evento 5 descrição</p>','06412090','110','Quadra','SP','Barueri',1);

    -- Inserir ingressos do Evento 5
    INSERT INTO ingressos (ingresso_nome, ingresso_valor, ingresso_quantidade, ingresso_meia, evento_id)
    VALUES 
    ('Ingresso Padrão', 100, 300, 0, 5),
    ('Ingresso Padrão', 50, 300, 1, 5),
    ('Ingresso VIP', 350, 300, 0, 5);

    INSERT INTO locais (local_nome, local_foto, local_endereco, local_latitude, local_longitude, local_link) VALUES
    ('Arena Central', 'imagens/esportes/futebol_banner.png', 'Rua A, 123', -23.5505, -46.6333, 'https://www.google.com/maps'),
    ('Campo Verde', 'imagens/esportes/futebol_banner.png', 'Av. B, 456', -23.5580, -46.6400, 'https://www.google.com/maps');
    INSERT INTO local_esporte (local_id, esporte_id) VALUES (1,1), (1,2), (2,2);

!-- roda esse aqui pedro
ALTER TABLE eventos MODIFY COLUMN evento_endereco_complemento VARCHAR(255);