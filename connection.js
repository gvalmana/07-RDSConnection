const mysql = require('mysql');

const configDb = {
    connectionLimit: 10,
    host: 'rds-curso.cahqttq7q9qg.us-east-1.rds.amazonaws.com',
    user: 'curso',
    password: 'serverless',
    port: 3306,
    database: 'RDSCurso',
    debug: false
};

var pool = mysql.createPool(configDb);

module.exports = pool;