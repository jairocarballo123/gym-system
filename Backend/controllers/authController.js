const authService = require('../services/authServices');

const login = async (req, res) => {
    try {
        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const result = await authService.login(nombre, password);

        return res.status(200).json({
            message: "Login exitoso",
            token: result.token,
            user: {
                id: result.user.EmployeeId,
                nombre: result.user.FullName,
                rol: result.user.RoleId
            }
        });

    } catch (error) {
        console.error(error);
        if (error.message === 'credenciales invalidas') {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
        return res.status(500).json({ message: "Error interno" });
    }
};

module.exports = { login };