const Sequelize = require("sequelize");
const conn = require("../config/db");

const Editions_SC = conn.define("Editions_SC", {
  editionId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
    primaryKey: true
  },
    studyCaseId: {
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

module.exports = Editions_SC;
