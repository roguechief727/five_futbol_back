const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connection } = require('../../libs/mysql');

const router = express.Router();
const JWT_SECRET = 'supersecretkey'; // Usa una clave secreta más segura en producción

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, role, nombre, email } = req.body;
    // Validación básica
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Comprobamos si el rol es válido
    if (role !== 'jugador') {
      return res.status(400).json({ message: 'El rol debe ser "jugador"' });
    }
  
    try {
      // Cifrado de la contraseña con bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insertar el nuevo usuario en la base de datos
      const query = 'INSERT INTO users (username, password, role, nombre, email) VALUES (?, ?, ?, ?, ?)';
      connection.query(query, [username, hashedPassword, role, nombre, email], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error al registrar usuario', error: err });
        }
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});
  

// Login de usuario
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const query = 'SELECT * FROM users WHERE username = ?';
        const [result] = await connection.query(query, [username]);

        // Verificar si el usuario existe
        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result[0];

        // Comparar la contraseña cifrada
        if (password !== user.password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar que el id y role existen antes de generar el token
        if (!user.id || !user.role) {
            return res.status(500).json({ message: 'Datos de usuario inválidos' });
        }

        // Generar el token JWT con el id del usuario y el rol
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        // Enviar la respuesta con el token y el rol del usuario
        return res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Error al iniciar sesión:', error); // Para ver el error exacto en la consola
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
});


module.exports = router;