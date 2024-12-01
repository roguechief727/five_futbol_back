const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todas las relaciones equipo-partido
router.get('/equipopartido', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM equipopartido');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva relación equipo-partido
router.post('/equipopartido', verifyToken('administrador'), async (req, res) => {
  try {
    const { idEquipo, idPartido } = req.body;
    if (!idEquipo || !idPartido) {
      return res.status(400).json({ error: 'idEquipo y idPartido son obligatorios' });
    }
    const query = 'INSERT INTO equipopartido (idEquipo, idPartido) VALUES (?, ?)';
    const [result] = await connection.query(query, [idEquipo, idPartido]);
    res.json({ message: 'Relación equipo-partido creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating equipopartido' });
  }
});

// DELETE: Eliminar una relación equipo-partido
router.delete('/equipopartido', verifyToken('administrador'), async (req, res) => {
  try {
    const { idEquipo, idPartido } = req.query;
    if (!idEquipo || !idPartido) {
      return res.status(400).json({ error: 'idEquipo y idPartido son requeridos para eliminar' });
    }
    const query = 'DELETE FROM equipopartido WHERE idEquipo = ? AND idPartido = ?';
    const [result] = await connection.query(query, [idEquipo, idPartido]);
    res.json({ message: 'Relación equipo-partido eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting equipopartido' });
  }
});

module.exports = router;
