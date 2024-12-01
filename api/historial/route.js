const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todos los registros del historial
router.get('/historial', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM historial');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear un nuevo registro en el historial
router.post('/historial', verifyToken('administrador'), async (req, res) => {
  try {
    const { idHistorial, idJugador, idPartido } = req.body;
    if (!idHistorial) {
      return res.status(400).json({ error: 'idHistorial es obligatorio' });
    }
    const query = 'INSERT INTO historial (idHistorial, idJugador, idPartido) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [idHistorial, idJugador, idPartido]);
    res.json({ message: 'Registro en historial creado exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating historial' });
  }
});

// DELETE: Eliminar un registro del historial
router.delete('/historial', verifyToken('administrador'), async (req, res) => {
  try {
    const { idHistorial } = req.query;
    if (!idHistorial) {
      return res.status(400).json({ error: 'idHistorial es requerido para eliminar' });
    }
    const query = 'DELETE FROM historial WHERE idHistorial = ?';
    const [result] = await connection.query(query, [idHistorial]);
    res.json({ message: 'Registro en historial eliminado exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting historial' });
  }
});

module.exports = router;
