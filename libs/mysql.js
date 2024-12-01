const mysql = require('mysql2/promise');

// Crear el pool de conexiones
const connection = mysql.createPool({
  host: 'localhost',
  user: 'fokinayuda',
  password: 'admin',
  database: 'futbol5',
  port: 3306, // Cambia si MAMP usa otro puerto, como 8889
});

// Ejemplo de uso para probar la conexión
(async () => {
  try {
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Connection successful! Test query result:', rows[0].solution);
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
})();

module.exports = { connection };