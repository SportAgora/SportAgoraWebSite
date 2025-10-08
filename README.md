# SportAgora

SportAgora é um sistema web para gerenciamento de eventos esportivos, inscrições de usuários e venda de ingressos. Ele permite que usuários se cadastrem, façam login, visualizem eventos e comprem ingressos (inteira ou meia), tudo integrado com banco de dados e envio de e-mails.

---

## Tecnologias utilizadas

* Node.js
* Express
* EJS (templating)
* MySQL
* Express-validator (validação de formulários)
* Bcrypt (hash de senhas)
* Express-session (sessões de usuário)
* Leaflet (mapa interativo)
* API do Mercado Pago (pagamento de ingressos)

---

## Pré-requisitos

* Node.js instalado
* MySQL instalado
* Conta de e-mail válida para envio de notificações
* Conta do Mercado Pago para pagamentos (opcional)

---

## Instalação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd sportagora
```

2. Caso necessário, desative SSL estrito:

```bash
npm config set strict-ssl false
```

3. Instale as dependências:

```bash
npm install --save
```

4. Crie o banco de dados usando o script:

```sql
-- script.sql
```

5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST        =
DB_USER        =
DB_PASSWORD    =
DB_NAME        =
DB_PORT        =
APP_PORT       =
EMAIL_USER     =
SECRET_KEY     =
EMAIL_SERVICE  =
URL_BASE       =
MP_ACCESS_TOKEN =
```

Exemplo:

```env
DB_HOST        = localhost
DB_USER        = root
DB_PASSWORD    =
DB_NAME        = sportagora
DB_PORT        = 3306
APP_PORT       = 3000
EMAIL_USER     = email@email.com
SECRET_KEY     = senhasecreta
EMAIL_SERVICE  = gmail
URL_BASE       = https://localhost:3000
MP_ACCESS_TOKEN = SEU_TOKEN_MERCADO_PAGO
```

---

## Executando o projeto

```bash
npm start
```

O sistema estará disponível em: `http://localhost:3000` (ou na porta definida no `.env`).

---

## Funcionalidades

* Cadastro e login de usuários
* Edição de perfil
* Visualização de eventos esportivos
* Seleção de ingressos (meia/inteira) e quantidade
* Inscrição em eventos
* Pagamento online via Mercado Pago
* Notificações por e-mail
* Mapa interativo dos eventos com Leaflet

---

## Estrutura do projeto

* `controllers/` → lógica de controle
* `models/` → acesso ao banco de dados
* `views/` → arquivos EJS
* `public/` → arquivos estáticos (CSS, JS, imagens)
* `routes/` → rotas do Express
* `.env` → variáveis de ambiente

---

## Contato

📧 Email: [sportagora@outlook.com](mailto:sportagora@outlook.com)
