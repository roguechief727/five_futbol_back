const express = require('express');
const app = express();
const cors = require('cors');
const jugadorRoutes = require('./api/jugador/route');
const partidoRoutes = require('./api/partido/route');
const jugadorrecompensaRoutes = require('./api/jugadorrecompensa/route');
const equipopartidoRoutes = require('./api/equipopartido/route');
const recompensaRoutes = require('./api/recompensa/route');
const equipoRoutes = require('./api/equipo/route');
const canchaRoutes = require('./api/cancha/route');
const penalizacionRoutes = require('./api/penalizacion/route');
const historialRoutes = require('./api/historial/route');
const administradorRoutes = require('./api/administrador/route');
const calificacionRoutes = require('./api/calificacion/route');
const notificacionRoutes = require('./api/notificacion/route');
const userRoutes = require('./api/users/route');

const authRoutes = require('./api/routes/auth'); // Importa las rutas de autenticación
const middlewares = require('./api/middlewares/verifyToken'); // Importa los middlewares de autenticación
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto a la URL donde corre tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

app.use(express.json());
app.use('/api/routes/auth', authRoutes);  
app.use('/api', jugadorRoutes);
app.use('/api', partidoRoutes);
app.use('/api', jugadorrecompensaRoutes);
app.use('/api', equipopartidoRoutes);
app.use('/api', recompensaRoutes);
app.use('/api', equipoRoutes);
app.use('/api', canchaRoutes);
app.use('/api', penalizacionRoutes);
app.use('/api', historialRoutes);
app.use('/api', administradorRoutes);
app.use('/api', calificacionRoutes);
app.use('/api', notificacionRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola desde el backend!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
