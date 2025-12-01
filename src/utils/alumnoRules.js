import { isInvalid, baseValidationChecks } from './validationCore.js';

const ALUMNO_VALIDATION_CHECKS = {
    ...baseValidationChecks, 
    matricula: { type: 'string' }, 
    promedio: { type: 'number' },
    password: { type: 'string' },
    fotoPerfilUrl: { type: 'optional_string' }
};

export const validateAlumno = (alumno) => {
    const errors = {};

    for (const field in ALUMNO_VALIDATION_CHECKS) {
        const error = isInvalid(alumno[field], ALUMNO_VALIDATION_CHECKS[field].type);
        if (error) {
            errors[field] = error;
        }
    }

    if (!errors.promedio && typeof alumno.promedio === 'number') {
        if (alumno.promedio < 0 || alumno.promedio > 100) {
            errors.promedio = 'debe estar entre 0 y 100';
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
};