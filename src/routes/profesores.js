import express from 'express';
import { validateProfesor } from '../utils/index.js';
import { storage } from '../storage/inMemoryStorage.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(storage.profesores);
});

router.get('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const profesor = storage.profesores.find(p => p.id === id);
    if (profesor) {
        res.status(200).json(profesor);
    } else {
        res.status(404).json({ message: "Profesor no encontrado" });
    }
});

router.post('/', (req, res) => {
    const newProfesorData = req.body;
    const validationErrors = validateProfesor(newProfesorData);
    if (validationErrors) {
        return res.status(400).json({ 
            message: "Error de validación", 
            errors: validationErrors 
        });
    }
    const newProfesor = newProfesorData;
    storage.profesores.push(newProfesor);
    res.status(201).json(newProfesor); 
});

router.put('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const profesorIndex = storage.profesores.findIndex(p => p.id === id);

    if (profesorIndex === -1) {
        return res.status(404).json({ message: "Profesor no encontrado para actualizar" });
    }
    
    const updatedData = req.body;
    const validationErrors = validateProfesor(updatedData);

    if (validationErrors) {
        return res.status(400).json({ 
            message: "Error de validación", 
            errors: validationErrors 
        });
    }

    storage.profesores[profesorIndex] = { 
        id: id,
        ...updatedData
    };
    res.status(200).json(storage.profesores[profesorIndex]); 
});

router.delete('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const initialLength = storage.profesores.length;
    storage.profesores = storage.profesores.filter(p => p.id !== id);

    if (storage.profesores.length < initialLength) {
        res.status(200).json({ message: `Profesor con id ${id} eliminado exitosamente` }); 
    } else {
        res.status(404).json({ message: "Profesor no encontrado para eliminar" });
    }
});

router.delete('/', (req, res) => {
    res.status(405).json({ message: "Method not allowed on the base path." });
});

export default router;