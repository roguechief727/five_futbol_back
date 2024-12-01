const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todas las recompensas
router.get('/recompensa', verifyToken(), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM recompensa');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva recompensa
router.post('/recompensa', verifyToken('administrador'), async (req, res) => {
  try {
    const { idRecompensa, descripcion, fechaRecompensa } = req.body;
    if (!idRecompensa) {
      return res.status(400).json({ error: 'idRecompensa es obligatorio' });
    }
    const query = 'INSERT INTO recompensa (idRecompensa, descripcion, fechaRecompensa) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [idRecompensa, descripcion, fechaRecompensa]);
    res.json({ message: 'Recompensa creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating recompensa' });
  }
});

// DELETE: Eliminar una recompensa
router.delete('/recompensa', verifyToken('administrador'), async (req, res) => {
  try {
    const { idRecompensa } = req.query;
    if (!idRecompensa) {
      return res.status(400).json({ error: 'idRecompensa es requerido para eliminar' });
    }
    const query = 'DELETE FROM recompensa WHERE idRecompensa = ?';
    const [result] = await connection.query(query, [idRecompensa]);
    res.json({ message: 'Recompensa eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting recompensa' });
  }
});

module.exports = router;
