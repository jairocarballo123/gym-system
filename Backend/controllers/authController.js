const authService = require('../services/authServices');

const login = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({
                message: "Faltan datos requeridos (id, password)"
            });
        }


        const result = await authService.login(id, password);


        return res.status(200).json({
            message: "Bienvenido al sistema",
            token: result.token,
            user: result.user
        });

    } catch (error) {

        console.error(`[AuthError]: ${error.message}`);
        
        if (error.message === 'CREDS_INVALIDAS' || error.message.includes('Acceso denegado')) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
        }

        // 👇 CAMBIA ESTO TEMPORALMENTE 👇
        // En lugar del mensaje genérico, enviamos el error real para leerlo
        return res.status(500).json({ 
            message: "Error interno",
            errorReal: error.message,  // <--- ESTO NOS DIRÁ LA VERDAD
            stack: error.stack         // <--- ESTO NOS DIRÁ DÓNDE FALLÓ
        });
      
    }
};

module.exports = { login };