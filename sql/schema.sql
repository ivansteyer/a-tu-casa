CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, passwordHash TEXT NOT NULL,
  role TEXT CHECK(role IN ('tenant','owner')) NOT NULL DEFAULT 'tenant', name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tenant_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL,
  profession TEXT, seniority TEXT, salary INTEGER, legalStatus TEXT, nationality TEXT, pets TEXT, roommates TEXT,
  propertyType TEXT, bedrooms TEXT, locations TEXT, terrace TEXT, budget INTEGER, modality TEXT, moveIn TEXT, status TEXT,
  linkedinUrl TEXT, cvPath TEXT, selfiePath TEXT, idDocPath TEXT, lastPayslipPath TEXT, workContractPath TEXT, isValidated INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS owner_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER NOT NULL,
  nombre TEXT, telefono TEXT, descripcion TEXT, fotoPerfil TEXT,
  FOREIGN KEY (ownerId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS owner_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER NOT NULL,
  tipoContrato TEXT, presupuestoMinimo INTEGER, mascotas TEXT, maxPersonas INTEGER,
  profesionPreferida TEXT, nacionalidadPreferida TEXT, otros TEXT,
  FOREIGN KEY (ownerId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER, titulo TEXT NOT NULL, tipo TEXT,
  habitaciones INTEGER, ubicacion TEXT, terraza INTEGER, precio INTEGER, modalidad TEXT, disponibleDesde TEXT, descripcion TEXT,
  FOREIGN KEY (ownerId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS property_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT, propertyId INTEGER, rutaFoto TEXT,
  FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, propertyId INTEGER, status TEXT,
  FOREIGN KEY (userId) REFERENCES users(id), FOREIGN KEY (propertyId) REFERENCES properties(id));
