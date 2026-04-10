// Backend/middlewares/auth.middleware.js
const { verifyToken } = require('../utils/jwt.utils'); // Usaremos la función que centralizamos

const authenticate = (req, res, next) => {
    //  El usuario debe mostrar su carnet (token) en el header "Authorization"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // No hay carnet, no pasa
        return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
    }

    //  El formato esperado es "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Formato de token inválido.' });
    }

    try {
       
        const decoded = verifyToken(token);

        //  Si es válido, adjuntamos la info del usuario a la request para que
        //    los siguientes middlewares o controladores sepan quién es.
        //    En 'decoded' tenemos { id, roleId, iat, exp } gracias a nuestro jwt.utils
        req.user = decoded;

        // 5.  pasar al siguiente paso (que podría ser
        //    otro middleware de roles, o directamente el controlador).
        next();

    } catch (error) {
        //  Si el token está vencido o es inválido, lo atajamos aquí.
        console.error('Error de autenticación:', error.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = { authenticate };