import Model from "./model.js";

export default class Libro extends Model {
  table = "libros";

  constructor(titulo, autor, disponible) {
    super();
    this.id = Date.now();
    this.titulo = titulo;
    this.autor = autor;
    this.disponible = disponible ?? true;
  }
}
