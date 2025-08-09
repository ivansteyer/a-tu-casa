const { DataTypes } = require('sequelize'); const sequelize = require('./index'); const User = require('./User');
const Property = sequelize.define('Property',{ id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
title:{type:DataTypes.STRING,allowNull:false}, type:DataTypes.STRING, bedrooms:DataTypes.INTEGER, location:DataTypes.STRING,
hasTerrace:DataTypes.BOOLEAN, price:DataTypes.INTEGER, modality:DataTypes.STRING, availableFrom:DataTypes.STRING,
description:DataTypes.TEXT, photoPath:DataTypes.STRING }, { tableName:'properties' });
User.hasMany(Property,{ foreignKey:'ownerId' }); Property.belongsTo(User,{ as:'owner', foreignKey:'ownerId' });
module.exports = Property;
