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

    console.log (chalk.bgGray.green('Opción seleccionada: ' + setup.opcion));
    return setup.opcion;
}

async function MainMenu(opcion) {
    if (opcion === '1') {
        const estudianteController = new EstudianteController(opcion);
        await estudianteController.init();
    }   else if (opcion === '2') {
        const libroController = new LibroController(opcion);
        await libroController.init();
    }   else if (opcion === '3') {
        console.log(chalk.bgGray.yellow('Hasta luego'));
    }   else {
        console.log(
            chalk.bgGray.red(
            'Opción no válida'

        )
    );
} 
}

let opcion; 
do{
    console.clear();
    opcion = await init();
    await MainMenu(opcion);
}   while (opcion !== '3');