import inquirer from "inquirer";
import chalk from "chalk";

import EstudianteController from "./app/controllers/estudianteController.js";
import LibroController from "./app/controllers/libroController.js";

async function init() {
  const setup = await inquirer.prompt([
    {
      type: "select",
      name: "opcion",
      message: `¿Qué quieres hacer?`,
      choices: [
        {
          name: "Estudiantes",
          value: "1",
        },
        {
          name: "Libros",
          value: "2",
        },
        {
          name: "Salir",
          value: "3",
        },
      ],
    },
  ]);

  console.log(chalk.bgGray.black("Opción seleccionada: " + setup.opcion));
  return setup.opcion;
}

async function MainMenu(opcion) {
  if (opcion === "1") {
    const estudianteController = new EstudianteController(opcion);
    await estudianteController.init();
  } else if (opcion === "2") {
    const libroController = new LibroController(opcion);
    await libroController.init();
  } else if (opcion === "3") {
    console.log(chalk.bgGreen.white("¡Hasta luego!"));
  } else {
    console.log(
      chalk.bgRed.white(
        "Opción no válida. Por favor, selecciona una opción válida.",
      ),
    );
  }
}

let opcion;
do {
  console.clear();
  opcion = await init();
  await MainMenu(opcion);
} while (opcion !== "3");