import { DataTypes } from 'sequelize';
const AlumnoModel = (sequelize) => {
  const Alumno = sequelize.define('Alumno', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    promedio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fotoPerfilUrl: {
      type: DataTypes.STRING(512),
      allowNull: true 
    }
  }, {
    tableName: 'alumnos',
    timestamps: false
  });

  return Alumno;
};

export default AlumnoModel;