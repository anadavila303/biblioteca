export default class Estudiante {
    constructor(cedula, nombre, carrera) {
        this.table = "estudiantes"; // Nombre del archivo json
        this.cedula = cedula;
        this.nombre = nombre;
        this.carrera = carrera;
        this.librosPrestados = []; 
    }
}