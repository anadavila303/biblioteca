import inquirer from "inquirer";
import chalk from "chalk";

import Estudiante from "../models/estudiante.js";
import Libro from "../models/libro.js"; // Importamos el modelo de libros
import Helper from "../helpers/jsonHelper.js";

export default class EstudianteController {
  opcion = 0;
  opciones = [
    { name: "Menu anterior", value: 0 },
    { name: "Agregar Estudiante", value: 1 },
    { name: "Mostrar Estudiantes", value: 2 },
    { name: "Prestar Libro a Estudiante", value: 3 },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.estudiante = new Estudiante();
    this.libro = new Libro(); // Inicializamos el modelo de libros en el constructor
  }

  // Evalúa la opción seleccionada y ejecuta el método correspondiente
  async validarMenu(opcion) {
    if (opcion == 0) {
      return;
    } else if (opcion == 1) {
      await this.create();
    } else if (opcion == 2) {
      await this.read();
    } else if (opcion == 3) {
      await this.lendBook();
    } else {
      console.log(chalk.bgRed.white("Opción no válida"));
    }
  }

  // Crea un nuevo estudiante y lo guarda usando su modelo
  async create() {
    console.clear();
    console.log(chalk.bgGreen.white("Creando estudiante..."));

    const payload = await inquirer.prompt([
      {
        type: "input",
        name: "cedula",
        message: `Ingrese la cédula del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "La cédula no puede estar vacía.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "nombre",
        message: `Ingrese el nombre del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre del estudiante no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "edad",
        message: `Ingrese la edad del estudiante:`,
        validate: (input) => {
          if (!/^\d+$/.test(input.trim())) {
            return "La edad debe ser un número entero.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "sexo",
        message: `Ingrese el sexo del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El sexo no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "carrera",
        message: `Ingrese la carrera del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "La carrera no puede estar vacía.";
          }
          return true;
        },
      },
    ]);

    const existe = await this.validateEstudiante(payload.cedula);
    if (existe) {
      console.log(
        chalk.bgRed.white("No se puede crear el estudiante, ya existe"),
      );
      console.log();
      await Helper.esperar();
      return;
    }

    // Guarda el registro utilizando los métodos internos del modelo estudiante
    await this.estudiante.save({
      table: this.estudiante.getTable(),
      cedula: payload.cedula,
      nombre: payload.nombre,
      edad: Number(payload.edad),
      sexo: payload.sexo,
      carrera: payload.carrera,
      librosPrestados: [], // Inicializamos la lista de libros vacía
    });

    console.log();
    console.log(chalk.bgGreen.white("Estudiante creado exitosamente"));

    await Helper.esperar();
  }

  // Muestra la lista completa de estudiantes en formato de tabla
  async read() {
    console.clear();
    console.log(chalk.bgBlue.white("Mostrando estudiantes..."));
    console.log();
    const estudiantes = await this.estudiante.load();

    if (estudiantes.length === 0) {
      console.log(chalk.bgRed.white("No hay estudiantes registrados."));
      await Helper.esperar();
      return;
    }

    console.table(estudiantes);
    console.log();
    await Helper.esperar();
  }

  // Gestiona el préstamo de un libro al estudiante seleccionado
  async lendBook() {
    console.clear();
    console.log(chalk.bgBlue.white("Asignando préstamo de libro a estudiante..."));

    // Cargamos los datos desde los métodos load() de cada modelo
    const estudiantes = await this.estudiante.load();
    const libros = await this.libro.load();

    if (estudiantes.length === 0) {
      console.log(chalk.bgRed.white("No hay estudiantes registrados."));
      await Helper.esperar();
      return;
    }

    // Filtramos los libros para mostrar únicamente los que tengan disponible: true
    const librosDisponibles = libros.filter((libro) => libro.disponible === true);

    if (librosDisponibles.length === 0) {
      console.log(chalk.bgRed.white("No hay libros disponibles para préstamo."));
      await Helper.esperar();
      return;
    }

    // Preguntamos mediante menú interactivo cuál estudiante recibirá el préstamo
    const { estudianteCedula } = await inquirer.prompt([
      {
        type: "select",
        name: "estudianteCedula",
        message: "Seleccione un estudiante:",
        choices: estudiantes.map((estudiante) => ({
          name: estudiante.nombre,
          value: estudiante.cedula,
        })),
      },
    ]);

    // Preguntamos cuál libro de la lista de disponibles se va a prestar
    const { libroId } = await inquirer.prompt([
      {
        type: "select",
        name: "libroId",
        message: "Seleccione el libro a prestar:",
        choices: librosDisponibles.map((libro) => ({
          name: libro.titulo,
          value: libro.id,
        })),
      },
    ]);

    const estudianteSeleccionado = estudiantes.find(
      (est) => est.cedula === estudianteCedula,
    );
    const libroSeleccionado = libros.find((lib) => lib.id === libroId);

    if (!estudianteSeleccionado || !libroSeleccionado) {
      console.log(chalk.bgRed.white("Selección inválida."));
      await Helper.esperar();
      return;
    }

    // Modificamos el estado del libro original pasándolo a no disponible (false)
    const librosActualizados = libros.map((lib) =>
      lib.id === libroId ? { ...lib, disponible: false } : lib,
    );

    // Si el estudiante no cuenta con la propiedad 'librosPrestados', se la inicializamos
    if (!estudianteSeleccionado.librosPrestados) {
      estudianteSeleccionado.librosPrestados = [];
    }

    // Agregamos la información del préstamo al arreglo del estudiante seleccionado
    const estudiantesActualizados = estudiantes.map((est) => {
      if (est.cedula === estudianteCedula) {
        return {
          ...est,
          librosPrestados: [
            ...estudianteSeleccionado.librosPrestados,
            {
              idLibro: libroSeleccionado.id,
              titulo: libroSeleccionado.titulo,
              fechaPrestamo: new Date().toLocaleDateString(),
            },
          ],
        };
      }
      return est;
    });

    // Guardamos los cambios usando los respectivos métodos de actualización de tus modelos
    await this.libro.update(librosActualizados);
    await this.estudiante.update(estudiantesActualizados);

    console.log();
    console.log(
      chalk.bgGreen.white(
        `Libro "${libroSeleccionado.titulo}" prestado con éxito a ${estudianteSeleccionado.nombre}`,
      ),
    );
    await Helper.esperar();
  }

  // Verifica si ya existe un estudiante registrado con la misma cédula
  async validateEstudiante(cedula) {
    const estudiante = await this.buscarEstudiante(cedula);
    if (estudiante) {
      return true;
    }
    return false;
  }

  // Busca dentro de la base de datos un estudiante por cédula
  async buscarEstudiante(cedula) {
    const estudiantes = await this.estudiante.load();
    const estudiante = estudiantes.find(
      (estudiante) => String(estudiante.cedula).trim() === String(cedula).trim(),
    );
    return estudiante;
  }

  // Inicializa el bucle continuo del menú interactivo hasta seleccionar salir (0)
  async init() {
    let opcion;
    do {
      console.clear();
      opcion = await Helper.menu("Menú de Estudiantes", this.opciones);
      await this.validarMenu(opcion);
    } while (opcion != 0);
  }
}
