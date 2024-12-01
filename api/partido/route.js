const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql'); // Asegúrate de que la ruta sea correcta

// GET: Obtener todos los partidos
router.get('/partido', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM partido');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Crear un nuevo partido
router.post('/partido', async (req, res) => {
  try {
    const { idPartido, estado, fecha, idCancha, idAdmin } = req.body;

    if (!idPartido || !fecha) {
      return res.status(400).json({ error: 'idPartido y fecha son campos obligatorios' });
    }

    const query = `
      INSERT INTO partido (idPartido, estado, fecha, idCancha, idAdmin)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [idPartido, estado, fecha, idCancha, idAdmin];
    const [result] = await connection.query(query, values);

    res.json({ message: 'Partido creado exitosamente', result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error creating partido' });
  }
});

// GET: Obtener un partido por ID
router.get('/partido/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.query('SELECT * FROM partido WHERE idPartido = ?', [id]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching partido:', error);
    res.status(500).json({ error: 'Error fetching partido' });
  }
});

// PUT: Actualizar un partido
router.put('/partido', async (req, res) => {
  try {
    const { idPartido, estado, fecha, idCancha, idAdmin } = req.body;

    if (!idPartido) {
      return res.status(400).json({ error: 'idPartido es requerido para actualizar un partido' });
    }

    const query = `
      UPDATE partido
      SET estado = ?, fecha = ?, idCancha = ?, idAdmin = ?
      WHERE idPartido = ?
    `;
    const values = [estado, fecha, idCancha, idAdmin, idPartido];
    const [result] = await connection.query(query, values);

    res.json({ message: 'Partido actualizado exitosamente', result });
  } catch (error) {
    console.error('Error updating partido:', error);
    res.status(500).json({ error: 'Error updating partido' });
  }
});

// DELETE: Eliminar un partido por ID
router.delete('/partido', async (req, res) => {
  try {
    const { idPartido } = req.query;

    if (!idPartido) {
      return res.status(400).json({ error: 'idPartido es requerido para eliminar un partido' });
    }

    const query = 'DELETE FROM partido WHERE idPartido = ?';
    const [result] = await connection.query(query, [idPartido]);

    res.json({ message: 'Partido eliminado exitosamente', result });
  } catch (error) {
    console.error('Error deleting partido:', error);
    res.status(500).json({ error: 'Error deleting partido' });
  }
});

module.exports = router;
