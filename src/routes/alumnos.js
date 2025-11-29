import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";

import { validateAlumno, coerceAlumnoData as AlumnoDataCoercionUtility } from "../utils/index.js"; 
import { coerceAlumnoData as CoercionMiddleware } from '../middlewares/coerceAlumnos.js'; 
import { hashPassword } from '../middlewares/hashing.js'; 

import db from "../db/sequelize.js";
import { uploadToS3 } from "../services/aws/s3.js";
import { sendEmailNotification } from "../services/aws/sns.js";
import { createNewSessionEntry, verifyActiveSession,  closeSession } from "../services/sessionService.js";
import { findAlumnoSafe } from "../services/alumnoService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const BUCKET = process.env.S3_BUCKET_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const handleDatabaseError = (res, error) => {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
};

router.get("/", async (req, res) => {
    try {
        const alumnos = await db.Alumno.findAll({attributes: { exclude: ["password"] }});
        res.status(200).json(alumnos);
    } catch (err) {
        handleDatabaseError(res, error);
    }
});

router.get("/:id", async (req, res) => {
    const alumno = await findAlumnoSafe(req.params.id);
    if (!alumno)
        return res.status(404).json({ message: "Alumno no encontrado" });
    res.status(200).json(alumno);
});

router.post("/", async (req, res) => {
    try {
        let data = AlumnoDataCoercionUtility(req.body);
        const validationErrors = validateAlumno(data);
        if (validationErrors) { 
            return res.status(400).json({ message: "Error de validación", errors: validationErrors });
        }

        const saltRounds = 10; 
        data.password = await bcrypt.hash(data.password, saltRounds);
        const alumno = await db.Alumno.create(data);
        const response = alumno.toJSON();
        delete response.password;
        res.status(201).json(response);
    } catch (err) {
        if (err.message === "InvalidPromedioType") {
             return res.status(400).json({ errors: { promedio: "Debe ser un número válido." } });
        }
        if (err.name === "SequelizeUniqueConstraintError")
            return res.status(400).json({ message: "Matrícula ya registrada" });

        handleDatabaseError(res, err);
    }
});

router.put('/:id', CoercionMiddleware, hashPassword, async (req, res) => {
    const id = Number.parseInt(req.params.id); 
    const { id: ignoredId, ...updatedData } = req.body;
    const validationErrors = validateAlumno(updatedData); 
    if (validationErrors) { 
        return res.status(400).json({ message: "Error de validación", errors: validationErrors });
    }
    
    try { 
        let alumno = await db.Alumno.findByPk(id); 
        if (!alumno) { 
            return res.status(404).json({ message: "Alumno no encontrado para actualizar" });
        } 
        
        await db.Alumno.update(updatedData, { where: { id: id } }); 
        alumno = await db.Alumno.findByPk(id, { attributes: { exclude: ['password'] } }); 
        res.status(200).json(alumno); 
    } catch (error) { 
        if (error.name === 'SequelizeUniqueConstraintError') { 
            return res.status(400).json({ message: "Matrícula ya registrada." });
        } 
        handleDatabaseError(res, error);
    }
});

router.delete("/:id", async (req, res) => {
    const alumnoId = req.params.id;
    try {
        const deletedRows = await db.Alumno.destroy({ where: { id: alumnoId } });
        if (deletedRows > 0) {
            res.status(200).json({ message: `Profesor con id ${alumnoId} eliminado exitosamente` }); 
        } else {
            res.status(404).json({ message: "Alumno no encontrado para eliminar" });
        }
    } catch (error) {
        handleDatabaseError(res, error);
    }
  
});

router.delete('/', (req, res) => { 
    res.status(405).json({ message: "Method DELETE not allowed on the base path. Use /alumnos/{id}" }); 
});

router.post("/:id/fotoPerfil", upload.single("foto"), async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    const alumno = await db.Alumno.findByPk(id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    if (!file) return res.status(400).json({ message: "Debe subir un archivo" });

    const ext = file.originalname.split(".").pop();
    const key = `${id}-foto-perfil.${ext}`;
    const url = await uploadToS3(BUCKET, key, file.buffer, file.mimetype);
    await db.Alumno.update({ fotoPerfilUrl: url }, { where: { id } });
    res.status(200).json({ fotoPerfilUrl: url });
});

router.post("/:id/email", async (req, res) => {
    const alumno = await findAlumnoSafe(req.params.id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    const subject = "Notificación de Calificaciones";
    const message = `Alumno: ${alumno.nombres} ${alumno.apellidos}Promedio: ${alumno.promedio}`;
    const response = await sendEmailNotification(SNS_TOPIC_ARN, subject, message);
    res.status(200).json({ messageId: response.MessageId });
});

router.post("/:id/session/login", async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const alumno = await db.Alumno.findByPk(id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    const ok = await bcrypt.compare(password, alumno.password);
    if (!ok) return res.status(400).json({ message: "Credenciales inválidas" });

    try {
        const { sessionId, sessionString } = await createNewSessionEntry(alumno.id);
        res.status(200).json({ sessionId, sessionString });
    } catch (error) {
        console.error("Error al crear sesión en DynamoDB:", error);
        res.status(500).json({ message: "Error interno al crear sesión. Detalle: " + error.message });
    }
});

router.post("/:id/session/verify", async (req, res) => {
    const id = req.params.id;
    const { sessionString } = req.body;
    const session = await verifyActiveSession(sessionString, id);
    if (session) return res.status(200).json({ message: "Sesión válida" });

    return res.status(400).json({ message: "Sesión inválida" });
});

router.post("/:id/session/logout", async (req, res) => {
    const { sessionString } = req.body;
    const success = await closeSession(sessionString);
    if (!success) return res.status(404).json({ message: "Sesión no encontrada" });

    res.status(200).json({ message: "Sesión cerrada" });
});

export default router;