const { DataTypes } = require('sequelize'); const sequelize = require('./index'); const User = require('./User');
const TenantProfile = sequelize.define('TenantProfile',{ id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
profession:DataTypes.STRING,seniority:DataTypes.STRING,salary:DataTypes.INTEGER,legalStatus:DataTypes.STRING,
nationality:DataTypes.STRING,pets:DataTypes.STRING,roommates:DataTypes.STRING,
propertyType:DataTypes.STRING,bedrooms:DataTypes.STRING,locations:DataTypes.STRING,terrace:DataTypes.STRING,
budget:DataTypes.INTEGER,modality:DataTypes.STRING,moveIn:DataTypes.STRING,status:DataTypes.STRING,
linkedinUrl:DataTypes.STRING,cvPath:DataTypes.STRING,selfiePath:DataTypes.STRING,
idDocPath:DataTypes.STRING,lastPayslipPath:DataTypes.STRING,workContractPath:DataTypes.STRING,
isValidated:{type:DataTypes.BOOLEAN,defaultValue:false}}, { tableName:'tenant_profiles' });
const opts={ foreignKey:'userId' }; User.hasOne(TenantProfile,opts); TenantProfile.belongsTo(User,opts);
module.exports = TenantProfile;
