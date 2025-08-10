const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const OwnerPreference = sequelize.define('OwnerPreference', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  tipoContrato: DataTypes.STRING,
  presupuestoMinimo: DataTypes.INTEGER,
  mascotas: DataTypes.STRING,
  maxPersonas: DataTypes.INTEGER,
  profesionPreferida: DataTypes.STRING,
  nacionalidadPreferida: DataTypes.STRING,
  otros: DataTypes.TEXT,
}, { tableName: 'owner_preferences' });

User.hasOne(OwnerPreference, { foreignKey: 'ownerId' });
OwnerPreference.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = OwnerPreference;
