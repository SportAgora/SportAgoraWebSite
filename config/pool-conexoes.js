const mysql = require('mysql2')

try {
    var pool = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    console.log("Conexão estabelecida!");
} catch (e) {
    console.log("Falha ao estabelecer a conexão!");
    console.log(e);
}
 
module.exports = pool.promise();