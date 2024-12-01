const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todas las relaciones jugador-recompensa
router.get('/jugadorrecompensa', verifyToken(), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM jugadorrecompensa');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva relación jugador-recompensa
router.post('/jugadorrecompensa', verifyToken('administrador'), async (req, res) => {
  try {
    const { idJugador, idRecompensa } = req.body;
    if (!idJugador || !idRecompensa) {
      return res.status(400).json({ error: 'idJugador y idRecompensa son obligatorios' });
    }
    const query = 'INSERT INTO jugadorrecompensa (idJugador, idRecompensa) VALUES (?, ?)';
    const [result] = await connection.query(query, [idJugador, idRecompensa]);
    res.json({ message: 'Relación jugador-recompensa creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating jugadorrecompensa' });
  }
});

// DELETE: Eliminar una relación jugador-recompensa
router.delete('/jugadorrecompensa', verifyToken('administrador'), async (req, res) => {
  try {
    const { idJugador, idRecompensa } = req.query;
    if (!idJugador || !idRecompensa) {
      return res.status(400).json({ error: 'idJugador y idRecompensa son requeridos para eliminar' });
    }
    const query = 'DELETE FROM jugadorrecompensa WHERE idJugador = ? AND idRecompensa = ?';
    const [result] = await connection.query(query, [idJugador, idRecompensa]);
    res.json({ message: 'Relación jugador-recompensa eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting jugadorrecompensa' });
  }
});

module.exports = router;
