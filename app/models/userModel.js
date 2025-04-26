var pool = require("../../config/connections_pool");

const userModel = {
    create: async (dadosForm) => {
        try{
            const [resultados] = await pool.query('INSERT INTO USUARIO SET ?', [dadosForm]);
            return resultados;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = userModel;