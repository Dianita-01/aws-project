export const isInvalid = (value, expectedType) => {
    if (expectedType.startsWith('optional_')) {
        if (value === null || value === undefined) {
            return null; 
        }
        expectedType = expectedType.replace('optional_', '');
    }
    
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
        return 'no puede estar vacío';
    }

    if (expectedType === 'number') {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return 'debe ser un número';
        }
    } else if (expectedType === 'string') {
        if (typeof value !== 'string') {
            return 'debe ser una cadena de texto';
        }
    }

    return null;
};

export const baseValidationChecks = {
    nombres: { type: 'string' },
    apellidos: { type: 'string' }
};