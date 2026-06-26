import fs from "fs/promises";

export default class Model {
  table = "models";

  getTable() {
    return this.table;
  }

  // Se asegura de que la carpeta db/ exista antes de leer o escribir.
  // Si no existe, la crea automáticamente.
  async asegurarCarpeta() {
    await fs.mkdir("db", { recursive: true });
  }

  // Guarda un nuevo registro agregándolo al final del archivo JSON
  async save(payload) {
    let datos = await this.load();
    datos.push(payload);
    await this.asegurarCarpeta();
    await fs.writeFile(
      `db/${this.getTable()}.json`,
      JSON.stringify(datos, null, 2),
    );
    return payload;
  }

  // Carga todos los registros del archivo JSON correspondiente a la tabla
  async load() {
    try {
      const data = await fs.readFile(`db/${this.getTable()}.json`, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Reemplaza por completo el archivo JSON con el arreglo de datos recibido.
  async update(datos) {
    await this.asegurarCarpeta();
    await fs.writeFile(
      `db/${this.getTable()}.json`,
      JSON.stringify(datos, null, 2),
    );
    return datos;
  }
}
