const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todas las notificaciones
router.get('/notificacion', verifyToken('administrador'), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM notificacion');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una nueva notificación
router.post('/notificacion', verifyToken('administrador'), async (req, res) => {
  try { 
    const { idNotificacion, fechaEnvio, mensaje, tipoNotificacion, idJugador } = req.body;
    if (!idNotificacion || !fechaEnvio) {
      return res.status(400).json({ error: 'idNotificacion y fechaEnvio son obligatorios' });
    }
    const query = `
      INSERT INTO notificacion (idNotificacion, fechaEnvio, mensaje, tipoNotificacion, idJugador)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [idNotificacion, fechaEnvio, mensaje, tipoNotificacion, idJugador];
    const [result] = await connection.query(query, values);
    res.json({ message: 'Notificación creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating notificacion' });
  }
});

// DELETE: Eliminar una notificación
router.delete('/notificacion', verifyToken('administrador'), async (req, res) => {
  try {
    const { idNotificacion } = req.query;
    if (!idNotificacion) {
      return res.status(400).json({ error: 'idNotificacion es requerido para eliminar' });
    }
    const query = 'DELETE FROM notificacion WHERE idNotificacion = ?';
    const [result] = await connection.query(query, [idNotificacion]);
    res.json({ message: 'Notificación eliminada exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting notificacion' });
  }
});

module.exports = router;
