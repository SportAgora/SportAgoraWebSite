const mysql = require('mysql2/promise');

try {
    var pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10, // número máximo de conexões simultâneas
        queueLimit: 0
    });
    console.log("Pool de conexões estabelecida!");
} catch (e) {
    console.log("Falha ao estabelecer pool de conexões!");
    console.log(e);
}

module.exports = pool;