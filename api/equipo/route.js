const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todos los equipos
router.get('/equipo', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipo');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear un nuevo equipo
router.post('/equipo', async (req, res) => {
  try {
    const { idEquipo, nombre, resultado } = req.body;
    if (!idEquipo) {
      return res.status(400).json({ error: 'idEquipo es obligatorio' });
    }
    const query = 'INSERT INTO equipo (idEquipo, nombre, resultado) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [idEquipo, nombre, resultado]);
    res.json({ message: 'Equipo creado exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating equipo' });
  }
});

// DELETE: Eliminar un equipo
router.delete('/equipo', async (req, res) => {
  try {
    const { idEquipo } = req.query;
    if (!idEquipo) {
      return res.status(400).json({ error: 'idEquipo es requerido para eliminar' });
    }
    const query = 'DELETE FROM equipo WHERE idEquipo = ?';
    const [result] = await connection.query(query, [idEquipo]);
    res.json({ message: 'Equipo eliminado exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting equipo' });
  }
});

module.exports = router;
