const Sequelize = require("sequelize");
const conn = require("../config/db");

const Answer = conn.define("answer", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'énoncé est obligatoire'
      },
      len: {
        args: [2, 150],
        msg: "La longueur de l'énoncé doit etre entre 5 et 99 caractères"
      }
    }
  },
  correct: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});
module.exports = Answer;
