import { Sequelize } from 'sequelize';
import AlumnoModel from '../models/alumno.js'; 
import ProfesorModel from '../models/profesor.js';

let sequelize = null;
const db = {};

db.Sequelize = Sequelize;

db.connect = async () => {
    try {
        sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT || 'mysql', 
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                logging: false
            }
        );
        
        db.Alumno = AlumnoModel(sequelize);
        db.Profesor = ProfesorModel(sequelize);
        db.sequelize = sequelize;
        
        await sequelize.authenticate();
        console.log('Connection to the database established successfully.');
        
        await sequelize.sync({ force: false }); 
        console.log("Database & tables synchronized.");
        
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); 
    }
};

export default db;