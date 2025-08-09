CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, passwordHash TEXT NOT NULL,
  role TEXT CHECK(role IN ('tenant','owner')) NOT NULL DEFAULT 'tenant', name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tenant_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL,
  profession TEXT, seniority TEXT, salary INTEGER, legalStatus TEXT, nationality TEXT, pets TEXT, roommates TEXT,
  propertyType TEXT, bedrooms TEXT, locations TEXT, terrace TEXT, budget INTEGER, modality TEXT, moveIn TEXT, status TEXT,
  linkedinUrl TEXT, cvPath TEXT, selfiePath TEXT, idDocPath TEXT, lastPayslipPath TEXT, workContractPath TEXT, isValidated INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER, title TEXT NOT NULL, type TEXT,
  bedrooms INTEGER, location TEXT, hasTerrace INTEGER, price INTEGER, modality TEXT, availableFrom TEXT, description TEXT, photoPath TEXT,
  FOREIGN KEY (ownerId) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, propertyId INTEGER, status TEXT,
  FOREIGN KEY (userId) REFERENCES users(id), FOREIGN KEY (propertyId) REFERENCES properties(id));
