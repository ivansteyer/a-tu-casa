const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },
  tipo: DataTypes.STRING,
  habitaciones: DataTypes.INTEGER,
  ubicacion: DataTypes.STRING,
  terraza: DataTypes.BOOLEAN,
  precio: DataTypes.INTEGER,
  modalidad: DataTypes.STRING,
  disponibleDesde: DataTypes.DATEONLY,
  descripcion: DataTypes.TEXT,
}, { tableName: 'properties' });

User.hasMany(Property, { foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Property;
