const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  ownerId: { type: DataTypes.INTEGER, allowNull: false },

  // lo usas en vistas
  titulo: { type: DataTypes.STRING, allowNull: false },

  // ===== Atributos que usan tus controllers (mapeados a columnas en español) =====
  propertyType: { type: DataTypes.STRING, field: 'tipo' },                // Tipo: piso completo / habitación
  bedrooms:     { type: DataTypes.INTEGER, field: 'habitaciones' },       // Habitaciones
  sizeM2:       { type: DataTypes.INTEGER, field: 'm2', allowNull: true },// M2 (nueva)
  stayType:     { type: DataTypes.STRING, field: 'modalidad' },           // Tipo de contrato
  neighborhood: { type: DataTypes.STRING, field: 'ubicacion' },           // Ubicación
  terrace:      { type: DataTypes.BOOLEAN, field: 'terraza' },            // Terraza
  availableFrom:{ type: DataTypes.DATEONLY, field: 'disponibleDesde' },   // Disponible desde
  price:        { type: DataTypes.INTEGER, field: 'precio' },             // Precio

  // Extras nuevos que quieres guardar
  elevator:     { type: DataTypes.BOOLEAN, field: 'ascensor', allowNull: true }, // Ascensor (nuevo)

  description:  { type: DataTypes.TEXT, field: 'descripcion' },

  // ===== Nuevos campos que faltaban en la tabla =====
  photos:       { type: DataTypes.TEXT, allowNull: true },                // JSON.stringify([...]) (nuevo)
}, {
  tableName: 'properties',
  // timestamps por defecto: createdAt / updatedAt
});

User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Property;