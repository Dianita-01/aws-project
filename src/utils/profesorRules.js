import { isInvalid, baseValidationChecks } from './validationCore.js';

const PROFESOR_VALIDATION_CHECKS = {
    ...baseValidationChecks, 
    numeroEmpleado: { type: 'string' }, 
    horasClase: { type: 'number' } 
};

export const validateProfesor = (profesor) => {
    const errors = {};

    for (const field in PROFESOR_VALIDATION_CHECKS) {
        const error = isInvalid(profesor[field], PROFESOR_VALIDATION_CHECKS[field].type);
        if (error) {
            errors[field] = error;
        }
    }

    if (!errors.horasClase && typeof profesor.horasClase === 'number' && profesor.horasClase < 0) {
        errors.horasClase = 'debe ser un número positivo';
    }

    return Object.keys(errors).length > 0 ? errors : null;
};