const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todas las relaciones equipo-jugador
router.get('/equipojugador', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipo_jugador');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva relación equipo-jugador
router.post('/equipojugador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idEquipo, idJugador } = req.body;

    // Validación de campos
    if (!idEquipo || !idJugador) {
      return res.status(400).json({ error: 'idEquipo y idJugador son obligatorios' });
    }

    // Insertar la nueva relación en la tabla
    const query = 'INSERT INTO equipo_jugador (idEquipo, idJugador) VALUES (?, ?)';
    const [result] = await connection.query(query, [idEquipo, idJugador]);

    res.json({ message: 'Relación equipo-jugador creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating equipojugador' });
  }
});

// DELETE: Eliminar una relación equipo-jugador
router.delete('/equipojugador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idEquipo, idJugador } = req.query;

    // Validación de campos
    if (!idEquipo || !idJugador) {
      return res.status(400).json({ error: 'idEquipo y idJugador son requeridos para eliminar' });
    }

    // Eliminar la relación de la tabla
    const query = 'DELETE FROM equipo_jugador WHERE idEquipo = ? AND idJugador = ?';
    const [result] = await connection.query(query, [idEquipo, idJugador]);

    res.json({ message: 'Relación equipo-jugador eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting equipojugador' });
  }
});

module.exports = router;
