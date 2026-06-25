import inquirer from "inquirer";
import chalk from "chalk";

import EstudianteController from "./app/controllers/estudianteController.js";
import LibroController from "./app/controllers/libroController.js";

// NOTA: Esto es un EJEMPLO inferido de cómo debería verse tu main.js,
// siguiendo el mismo patrón que EstudianteController.init() usa internamente
// (do...while hasta elegir la opción 0 = "Salir" / "Menu anterior").
// Si tu main.js real es distinto, mandalo y lo ajusto exacto.

const opcionesPrincipal = [
  { name: "Salir", value: 0 },
  { name: "Gestionar Estudiantes", value: 1 },
  { name: "Gestionar Libros", value: 2 },
];

async function menuPrincipal() {
  console.clear();
  console.log(chalk.bgCyan.black("**** Biblioteca - Menú Principal ****"));
  const setup = await inquirer.prompt([
    {
      type: "select",
      name: "optPrincipal",
      message: `¿Qué deseas gestionar?`,
      choices: opcionesPrincipal,
    },
  ]);

  return setup.optPrincipal;
}

async function main() {
  let opcion;
  do {
    opcion = await menuPrincipal();

    if (opcion == 0) {
      console.log(chalk.bgGreen.white("¡Hasta luego!"));
    } else if (opcion == 1) {
      const estudianteController = new EstudianteController(opcion);
      await estudianteController.init();
    } else if (opcion == 2) {
      const libroController = new LibroController(opcion);
      await libroController.init();
    } else {
      console.log(chalk.bgRed.white("Opción no válida"));
    }
  } while (opcion != 0);
}

main();
