import 'dotenv/config';
import app from './src/app.js';
import db from './src/db/sequelize.js';

const port = 3000;

const startServer = async () => {
    await db.connect(); 

    app.listen(port, () => {
        console.log(`Server started on port ${port}. Access it at http://localhost:${port}`);
    });
};

startServer();