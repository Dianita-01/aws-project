let alumnos = [];
let profesores = [];

export const storage = {
    alumnos,
    profesores,
    findAlumno(id) {
        return alumnos.find(a => a.id === id);
    },
    findProfesor(id) {
        return profesores.find(p => p.id === id);
    }
};