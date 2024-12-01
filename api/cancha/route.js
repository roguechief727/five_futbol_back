const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todas las canchas
router.get('/cancha', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM cancha');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva cancha
router.post('/cancha', verifyToken('administrador'), async (req, res) => {
  try {
    const { idCancha, ubicacion, disponible } = req.body;
    if (!idCancha || !ubicacion) {
      return res.status(400).json({ error: 'idCancha y ubicacion son campos obligatorios' });
    }
    const query = 'INSERT INTO cancha (idCancha, ubicacion, disponible) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [idCancha, ubicacion, disponible ?? 1]);
    res.json({ message: 'Cancha creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating cancha' });
  }
});

// DELETE: Eliminar una cancha
router.delete('/cancha', verifyToken('administrador'), async (req, res) => {
  try {
    const { idCancha } = req.query;
    if (!idCancha) {
      return res.status(400).json({ error: 'idCancha es requerido para eliminar' });
    }
    const query = 'DELETE FROM cancha WHERE idCancha = ?';
    const [result] = await connection.query(query, [idCancha]);
    res.json({ message: 'Cancha eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting cancha' });
  }
});

module.exports = router;
