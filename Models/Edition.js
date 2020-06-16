const Sequelize = require("sequelize");
const conn = require("../config/db");

const Edition = conn.define("edition", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Edition;
