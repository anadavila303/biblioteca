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