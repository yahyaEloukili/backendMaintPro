const Sequelize = require("sequelize");
const conn = require("../config/db");

const Editions_Questions = conn.define("Editions_Questions", {
  editionId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
    primaryKey: true
  },
  questionId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
    primaryKey: true
  },
},
  {
    freezeTableName: true,
  }
);

module.exports = Editions_Questions;
