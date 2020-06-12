const Question = require('../Models/Question');
const Answer = require('../Models/Answer');
const StudyCase = require('../Models/StudyCase');
const Metier = require('../Models/Metier');
const Theme = require('../Models/Theme');

const associations = () => {
  Theme.hasMany(Metier, {
    foreignKey: { allowNull: true }
  });
  // Appareil stock one to many association
  Metier.belongsTo(Theme, {
    foreignKey: { allowNull: true },

  });

  Question.hasMany(Answer, {
    foreignKey: { allowNull: true }
  });
  Answer.belongsTo(Question, {
    foreignKey: { allowNull: true }
  });

  StudyCase.hasMany(Question, {
    foreignKey: { allowNull: true }
  });
  Question.belongsTo(StudyCase, {
    foreignKey: { allowNull: true }
  });

  Metier.hasMany(StudyCase, {
    foreignKey: { allowNull: true }
  });
  StudyCase.belongsTo(Metier, {
    foreignKey: { allowNull: true }
  });
  Metier.hasMany(Question, {
    foreignKey: { allowNull: true }
  });
  Question.belongsTo(Metier, {
    foreignKey: { allowNull: true }
  });



};

module.exports = associations;
