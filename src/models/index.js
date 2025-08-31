const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();
// Resolve to project-root/config/dev.sqlite by default
const url =
  process.env.DATABASE_URL ||
  "sqlite:" + path.resolve(__dirname, "../../config/dev.sqlite");
const sequelize = new Sequelize(url, { logging: false });
module.exports = sequelize;
 