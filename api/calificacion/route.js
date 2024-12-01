const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');

// GET: Obtener todas las calificaciones
router.get('/calificacion', verifyToken(), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM calificacion');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear una calificación
router.post('/calificacion', verifyToken('jugador'), async (req, res) => {
  try {
    const { idCalificacion, comentario, idJugadorEvaluador, idJugadorEvaluado, puntuacion } = req.body;
    if (!idCalificacion) {
      return res.status(400).json({ error: 'idCalificacion es obligatorio' });
    }
    const query = `
      INSERT INTO calificacion (idCalificacion, comentario, idJugadorEvaluador, idJugadorEvaluado, puntuacion)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [idCalificacion, comentario, idJugadorEvaluador, idJugadorEvaluado, puntuacion];
    const [result] = await connection.query(query, values);
    res.json({ message: 'Calificación creada exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating calificacion' });
  }
});

module.exports = router;
