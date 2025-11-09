import express from 'express';
import alumnosRouter from './routes/alumnos.js'; 
import profesoresRouter from './routes/profesores.js'; 

const app = express();
app.use(express.json());
app.use('/alumnos', alumnosRouter);
app.use('/profesores', profesoresRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API REST',
        endpoints: ['/alumnos', '/profesores']
    });
});

app.use((req, res) => {
    res.status(404).json({ 
        message: 'Ruta no encontrada',
        error: `No se encontró el recurso para ${req.method} ${req.originalUrl}`
    });
});

export default app;