import express from 'express';
import { validateAlumno } from '../utils/index.js'; 
import { storage } from '../storage/inMemoryStorage.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(storage.alumnos);
});

router.get('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const alumno = storage.alumnos.find(a => a.id === id);
    if (alumno) {
        res.status(200).json(alumno);
    } else {
        res.status(404).json({ message: "Alumno no encontrado" });
    }
});

router.post('/', (req, res) => {
    const newAlumnoData = req.body; 
    const validationErrors = validateAlumno(newAlumnoData);
    if (validationErrors) {
        return res.status(400).json({ 
            message: "Error de validación", 
            errors: validationErrors 
        });
    }
    const newAlumno = newAlumnoData;
    storage.alumnos.push(newAlumno);
    res.status(201).json(newAlumno); 
});

router.put('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const alumnoIndex = storage.alumnos.findIndex(a => a.id === id);

    if (alumnoIndex === -1) {
        return res.status(404).json({ message: "Alumno no encontrado para actualizar" });
    }
    
    const updatedData = req.body;
    const validationErrors = validateAlumno(updatedData);

    if (validationErrors) {
        return res.status(400).json({ 
            message: "Error de validación", 
            errors: validationErrors 
        });
    }

    storage.alumnos[alumnoIndex] = { 
        id: id,
        ...updatedData
    };
    res.status(200).json(storage.alumnos[alumnoIndex]); 
});

router.delete('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const initialLength = storage.alumnos.length;
    storage.alumnos = storage.alumnos.filter(a => a.id !== id);

    if (storage.alumnos.length < initialLength) {
        res.status(200).json({ message: `Alumno con id ${id} eliminado exitosamente` }); 
    } else {
        res.status(404).json({ message: "Alumno no encontrado para eliminar" });
    }
});

router.delete('/', (req, res) => {
    res.status(405).json({ message: "Method not allowed on the base path." });
});

export default router;