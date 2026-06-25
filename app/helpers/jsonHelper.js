<<<<<<< HEAD
// app/helpers/jsonHelper.js

// Función para simular que guardamos datos en el sistema
export const guardarDatos = (clave, objeto) => {
    console.log(`💾 [Helper] Guardando con éxito en la tabla [${clave}]...`);
    console.log(`📊 Datos recibidos:`, JSON.stringify(objeto, null, 2));
    return true;
};

// Función para simular que leemos datos del sistema
export const obtenerDatos = (clave) => {
    console.log(`🔍 [Helper] Buscando datos en la tabla [${clave}]...`);
    // Simulamos que encontramos un dato viejo
    return { mensaje: "Datos de prueba leídos correctamente" };
};
=======
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
>>>>>>> 2cfd8a61827b3cce8f94a25068d615bb81f69b7a
