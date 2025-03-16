import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("AppDatabase.db");

export const initDatabase = async () => {
  try {
    // Inicializar el modo WAL
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    // Crear tablas si no existen
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Docentes (
          id TEXT PRIMARY KEY NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT,
          telefono TEXT,
          materias TEXT,
          grupos TEXT,
          especialidad TEXT
        );
        CREATE TABLE IF NOT EXISTS Materias (
          id TEXT PRIMARY KEY NOT NULL,
          nombre TEXT NOT NULL,
          codigo TEXT,
          horasSemana INTEGER,
          creditos INTEGER,
          semestre TEXT,
          color TEXT,
          descripcion TEXT
        );
        CREATE TABLE IF NOT EXISTS Grupos (
          id TEXT PRIMARY KEY NOT NULL,
          nombre TEXT NOT NULL,
          grado INTEGER,
          turno TEXT,
          tutor TEXT,
          materias TEXT
        );
        CREATE TABLE IF NOT EXISTS Horarios (
          id TEXT PRIMARY KEY NOT NULL,
          docenteId TEXT,
          dia TEXT NOT NULL,
          horaInicio TEXT NOT NULL,
          horaFin TEXT NOT NULL,
          materiaId TEXT,
          salonId TEXT,
          color TEXT,
          FOREIGN KEY (docenteId) REFERENCES Docentes(id),
          FOREIGN KEY (materiaId) REFERENCES Materias(id),
          FOREIGN KEY (salonId) REFERENCES Grupos(id)
        );
        CREATE TABLE IF NOT EXISTS Activities (
          id TEXT PRIMARY KEY NOT NULL,
          activityName TEXT NOT NULL,
          activityDate TEXT NOT NULL,
          activityTime TEXT NOT NULL,
          notes TEXT
        );
      `);

    // Verificar y agregar columnas faltantes
    const docentesSchema = await db.getAllAsync("PRAGMA table_info(Docentes);");
    const materiasSchema = await db.getAllAsync("PRAGMA table_info(Materias);");
    const gruposSchema = await db.getAllAsync("PRAGMA table_info(Grupos);");

    // Check and add especialidad to Docentes
    const hasEspecialidad = docentesSchema.some(
      (col) => col.name === "especialidad"
    );
    if (!hasEspecialidad) {
      await db.execAsync(`ALTER TABLE Docentes ADD COLUMN especialidad TEXT;`);
      console.log("Added especialidad column to Docentes");
    }

    // Check and add descripcion to Materias
    const hasMateriasDescripcion = materiasSchema.some(
      (col) => col.name === "descripcion"
    );
    if (!hasMateriasDescripcion) {
      await db.execAsync(`ALTER TABLE Materias ADD COLUMN descripcion TEXT;`);
      console.log("Added descripcion column to Materias");
    }

    // Check and add materias to Grupos
    const hasGruposMaterias = gruposSchema.some(
      (col) => col.name === "materias"
    );
    if (!hasGruposMaterias) {
      await db.execAsync(`ALTER TABLE Grupos ADD COLUMN materias TEXT;`);
      console.log("Added materias column to Grupos");
    }

    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw error;
  }
};

export const fetchAll = async (table) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM ${table};`);
    console.log(`Resultado de fetchAll para ${table}:`, result);
    return result || []; // Returns empty array if no results
  } catch (error) {
    console.error(`Error al obtener ${table}:`, error);
    return [];
  }
};

// Updated validFields to match the schema
const validFields = {
  Docentes: [
    "id",
    "nombre",
    "apellido",
    "email",
    "telefono",
    "materias",
    "grupos",
    "especialidad", // Added to match schema
  ],
  Materias: [
    "id",
    "nombre",
    "codigo",
    "horasSemana",
    "creditos",
    "semestre",
    "color",
    "descripcion", // Added to match schema
  ],
  Grupos: [
    "id",
    "nombre",
    "grado",
    "turno",
    "tutor",
    "materias", // Added to match schema
  ],
  Horarios: [
    "id",
    "docenteId",
    "dia",
    "horaInicio",
    "horaFin",
    "materiaId",
    "salonId",
    "color",
  ],
  Activities: ["id", "activityName", "activityDate", "activityTime", "notes"],
};

export const insert = async (table, data) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => validFields[table].includes(key))
    );
    // Convert arrays to strings if necessary (e.g., materias, grupos)
    if (filteredData.materias && Array.isArray(filteredData.materias)) {
      filteredData.materias = JSON.stringify(filteredData.materias);
    }
    if (filteredData.grupos && Array.isArray(filteredData.grupos)) {
      filteredData.grupos = JSON.stringify(filteredData.grupos);
    }
    console.log(`Inserting into ${table}:`, filteredData);
    const keys = Object.keys(filteredData).join(",");
    const placeholders = Object.keys(filteredData)
      .map(() => "?")
      .join(",");
    const values = Object.values(filteredData);
    await db.runAsync(
      `INSERT INTO ${table} (${keys}) VALUES (${placeholders});`,
      values
    );
  } catch (error) {
    console.error(`Error al insertar en ${table}:`, error);
    throw error;
  }
};

export const update = async (table, data, id) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => validFields[table].includes(key))
    );
    if (filteredData.materias && Array.isArray(filteredData.materias)) {
      filteredData.materias = JSON.stringify(filteredData.materias);
    }
    if (filteredData.grupos && Array.isArray(filteredData.grupos)) {
      filteredData.grupos = JSON.stringify(filteredData.grupos);
    }
    console.log(`Updating ${table} with ID ${id}:`, filteredData);
    const setClause = Object.keys(filteredData)
      .map((key) => `${key} = ?`)
      .join(",");
    const values = [...Object.values(filteredData), id];
    const result = await db.runAsync(
      `UPDATE ${table} SET ${setClause} WHERE id = ?;`,
      values
    );
    console.log(`Update result for ${table}:`, result);
  } catch (error) {
    console.error(`Error al actualizar en ${table}:`, error);
    throw error;
  }
};

export const remove = async (table, id) => {
  try {
    await db.runAsync(`DELETE FROM ${table} WHERE id = ?;`, [id]);
  } catch (error) {
    console.error(`Error al eliminar de ${table}:`, error);
    throw error;
  }
};

export const exportBackup = async () => {
  try {
    const tables = ["Docentes", "Materias", "Grupos", "Horarios", "Activities"];
    const backupData = {};

    for (const table of tables) {
      backupData[table] = await fetchAll(table);
    }

    return JSON.stringify(backupData, null, 2); // Pretty print for readability
  } catch (error) {
    console.error("Error al exportar respaldo:", error);
    return null;
  }
};

export const importBackup = async (backupData) => {
  try {
    const data = JSON.parse(backupData);
    for (const table of Object.keys(data)) {
      await db.runAsync(`DELETE FROM ${table};`);
      for (const item of data[table]) {
        await insert(table, item);
      }
    }
    console.log("Datos importados correctamente");
  } catch (error) {
    console.error("Error al importar respaldo:", error);
    throw error;
  }
};
