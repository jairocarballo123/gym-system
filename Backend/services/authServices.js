// services/authServices.js
const EmpleadoModel = require('../models/EmpleadoModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt.utils'); // ← Importas desde utils

const login = async (nombre, passwordPlano) => {
    const empleado = await EmpleadoModel.findByNombre(nombre);
    if (!empleado) throw new Error('Credenciales inválidas');

    const isMatch = await bcrypt.compare(passwordPlano, empleado.PasswordHash);
    if (!isMatch) throw new Error('Credenciales inválidas');

    // Usas la función del utils
    const token = generateToken({ 
        id: empleado.EmployeeId, 
        roleId: empleado.RoleId 
    });

    return { token, user: empleado };
};

module.exports = { login };