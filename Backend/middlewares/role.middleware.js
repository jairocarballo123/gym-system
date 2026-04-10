const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        //  Verificamos que req.user existe (viene del auth.middleware)
        if (!req.user) {
            return res.status(401).json({ 
                message: 'No autenticado' 
            });
        }

        //  Verificamos si el rol del usuario está en los permitidos
        //    Asumimos que req.user.roleId viene del token
        if (!allowedRoles.includes(req.user.roleId)) {
            return res.status(403).json({ 
                message: 'No tienes permisos para realizar esta acción' 
            });
        }

        //  Si tiene permiso, continuamos
        next();
    };
};

module.exports = { authorize };