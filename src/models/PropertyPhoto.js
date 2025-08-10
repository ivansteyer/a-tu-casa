const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Property = require('./Property');

const PropertyPhoto = sequelize.define('PropertyPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  propertyId: { type: DataTypes.INTEGER, allowNull: false },
  rutaFoto: DataTypes.STRING,
}, { tableName: 'property_photos' });

Property.hasMany(PropertyPhoto, { as: 'fotos', foreignKey: 'propertyId', onDelete: 'CASCADE' });
PropertyPhoto.belongsTo(Property, { foreignKey: 'propertyId' });

module.exports = PropertyPhoto;
