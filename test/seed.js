const Question = require('../Models/Question');
const Answer = require('../Models/Answer');
const Theme = require('../Models/Theme');
const StudyCase = require('../Models/StudyCase');
const Metier = require('../Models/Metier');
const Sequelize = require('sequelize');

const seed = async () => {
    const theme = await Theme.create({
        name: 'Maintenance'
    });
    const metier = await Metier.create({
        name: 'vibration',
        themeId: theme.id,
    });
    const sc = await StudyCase.create({
        title: 'maintenace provisoir',
        Problematic: 'how to ?',
        metierId: metier.id
    });



    const qst = await Question.create({
        text: 'how much a new car cost ?',
        code: '00000006',
        type: 'SIMPLE',
        metierId: metier.id

    });

    const qst2 = await Question.create({
        text: 'how much a new shoes cost ?',
        code: '00000002',
        type: 'CASE',
        studyCaseId: sc.id,
        metierId: metier.id
    });
// await Promise.all(qst);
    const qst3 = await Question.create({
        text: 'how much a new t-shirt cost ?',
        code: '00000003',
        type: 'CASE',
        studyCaseId: sc.id,
        metierId: metier.id
    });
    const ans = Answer.create({
        text: '12$',
        correct: false,
        questionId: qst2.id
    });
    const ans2 = Answer.create({
        text: '1300$',
        correct: true,
        questionId:qst.id
    });

};
module.exports = seed;
