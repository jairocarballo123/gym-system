const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors({ 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Middleware para leer JSON en el body
app.use(express.json());

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



// Puerto 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
