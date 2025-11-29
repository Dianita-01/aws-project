export const coerceProfesorData = (req, res, next) => {
    const data = req.body;

    if (data.horasClase !== undefined) {
        const coerced = Number.parseInt(data.horasClase);
        if (Number.isNaN(coerced)) {
            return res.status(400).json({ errors: { horasClase: "Debe ser un número entero válido." } });
        }
        data.horasClase = coerced;
    }
    
    if (data.numeroEmpleado !== undefined) {
        data.numeroEmpleado = String(data.numeroEmpleado);
    }
    
    next();
};