export const isInvalid = (value, expectedType) => {
    if (expectedType !== 'id' && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) {
        return 'No puede estar vacío';
    }

    if (expectedType === 'number' || expectedType === 'id') {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return expectedType === 'id' ? 'Debe ser un ID numérico' : 'Debe ser un número';
        }
        
        if (expectedType === 'id' && value <= 0) {
             return 'Debe ser un ID positivo';
        }

    } else if (expectedType === 'string') {
        if (typeof value !== 'string') {
            return 'Debe ser una cadena de texto';
        }
    }

    return null;
};

export const baseValidationChecks = {
    id: { type: 'id' }, 
    nombres: { type: 'string' },
    apellidos: { type: 'string' }
};