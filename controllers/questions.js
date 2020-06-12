const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Questions = require('../Models/Question');
const Answers = require('../Models/Answer');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');
const {codeBarFactory} = require('../utils/helpers');
module.exports.getQuestions = asyncHandler(async (req, res, next) => {
  res.status(HttpStatus.OK).json(res.advancedResults);
});

module.exports.getQuestionById = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const qst = await Questions.findByPk(id,{
    include: [
      Answers
    ],
    order: [
      [ Answers, 'correct', 'DESC' ],
    ]
  });
  if(!qst) {
    return next(
      new ErrorResponse(`Answers non trouvé avec id ${req.body.id}`,HttpStatus.NOT_FOUND)
    )
  }
  res.status(HttpStatus.OK).json({ success: true, data: qst });
});
module.exports.addQuestion = asyncHandler(async (req, res, next) => {
  let qst;
  try {
    results = await conn.transaction(async t => {
      try {
        qst = await Questions.create(req.body, {
          include: Answers
        });
        const name = new Date().valueOf() + '_' + qst.dataValues.code;
        codeBarFactory(qst.dataValues.code,name);
        qst.image = [name + '.png'];
        await qst.save({transaction: t});
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({success: true, data: qst});
  } catch (e) {
    console.error(e);
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer',HttpStatus.BAD_REQUEST)
    );
  }
});
module.exports.addBulkQuestions = asyncHandler(async (req, res, next) => {
  let qst = [];
  try {
    results = await conn.transaction(async t => {
      try {
        ans = await Questions.bulkCreate(req.body, {transaction: t});
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({success: true, data: qst});
  } catch (e) {
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer',HttpStatus.BAD_REQUEST)
    )
  }
});

module.exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const  upId = Questions.update(req.body,{
    where: { id: id }
  });
  const qst = await Questions.findByPk(id);
  res.status(HttpStatus.OK).json({ success: true, data: qst });
});

module.exports.destroyQuestion = asyncHandler(async (req, res, next) => {
  let qst = await Questions.findById(req.params.id);
  if (!qst) {
    return next(
      new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
    );
  }
  qst.destroy();
  res.status(HttpStatus.OK).json({ success: true, data: {} });
});
