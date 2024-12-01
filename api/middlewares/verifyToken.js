const express = require('express');
const router = express.Router();
const { connection } = require('../../libs/mysql');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey'; // Usa una clave secreta más segura en producción
//const auth = jwt.sign({ id: 1, role: 'administrador' }, JWT_SECRET, { expiresIn: '1h' });
//console.log('Nuevo token:', auth);

// Middleware para verificar el token y el rol
const verifyToken = (role) => {
    return (req, res, next) => {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
      }
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Guardamos la información del usuario en la solicitud
        // Verificar si el rol del usuario coincide con el rol requerido
        if (role && req.user.role !== role) {
          return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
        }
        next(); // Si todo es válido, pasamos a la siguiente ruta
      } catch (error) {
        console.error('Error al verificar token:', error.message); // Mostrar el error exacto
        res.status(403).json({ message: 'Token inválido' });
      }
    };
  };
  
  // Ejemplo de ruta protegida por rol (solo administradores)
  router.get('/admin', verifyToken('administrador'), (req, res) => {
    res.json({ message: 'Acceso concedido a administrador', user: req.user });
  });
  
  // Ejemplo de ruta protegida por rol (solo jugadores)
  router.get('/jugador', verifyToken('jugador'), (req, res) => {
    res.json({ message: 'Acceso concedido a jugador', user: req.user });
});
  
module.exports = { verifyToken };