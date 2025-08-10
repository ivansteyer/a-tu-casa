const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();
const url =
  process.env.DATABASE_URL ||
  "sqlite:" + path.join(__dirname, "../config/dev.sqlite");
const sequelize = new Sequelize(url, { logging: false });
module.exports = sequelize;
