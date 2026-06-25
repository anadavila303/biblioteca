import inquirer from "inquirer";
import chalk from "chalk";
import Libro from "../models/libro.js";
import Helpers from "../helpers/jsonHelper.js";

export default class LibroController {
  opcion = 0;
  opciones = [
    { name: "Menu anterior", value: 0 },
    { name: "Mostrar libros", value: 1 },
    { name: "Crear libro", value: 2 },
    { name: "Editar libro", value: 3 },
    { name: "Eliminar libro", value: 4 },
  ];

  constructor(opcion = 0) {
    this.opcion = opcion;
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
      await this.update();
    } else if (opcion == 4) {
      await this.delete();
    } else {
      console.log(chalk.bgRed.white("Opción no válida"));
    }
  }

  async create() {
    console.clear();
    const payload = await inquirer.prompt([
      { type: "input", name: "titulo", message: "Ingrese el título del libro" },
      { type: "input", name: "autor", message: "Ingrese el autor del libro" },
    ]);

    await this.libro.save({
      table: this.libro.getTable(),
      id: Date.now(),
      ...payload,
      disponible: true,
    });

    console.log(chalk.bgGreen.white("Libro creado exitosamente"));
    await Helpers.esperar();
  }

  async read() {
    console.clear();
    console.log(chalk.bgBlue.white("Mostrando libros..."));
    console.log();
    const libros = await this.libro.load();
    console.table(libros);
    console.log();
    await Helpers.esperar();
  }

  async update() {
    console.clear();
    const libros = await this.libro.load();

    const { libroId } = await inquirer.prompt([
      {
        type: "select",
        name: "libroId",
        message: "Seleccione el libro a editar",
        choices: libros.map((l) => ({ name: l.titulo, value: l.id })),
      },
    ]);

    const actual = libros.find((l) => l.id === libroId);

    const payload = await inquirer.prompt([
      { type: "input", name: "titulo", message: "Nuevo título", default: actual.titulo },
      { type: "input", name: "autor", message: "Nuevo autor", default: actual.autor },
      {
        type: "select",
        name: "disponible",
        message: "¿Disponible?",
        choices: [
          { name: "Sí", value: true },
          { name: "No", value: false },
        ],
      },
    ]);

    await this.libro.update(
      libros.map((l) => (l.id === libroId ? { ...l, ...payload } : l)),
    );

    console.log(chalk.bgGreen.white("Libro actualizado exitosamente"));
    await Helpers.esperar();
  }

  async delete() {
    console.clear();
    const libros = await this.libro.load();

    const { libroId } = await inquirer.prompt([
      {
        type: "select",
        name: "libroId",
        message: "Seleccione el libro a eliminar",
        choices: libros.map((l) => ({ name: l.titulo, value: l.id })),
      },
    ]);

    await this.libro.update(libros.filter((l) => l.id !== libroId));

    console.log(chalk.bgGreen.white("Libro eliminado exitosamente"));
    await Helpers.esperar();
  }

  async init() {
    let opcion;
    do {
      console.clear();
      opcion = await Helpers.menu("Menu de libros", this.opciones);
      await this.validarMenu(opcion);
    } while (opcion != 0);
  }
}
