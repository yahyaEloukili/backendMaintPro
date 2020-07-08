const Question = require('../Models/Question');
const Answer = require('../Models/Answer');
const StudyCase = require('../Models/StudyCase');
const Metier = require('../Models/Metier');
const Theme = require('../Models/Theme');
const Edition = require('../Models/Edition');
const Editions_SC = require('../Models/Editions_SC');
const Editions_Questions = require('../Models/Editions_Questions');

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
    // foreignKey: { allowNull: true }
    onDelete: 'cascade', hooks: true
  });
  Question.belongsTo(StudyCase, {
    foreignKey: { allowNull: true },
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
  Edition.belongsToMany(Question, 
    {
    through: Editions_Questions,
      constraints: false,
      foreignKeyConstraint: false
    }
  );
  Question.belongsToMany(Edition, 
    {
    through: Editions_Questions,
      constraints: false,
      foreignKeyConstraint: false
    }
  );
  Edition.belongsToMany(StudyCase, 
    {
     through: Editions_SC,
      constraints: false,
      foreignKeyConstraint: false
    }
  );
  StudyCase.belongsToMany(Edition, 
    {
     through: Editions_SC,
      constraints: false,
      foreignKeyConstraint: false
    }
  );
  
};

module.exports = associations;
