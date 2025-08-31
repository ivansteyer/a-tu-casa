const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },

  propertyType: { type: DataTypes.STRING, field: 'tipo' },
  bedrooms: { type: DataTypes.INTEGER, field: 'habitaciones' },
  sizeM2: { type: DataTypes.INTEGER, field: 'm2', allowNull: true },
  stayType: { type: DataTypes.STRING, field: 'modalidad' },
  neighborhood: { type: DataTypes.STRING, field: 'ubicacion' },
  terrace: { type: DataTypes.BOOLEAN, field: 'terraza' },
  availableFrom: { type: DataTypes.DATEONLY, field: 'disponibleDesde' },
  price: { type: DataTypes.INTEGER, field: 'precio' },

  elevator: { type: DataTypes.BOOLEAN, field: 'ascensor', allowNull: true },
  floorNumber: { type: DataTypes.INTEGER, field: 'altura', allowNull: true },

  description: { type: DataTypes.TEXT, field: 'descripcion' },

  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  photos: { type: DataTypes.TEXT, allowNull: true }, // JSON
}, {
  tableName: 'properties',
});

User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Property;