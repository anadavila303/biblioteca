import Model from "./model.js";

export default class Estudiante extends Model {
  table = "estudiantes"; // Nombre del archivo json

  constructor(cedula, nombre, carrera) {
    super();
    this.cedula = cedula;
    this.nombre = nombre;
    this.carrera = carrera;
    this.librosPrestados = [];
  }
}