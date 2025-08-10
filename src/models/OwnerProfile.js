const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const OwnerProfile = sequelize.define('OwnerProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  nombre: DataTypes.STRING,
  telefono: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  fotoPerfil: DataTypes.STRING,
}, { tableName: 'owner_profiles' });

User.hasOne(OwnerProfile, { foreignKey: 'ownerId' });
OwnerProfile.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = OwnerProfile;
