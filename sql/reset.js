const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, "../config/dev.sqlite");
const dbDir = path.dirname(dbPath);
const schemaPath = path.resolve(__dirname, "schema.sql");

// 1) Asegurar carpeta
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 2) Leer esquema
const schema = fs.readFileSync(schemaPath, "utf-8");

// 3) Borrar BD anterior (si existe)
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

// 4) Crear BD y ejecutar esquema
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("No se pudo abrir/crear la BD:", dbPath, err);
    process.exit(1);
  }
});

db.exec(schema, (err) => {
  if (err) {
    console.error("Error al ejecutar el schema:", err);
    process.exit(1);
  }
  console.log("DB reset ok en", dbPath);
  process.exit(0);
});
