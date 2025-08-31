const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },

  // ===== Atributos que usan tus controllers (mapeados a columnas en español) =====
  propertyType: { type: DataTypes.STRING,  field: 'tipo' },                // Tipo de propiedad
  bedrooms:     { type: DataTypes.INTEGER, field: 'habitaciones' },       // Número de habitaciones
  sizeM2:       { type: DataTypes.INTEGER, field: 'm2', allowNull: true },// Metros cuadrados
  stayType:     { type: DataTypes.STRING,  field: 'modalidad' },           // Tipo de contrato
  neighborhood: { type: DataTypes.STRING,  field: 'ubicacion' },           // Ubicación
  terrace:      { type: DataTypes.BOOLEAN, field: 'terraza' },            // Terraza
  availableFrom:{ type: DataTypes.DATEONLY,field: 'disponibleDesde' },    // Disponible desde
  price:        { type: DataTypes.INTEGER, field: 'precio' },             // Precio

  elevator:     { type: DataTypes.BOOLEAN, field: 'ascensor', allowNull: true }, // Ascensor
  floorNumber:  { type: DataTypes.INTEGER, field: 'altura', allowNull: true },   // Altura/piso

  description: { type: DataTypes.TEXT, field: 'descripcion' },

  published:    { type: DataTypes.BOOLEAN, defaultValue: true },          // Publicada
  photos:       { type: DataTypes.TEXT, allowNull: true },                // JSON.stringify([...])
}, {
  tableName: 'properties',
});

User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Property;