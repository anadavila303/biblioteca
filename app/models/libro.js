export default class Libro {
    constructor(codigo, titulo, autor) {
        this.table = "libros"; // Nombre del archivo json donde se guardará
        this.codigo = codigo;
        this.titulo = titulo;
        this.autor = autor;
        this.disponible = true; 
    }
}