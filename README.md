para executar:
npm config set strict-ssl false (caso necessário)
npm install --save
criar banco de dados (script.sql)
criar .env

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

ex:

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
MP_ACCESS_TOKEN =
