import { DataTypes } from 'sequelize';

const ProfesorModel = (sequelize) => {
  const Profesor = sequelize.define('Profesor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false
    },
    numeroEmpleado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    nombres: {
      type: DataTypes.STRING(255), 
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    horasClase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0 
      }
    }
  }, {
    tableName: 'profesores',
    timestamps: false
  });

  return Profesor;
};

export default ProfesorModel;