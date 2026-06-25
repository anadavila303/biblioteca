import inquirer from "inquirer";
import chalk from "chalk";

export default class Helper {
  // Pausa la pantalla y espera que el usuario presione una tecla
  static async esperar() {
    const setup = await inquirer.prompt([
      {
        type: "input",
        name: "awaitTime",
        message: `Teclee una tecla para continuar...`,
      },
    ]);
    console.log(chalk.bgGray.black(setup.awaitTime));
  }

  // Muestra un menú genérico con título y opciones, y retorna la opción elegida
  static async menu(titulo, opciones) {
    console.clear();
    console.log(chalk.bgCyan.white(`**** ${titulo} ****`));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optCarrera",
        message: `¿Qué deseas hacer?`,
        choices: opciones,
      },
    ]);
    return setup.optCarrera;
  }
}
