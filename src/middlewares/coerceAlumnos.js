export const coerceAlumnoData = (req, res, next) => {
    const data = req.body;
    if (data.promedio !== undefined) { 
        const coercedPromedio = Number.parseFloat(data.promedio); 
        
        if (Number.isNaN(coercedPromedio)) { 
            return res.status(400).json({ 
                message: "Error de tipo en promedio", 
                errors: { promedio: "Debe ser un número válido." } 
            });
        } 
        data.promedio = coercedPromedio; 
    }
    next(); 
};