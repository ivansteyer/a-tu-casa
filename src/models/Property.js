const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  // Clave foránea
  ownerId: { type: DataTypes.INTEGER, allowNull: false },

  // Puedes mantener "titulo" porque quizá lo uses en otras vistas
  titulo: { type: DataTypes.STRING, allowNull: false },

  // ====== Mapeos a los nombres que usa el controller (EN) ======
  propertyType: { type: DataTypes.STRING, field: 'tipo' },            // controller: propertyType
  bedrooms:     { type: DataTypes.INTEGER, field: 'habitaciones' },   // controller: bedrooms
  neighborhood: { type: DataTypes.STRING, field: 'ubicacion' },       // controller: neighborhood
  terrace:      { type: DataTypes.BOOLEAN, field: 'terraza' },        // controller: terrace
  price:        { type: DataTypes.INTEGER, field: 'precio' },         // controller: price
  stayType:     { type: DataTypes.STRING, field: 'modalidad' },       // controller: stayType
  availableFrom:{ type: DataTypes.DATEONLY, field: 'disponibleDesde' },
  description:  { type: DataTypes.TEXT, field: 'descripcion' },

  // ====== Campos nuevos que el controller espera ======
  published:    { type: DataTypes.BOOLEAN, defaultValue: true },
  // Guardaremos JSON.stringify([...]) aquí si quieres múltiples fotos
  photos:       { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'properties',
  // timestamps por defecto true => crea createdAt/updatedAt (el controller las usa para ordenar)
});

User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Property;