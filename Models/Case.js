const Sequelize = require("sequelize");
const conn = require("../config/db");

const Theme = conn.define("case", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Nom est obligatoire'
      },
      len: {
        args: [2, 49],
        msg: "La longueur de la chaîne doit etre entre 2 et 49"
      }
    }
  }
});
module.exports = Case;
