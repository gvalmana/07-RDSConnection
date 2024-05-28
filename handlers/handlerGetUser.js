'use strict'
const pool = require('../connection');
const mysql = require('mysql'); // Add this line

module.exports.RDSGetUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const userId = Number(event.pathParameters.id);
    const selectParam = event.queryStringParameters?.select ? JSON.parse(event.queryStringParameters.select) : ['*'];
    const escapedSelect = selectParam.map(col => col === '*' ? '*' : mysql.escapeId(col)).join(', ');
    const sql = `SELECT ${escapedSelect} FROM usuarios WHERE ID  = ?;`;
    try {
        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        const result = await new Promise((resolve, reject) => {
            connection.query(sql,[userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        connection.release();

        return {
            statusCode: 200,
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Exito al obtener el usuario',
                data: result
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                message: err.message
            })
        };
    }
}