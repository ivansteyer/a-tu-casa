const { DataTypes } = require('sequelize'); const sequelize = require('./index');
const User = sequelize.define('User',{ id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
email:{type:DataTypes.STRING,unique:true,allowNull:false,validate:{isEmail:true}},
passwordHash:{type:DataTypes.STRING,allowNull:false},
role:{type:DataTypes.ENUM('tenant','owner'),allowNull:false,defaultValue:'tenant'},
name:{type:DataTypes.STRING,allowNull:false}}, { tableName:'users' });
module.exports = User;
