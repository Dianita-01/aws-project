import db from "../db/sequelize.js";

export const findAlumnoSafe = (id) => {
  return db.Alumno.findByPk(id, {
    attributes: { exclude: ["password"] }
  });
};
