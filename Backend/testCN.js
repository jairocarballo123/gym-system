const pool = require('./DB/db'); 

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.log("Error en la conexión:", err);
        return;
    }
    console.log("Conexión exitosa:", result.rows);
    pool.end();
});

