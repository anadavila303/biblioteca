import inquirer from 'inquirer';
import chalk from 'chalk';

import EstudianteController from './controllers/EstudianteController.js';
import LibroController from './app/controllers/LibroController.js';

async function init() {
    const setup = await inquirer.prompt([
        {
            type: 'select',
            name: 'opcion',
            message: 'Que quieres hacer?',
            choices: [
                {
                    name: 'Estudiantes',
                    value: '1',
                },
                {
                    name: 'Libros',
                    value: '2',
                },
                {
                    name: 'Salir',
                    value: '3',
                },
            ],
        },
    ]);

    console.log (chalk.green('Opción seleccionada: ' + setup.opcion));
    return setup.opcion;
}