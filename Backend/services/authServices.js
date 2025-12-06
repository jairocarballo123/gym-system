// src/services/authService.js
const empleadoModel = require('../models/EmpleadoModel');
const jwt = require('jsonwebtoken');


const login = async (idEmpleado, password) => {
    
    
    if (!process.env.JWT_SECRET) {
        throw new Error("ERROR CRÍTICO: JWT_SECRET no configurado.");
    }

    
    const empleado = await empleadoModel.buscarPorId(idEmpleado);
    
    if (!empleado) {
        throw new Error('El ID de empleado no existe.'); 
    }

    if (password !== empleado.password) {
        throw new Error('Contraseña incorrecta.');
    }

  
    const token = jwt.sign(
        { 
            id: empleado.id, 
            rol: empleado.rol, 
            nombre: empleado.nombre 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );


    const { password: _, ...usuarioSinPass } = empleado;
    
    return { token, user: usuarioSinPass };
};

module.exports = { login };