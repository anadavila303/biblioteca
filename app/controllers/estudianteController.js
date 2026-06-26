import inquirer from "inquirer";
import chalk from "chalk";
import Estudiante from "../models/estudiante.js";
import Libro from "../models/libro.js";
import Helpers from "../helpers/jsonHelper.js";

export default class EstudianteController {
  opcion = 0;
  opciones = [
    { name: "Menu anterior", value: 0 },
    { name: "Mostrar estudiantes", value: 1 },
    { name: "Crear estudiante", value: 2 },
    { name: "Prestar libro a estudiante", value: 3 },
  ];

  constructor(opcion = 0) {
    this.opcion = opcion;
    this.estudiante = new Estudiante();
    this.libro = new Libro();
  }

  async validarMenu(opcion) {
    if (opcion == 0) {
      return;
    } else if (opcion == 1) {
      await this.read();
    } else if (opcion == 2) {
      await this.create();
    } else if (opcion == 3) {
      await this.lendBook();
    } else {
      console.log(chalk.bgRed.white("Opción no válida"));
    }
  }

  async create() {
    console.clear();
    const payload = await inquirer.prompt([
      { type: "input", name: "cedula", message: "Ingrese la cédula del estudiante" },
      { type: "input", name: "nombre", message: "Ingrese el nombre del estudiante" },
      { type: "input", name: "edad", message: "Ingrese la edad del estudiante" },
      {
        type: "select",
        name: "sexo",
        message: "Seleccione el sexo del estudiante",
        choices: [
          { name: "Masculino", value: "M" },
          { name: "Femenino", value: "F" },
        ],
      },
      { type: "input", name: "carrera", message: "Ingrese la carrera del estudiante" },
    ]);

    await this.estudiante.save({
      table: this.estudiante.getTable(),
      ...payload,
      librosPrestados: [],
    });

    console.log(chalk.bgGreen.white("Estudiante creado exitosamente"));
    await Helpers.esperar();
  }

  async read() {
    console.clear();
    console.log(chalk.bgBlue.white("Mostrando estudiantes..."));
    console.log();
    const estudiantes = await this.estudiante.load();

    // Mostramos librosPrestados como texto simple (títulos separados por coma)
    // en vez de un array de objetos, para que se vea legible en la tabla.
    const tabla = estudiantes.map((e) => ({
      ...e,
      librosPrestados: (e.librosPrestados || [])
        .map((libro) => (typeof libro === "string" ? libro : libro.titulo))
        .join(", "),
    }));

    console.table(tabla);
    console.log();
    await Helpers.esperar();
  }

  async lendBook() {
    console.clear();
    const estudiantes = await this.estudiante.load();
    const libros = (await this.libro.load()).filter((l) => l.disponible);

    const { cedula } = await inquirer.prompt([
      {
        type: "select",
        name: "cedula",
        message: "Seleccione un estudiante",
        choices: estudiantes.map((e) => ({ name: e.nombre, value: e.cedula })),
      },
    ]);

    const { libroId } = await inquirer.prompt([
      {
        type: "select",
        name: "libroId",
        message: "Seleccione el libro a prestar",
        choices: libros.map((l) => ({ name: l.titulo, value: l.id })),
      },
    ]);

    const libro = libros.find((l) => l.id === libroId);
    const todosLosLibros = await this.libro.load();

    await this.libro.update(
      todosLosLibros.map((l) => (l.id === libroId ? { ...l, disponible: false } : l)),
    );

    await this.estudiante.update(
      estudiantes.map((e) =>
        e.cedula === cedula
          ? { ...e, librosPrestados: [...(e.librosPrestados || []), libro.titulo] }
          : e,
      ),
    );

    console.log(chalk.bgGreen.white(`Libro "${libro.titulo}" prestado exitosamente`));
    await Helpers.esperar();
  }

  async init() {
    let opcion;
    do {
      console.clear();
      opcion = await Helpers.menu("Menu de estudiantes", this.opciones);
      await this.validarMenu(opcion);
    } while (opcion != 0);
  }
}