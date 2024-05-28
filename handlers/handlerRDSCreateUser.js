'use strict'
const pool = require('../connection');

module.exports.RDSCreateUser = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const body = JSON.parse(event.body);
    const sqlCreate = {
        USUARIO: body.usuario,
        NOMBRE: body.nombre,
    };

    const sql = "INSERT INTO usuarios SET ? ;";

    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection failed: ' + err.stack);
            console.log('Error code: ' + err.code);
            console.log('Error message: ' + err.message);
            callback({
                statusCode: 500,
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    message: err.message
                })
            });
        } else{
            connection.query(sql,[sqlCreate], (err, result)=>{
                if (err) {
                    console.log('Database query failed: ' + err.stack);
                    console.log('Error code: ' + err.code);
                    console.log('Error message: ' + err.message);
                    callback({
                        statusCode: 400,
                        header: {
                            'Content-Type': 'application/json'
                        },
                        body: context.fail(JSON.stringify({
                            success: false,
                            message: err.message
                        }))
                    });
                } else {
                    console.log('Connection to RDS is successful');
                    callback(null, {
                        statusCode: 200,
                        header: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            success: true,
                            message: 'User insertado correctamente',
                            data: result
                        })
                    });
                    connection.release();
                }
            });
        }
    });
}