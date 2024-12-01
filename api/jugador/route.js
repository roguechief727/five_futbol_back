const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql'); // Corrige según la ubicación relativa
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todos los jugadores
router.get('/jugador', verifyToken(), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM jugador');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear un nuevo jugador
router.post('/jugador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idJugador, nombre, email, modo, rendimiento, golesMarcados, fallasCometidas } = req.body;

    if (!idJugador || !nombre) {
      return res.status(400).json({ error: 'idJugador y nombre son campos obligatorios' });
    }

    const query = `
      INSERT INTO jugador (idJugador, nombre, email, modo, rendimiento, golesMarcados, fallasCometidas)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [idJugador, nombre, email, modo, rendimiento, golesMarcados, fallasCometidas];
    const [result] = await connection.query(query, values);

    res.json({ message: 'Jugador creado exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating player' });
  }
});

// GET: Obtener un jugador por ID
router.get('/jugador/:id', verifyToken(), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.query('SELECT * FROM jugador WHERE idJugador = ?', [id]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Error fetching player' });
  }
});

// PUT: Actualizar un jugador
router.put('/jugador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idJugador, nombre, email, modo, rendimiento, golesMarcados, fallasCometidas } = req.body;

    if (!idJugador) {
      return res.status(400).json({ error: 'idJugador es requerido para actualizar un jugador' });
    }

    const query = `
      UPDATE jugador 
      SET nombre = ?, email = ?, modo = ?, rendimiento = ?, golesMarcados = ?, fallasCometidas = ?
      WHERE idJugador = ?
    `;
    const values = [nombre, email, modo, rendimiento, golesMarcados, fallasCometidas, idJugador];
    const [result] = await connection.query(query, values);

    res.json({ message: 'Jugador actualizado exitosamente', result });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Error updating player' });
  }
});

// DELETE: Eliminar un jugador por ID
router.delete('/jugador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idJugador } = req.query;

    if (!idJugador) {
      return res.status(400).json({ error: 'idJugador es requerido para eliminar un jugador' });
    }

    const query = 'DELETE FROM jugador WHERE idJugador = ?';
    const [result] = await connection.query(query, [idJugador]);

    res.json({ message: 'Jugador eliminado exitosamente', result });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Error deleting player' });
  }
});

module.exports = router;
