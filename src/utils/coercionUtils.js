export const coerceAlumnoData = (data) => {
    const { id: ignoredId, ...cleanData } = data;
    if (cleanData.promedio !== undefined) { 
        const coercedPromedio = Number.parseFloat(cleanData.promedio); 
        if (Number.isNaN(coercedPromedio)) { 
            throw new Error("InvalidPromedioType"); 
        } 
        cleanData.promedio = coercedPromedio; 
    }
    
    return cleanData;
};