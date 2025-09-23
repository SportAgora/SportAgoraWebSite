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
    usu_status BOOLEAN DEFAULT 0
);
  
CREATE TABLE esporte (
    esporte_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    esporte_nome VARCHAR(70) NOT NULL UNIQUE,
    esporte_foto VARCHAR(1500) NOT NULL,
    esporte_banner VARCHAR(1500) NOT NULL
);

CREATE TABLE ingresso (
    ingresso_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingresso_nome VARCHAR(70) NOT NULL,
    ingresso_valor DECIMAL(12,2) NOT NULL,
    ingresso_quantidade INT NOT NULL,
    ingresso_meia BOOLEAN NOT NULL DEFAULT 0
);

-- EVENTOS
CREATE TABLE eventos (
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


    evento_ativo BOOLEAN DEFAULT 1,

    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id),
    FOREIGN KEY (esporte_id) REFERENCES esporte(esporte_id)
);

CREATE TABLE evento_ingresso (
  evento_id INT UNSIGNED NOT NULL,
  ingresso_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (evento_id, ingresso_id),
  FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE,
  FOREIGN KEY (ingresso_id) REFERENCES ingresso(ingresso_id) ON DELETE CASCADE
);

CREATE TABLE inscricao_evento (
    inscricao_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    evento_id INT UNSIGNED NOT NULL,
    ingresso_id INT UNSIGNED NOT NULL,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- caso queira validar se já entrou no evento
    -- status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    FOREIGN KEY (usuario_id) REFERENCES usuario(usu_id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE,
    FOREIGN KEY (ingresso_id) REFERENCES ingresso(ingresso_id) ON DELETE CASCADE
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
    perf_nome,
    usu_status
) VALUES (
    'admin@sportagora.com',               -- Email (único)
    'adminMaster',                        -- Nome (único)
    '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', -- Senha: Sport@123
    '1990-01-01',                         -- Data de nascimento
    'imagens/usuarios/default_user.jpg',  -- Foto
    'imagens/usuarios/default_background.jpg', -- Banner
    'administrador',                      -- Tipo de usuário
    'adminMaster',                         -- Nome do perfil
    1
);

INSERT INTO usuario (
    usu_email,
    usu_nome,
    usu_senha,
    usu_nasc,
    usu_foto,
    usu_banner,
    tipo,
    perf_nome,
    usu_status
) VALUES (
    'user@sportagora.com',               -- Email (único)
    'Usuario',                        -- Nome (único)
    '$2b$10$z9NiJXWfm3QtLjXK3LEdu.URx7bNH9usxjjnMfUOH5pY8ItveDXaS', -- Senha: Sport@123
    '1990-01-01',                         -- Data de nascimento
    'imagens/usuarios/default_user.jpg',  -- Foto
    'imagens/usuarios/default_background.jpg', -- Banner
    'comum',                      -- Tipo de usuário
    'Usuario',                         -- Nome do perfil
    1
);

INSERT INTO esporte (
	esporte_nome,
    esporte_foto,
    esporte_banner
) VALUES (
    'Futebol', -- Nome (único)
    'imagens/esportes/futebol_foto.png',
    'imagens/esportes/futebol_banner.png'
    
);

INSERT INTO esporte (
	esporte_nome,
    esporte_foto,
    esporte_banner
) VALUES (
    'Natação', -- Nome (único)
    'imagens/esportes/natacao_foto.png',
    'imagens/esportes/natacao_banner.png'
    
);

INSERT INTO ingresso (
	ingresso_nome,
    ingresso_valor,
    ingresso_quantidade,
    ingresso_meia
) VALUES (
    'Ingresso Vip', -- Nome
    350, -- Valor
    300, -- Quantidade
    0 -- Meia (falso)
);

INSERT INTO ingresso (
	ingresso_nome,
    ingresso_valor,
    ingresso_quantidade,
    ingresso_meia
) VALUES (
    'Ingresso Padrão', -- Nome
    100, -- Valor
    300, -- Quantidade
    '1' -- Meia (verdadeiro)
);

INSERT INTO eventos (
    usuario_id,
    esporte_id,
    evento_nome,
    evento_foto,
    evento_data_publicacao,
    evento_data_inicio,
    evento_data_fim,
    evento_data_hora,
    evento_descricao,
    evento_endereco_cep,
    evento_endereco_numero,
    evento_endereco_complemento,
    evento_ativo
) VALUES (
    1, -- user id
    1, -- esporte id
    'Campeonato de Futebol', -- nome
    'imagens/esportes/futebol_banner.png', -- foto
    '2025-09-23 12:00:00',
    '2025-09-23 13:00:00',
    '2030-12-31 12:00:00',
    '2031-10-12 16:00:00',
    '<h1>Grande Clássico de Futebol 2025</h1>
    <p class="meta"><strong>Data:</strong> 12/10/2025 · <strong>Horário:</strong> 16h · <strong>Local:</strong> Estádio Central</p>
    <p>Um duelo imperdível entre duas equipes tradicionais que prometem muita emoção, jogadas rápidas e clima vibrante nas arquibancadas. Uma ótima opção de lazer para amigos e famílias.</p>
    <ul>
        <li><strong>Times:</strong> Falcões Vermelhos x Leões Azuis</li>
        <li><strong>Competição:</strong> Copa Regional</li>
    </ul>
    <p><strong>Ingressos:</strong> disponíveis online e na bilheteria do estádio. Crianças até 12 anos têm entrada gratuita acompanhadas de um adulto.</p>
    <p><em>Os portões serão abertos 1h antes do início. Chegue cedo para garantir estacionamento e evitar filas. Documento de identificação obrigatório.</em></p>',
    '06412090',
    '110',
    'Quadra',
    1 -- ativo
);

INSERT INTO evento_ingresso (
	evento_id,
    ingresso_id
) VALUES (
	1,
	1
);

INSERT INTO evento_ingresso (
	evento_id,
    ingresso_id
) VALUES (
	1,
	2
);