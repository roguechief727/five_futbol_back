const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// GET: Obtener todos los administradores
router.get('/administrador', verifyToken('adminstrador'), async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM administrador');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear un nuevo administrador
router.post('/administrador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idAdmin, nombre } = req.body;
    if (!idAdmin || !nombre) {
      return res.status(400).json({ error: 'idAdmin y nombre son campos obligatorios' });
    }
    const query = 'INSERT INTO administrador (idAdmin, nombre) VALUES (?, ?)';
    const [result] = await connection.query(query, [idAdmin, nombre]);
    res.json({ message: 'Administrador creado exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating administrador' });
  }
});

// DELETE: Eliminar un administrador
router.delete('/administrador', verifyToken('administrador'), async (req, res) => {
  try {
    const { idAdmin } = req.query;
    if (!idAdmin) {
      return res.status(400).json({ error: 'idAdmin es requerido para eliminar' });
    }
    const query = 'DELETE FROM administrador WHERE idAdmin = ?';
    const [result] = await connection.query(query, [idAdmin]);
    res.json({ message: 'Administrador eliminado exitosamente', result });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting administrador' });
  }
});

module.exports = router;
