import express from 'express';
import db from '../db/sequelize.js'; 
import { validateProfesor } from '../utils/index.js'; 
import { coerceProfesorData } from '../middlewares/coerceProfesores.js';

const router = express.Router();

const handleDatabaseError = (res, error) => {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
};

router.get('/', async (req, res) => {
    try {
        const profesores = await db.Profesor.findAll(); 
        res.status(200).json(profesores);
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const profesor = await db.Profesor.findByPk(id); 

        if (profesor) {
            res.status(200).json(profesor);
        } else {
            res.status(404).json({ message: "Profesor no encontrado" });
        }
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.post('/', coerceProfesorData, async (req, res) => {
    const { id: ignoredId, ...profesorData } = req.body; 
    const validationErrors = validateProfesor(profesorData);
    if (validationErrors) {
        return res.status(400).json({ message: "Error de validación", errors: validationErrors });
    }

    try {
        const profesor = await db.Profesor.create(profesorData); 
        res.status(201).json(profesor); 
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Número de empleado ya registrado." });
        }
        handleDatabaseError(res, error);
    }
});

router.put('/:id', coerceProfesorData, async (req, res) => {
    const id = Number.parseInt(req.params.id); 
    const { id: ignoredId, ...updatedData } = req.body;
    const validationErrors = validateProfesor(updatedData); 
    if (validationErrors) { 
        return res.status(400).json(
            { message: "Error de validación", errors: validationErrors });
    }
    
    try { 
        let profesor = await db.Profesor.findByPk(id); 
        if (!profesor) { 
            return res.status(404).json(
                { message: "Profesor no encontrado para actualizar" });
        } 
        await db.Profesor.update(updatedData, { where: { id: id } }); 
        profesor = await db.Profesor.findByPk(id); 
        res.status(200).json(profesor); 
    } catch (error) { 
        if (error.name === 'SequelizeUniqueConstraintError') { 
            return res.status(400).json({ message: "Número de empleado ya registrado." });
        } 
        handleDatabaseError(res, error); 
    }
});

router.delete('/:id', async (req, res) => {
    const profesorId = req.params.id;
    try {
        const deletedRows = await db.Profesor.destroy({ where: { id: profesorId } });

        if (deletedRows > 0) {
            res.status(200).json({ message: `Profesor con id ${profesorId} eliminado exitosamente` }); 
        } else {
            res.status(404).json({ message: "Profesor no encontrado para eliminar" });
        }
    } catch (error) {
        handleDatabaseError(res, error);
    }
});

router.delete('/', (req, res) => {
    res.status(405).json({ message: "Method DELETE not allowed on the base path. Use /profesores/{id}" });
});

export default router;