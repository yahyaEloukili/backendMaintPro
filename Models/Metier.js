const Sequelize = require("sequelize");
const conn = require("../config/db");

const Metier = conn.define("metier", {
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
        msg: 'nom est obligatoire'
      },
      len: {
        // args: [5, 49],
        // msg: "La longueur de la chaîne doit etre entre 5 et 49"
      }
    }
  }
});

module.exports = Metier;
