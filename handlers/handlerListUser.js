'use strict'
const pool = require('../connection');
const mysql = require('mysql'); // Add this line

module.exports.RDSListUsers = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const selectParam = event.queryStringParameters?.select ? JSON.parse(event.queryStringParameters.select) : ['*'];
    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 15;
    const offset = (page - 1) * limit;
    // Escapa los valores para evitar inyecciones SQL
    const escapedSelect = selectParam.map(col => col === '*' ? '*' : mysql.escapeId(col)).join(', ');
    const escapedLimit = mysql.escape(limit);
    const escapedOffset = mysql.escape(offset);
    const sql = `SELECT ${escapedSelect} FROM usuarios LIMIT ${escapedOffset}, ${escapedLimit};`;

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
            connection.query(sql, (err, result) => {
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
};