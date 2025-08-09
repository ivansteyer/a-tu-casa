const { DataTypes } = require('sequelize'); const sequelize = require('./index'); const User = require('./User'); const Property = require('./Property');
const Match = sequelize.define('Match',{ id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
status:{type:DataTypes.ENUM('liked','matched','rejected'),defaultValue:'liked'} }, { tableName:'matches' });
User.belongsToMany(Property,{ through:Match, foreignKey:'userId' });
Property.belongsToMany(User,{ through:Match, foreignKey:'propertyId' });
module.exports = Match;
