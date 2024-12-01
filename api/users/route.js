const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const { verifyToken } = require('../middlewares/verifyToken');

// Consultar todos los usuarios (solo administradores)
router.get('/', verifyToken('administrador'), (req, res) => {
  const query = 'SELECT id, username, role, nombre, email FROM users';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener usuarios', error: err });
    }
    res.status(200).json(results);
  });
});

// Consultar un usuario por ID (solo administradores)
router.get('/:id', verifyToken('administrador'), (req, res) => {
  const { id } = req.params;

  const query = 'SELECT id, username, role, nombre, email FROM users WHERE id = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el usuario', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(results[0]);
  });
});

// Actualizar un usuario por ID (solo administradores)
router.put('/:id', verifyToken('administrador'), async (req, res) => {
  const { id } = req.params;
  const { username, password, role, nombre, email } = req.body;

  if (!username || !role || !nombre || !email) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Comprobamos si el rol es válido
  if (role !== 'jugador' && role !== 'administrador') {
    return res.status(400).json({ message: 'El rol debe ser "jugador" o "administrador"' });
  }

  try {
    let query = 'UPDATE users SET username = ?, role = ?, nombre = ?, email = ?';
    const values = [username, role, nombre, email];

    // Si se incluye una nueva contraseña, la ciframos
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      values.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    values.push(id);

    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar el usuario', error: err });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({ message: 'Usuario actualizado correctamente' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
});

// Eliminar un usuario por ID (solo administradores)
router.delete('/:id', verifyToken('administrador'), (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el usuario', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  });
});

module.exports = router;
