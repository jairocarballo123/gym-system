const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const pool = require('./DB/db');

app.use(express.json());

app.use(cors({ 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use((req, res, next) => {
  if (req.is('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Importar rutas de miembros
const miembroRoutes = require('./routes/MiembroRoutes');
const pagoRoutes = require('./routes/PagoRoutes');
const asistenciaRoutes = require('./routes/AsistenciaRoutes');
const EmpleadosRoutes = require('./routes/EmpleadorRoutes');
const PlanRoutes = require('./routes/PlanRoutes');
const AuthRoutes = require('./routes/authRoutes');

app.use('/api/planes', PlanRoutes)
app.use('/api/Empleados', EmpleadosRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/members', miembroRoutes);
app.use('/api/pagos', pagoRoutes)
app.use('/api/auth',AuthRoutes)





// Espera a que la base de datos esté lista antes de iniciar el servidor
async function waitForDatabaseAndStart(retries = 0) {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    if (retries < 30) {
      const delay = 2000; // ms
      console.log(`Esperando a la base de datos... reintentando en ${delay}ms`);
      setTimeout(() => waitForDatabaseAndStart(retries + 1), delay);
    } else {
      console.error('No fue posible conectar a la base de datos tras múltiples intentos:', err.message);
      process.exit(1);
    }
  }
}

waitForDatabaseAndStart();
