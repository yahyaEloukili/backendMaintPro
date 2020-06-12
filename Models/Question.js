const Sequelize = require("sequelize");
const conn = require("../config/db");
const DataTypes = require("sequelize").DataTypes;
const Metier = require("./Metier")
const Theme = require("./Theme")
const {fillZeros} = require('../utils/helpers');
const Question = conn.define("question", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'énoncé est est obligatoire'
      },
      len: {
        args: [2],
        msg: "La longueur de la chaîne doit etre minimum de 5 caractères"
      }
    }
  },
  code: {
    type: DataTypes.INTEGER(8).UNSIGNED.ZEROFILL,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    get() {
      if (this.getDataValue('code'))
        return fillZeros(this.getDataValue('code').toString());
      return this.getDataValue('code')
    },
    validate: {
      notEmpty: {
        msg: 'code est est obligatoire'
      },
    }
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',

    get() {
      if (this.getDataValue('image'))
        return this.getDataValue('image').split(';')
      return this.getDataValue('image')
    },
    set(val) {
      this.setDataValue('image', val.join(';'));
    },
  },
  type: {
    type: Sequelize.ENUM,
    values: ['SIMPLE', 'CASE'],
    allowNull: false,
    defaultValue: 'SIMPLE',
  },
  // metier_nom: {
  //   type: Sequelize.STRING
  // },
  // theme_nom: {
  //   type: Sequelize.STRING
  // },
});

// categorie attribut
// Question.beforeCreate(async question => {
//   const metier = await Metier.findById(question.metierId);

//   const theme = await Theme.findById(metier.themeId);

//   const metierNom = metier.name;
//   question.metier_nom = metierNom;
//   const themeNom = theme.name;
//   question.theme_nom = themeNom;
// });
module.exports = Question;
