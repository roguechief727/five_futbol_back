const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todas las penalizaciones
router.get('/penalizacion', verifyToken(), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM penalizacion');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva penalización
router.post('/penalizacion', verifyToken('administrador'), async (req, res) => {
  try {
    const { idPenalizacion, categoria, descripcion, estado, fechaPenalizacion, idJugador, gravedad } = req.body;
    if (!idPenalizacion || !categoria) {
      return res.status(400).json({ error: 'idPenalizacion y categoria son campos obligatorios' });
    }
    const query = `
      INSERT INTO penalizacion (idPenalizacion, categoria, descripcion, estado, fechaPenalizacion, idJugador, gravedad)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [idPenalizacion, categoria, descripcion, estado, fechaPenalizacion, idJugador, gravedad];
    const [result] = await connection.query(query, values);
    res.json({ message: 'Penalización creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating penalizacion' });
  }
});

// DELETE: Eliminar una penalización
router.delete('/penalizacion', verifyToken('administrador'), async (req, res) => {
  try {
    const { idPenalizacion } = req.query;
    if (!idPenalizacion) {
      return res.status(400).json({ error: 'idPenalizacion es requerido para eliminar' });
    }
    const query = 'DELETE FROM penalizacion WHERE idPenalizacion = ?';
    const [result] = await connection.query(query, [idPenalizacion]);
    res.json({ message: 'Penalización eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting penalizacion' });
  }
});

module.exports = router;
