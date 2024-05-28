'use strict'
const pool = require('../connection');
const mysql = require('mysql'); // Add this line

module.exports.RDSTestConnection = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const sql = 'SELECT 1+1';
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
            connection.query(sql, (err, result)=>{
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
                            message: 'Connection to RDS is successful',
                            data: result
                        })
                    });
                    connection.release();
                }
            });
        }
    });
}