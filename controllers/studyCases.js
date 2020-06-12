const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const StudyCases = require('../Models/StudyCase');
const Questions = require('../Models/Question');
const Answers = require('../Models/Answer');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');
const {codeBarFactory} = require('../utils/helpers');

module.exports.getStudyCases = asyncHandler(async (req, res, next) => {
  res.status(HttpStatus.OK).json(res.advancedResults);
});

module.exports.getStudyCaseByid = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const studycase = await StudyCases.findByPk(id,{
    include: [{
      model: Questions,
      include: [Answers]
    }]
  });
  if(!studycase) {
    return next(
      new ErrorResponse('Answers non trouvé avec id ${req.body.id}',HttpStatus.NOT_FOUND)
    )
  }
  res.status(HttpStatus.OK).json({ success: true, data: studycase });
});
module.exports.addStudyCase = asyncHandler(async (req, res, next) => {
  let studycase;
  try {
    results = await conn.transaction(async t => {
      try {
        studycase = await StudyCases.create(req.body, {
          include: [{
            model: Questions,
            include: [Answers]
          }]
        });
        const name = new Date().valueOf() + 'std' +'_' + studycase.dataValues.code;
        codeBarFactory(studycase.dataValues.code,name);
        studycase.image = [name + '.png'];
        await studycase.save({transaction: t});
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({success: true, data: studycase});
  } catch (e) {
    console.error(e);
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer',HttpStatus.BAD_REQUEST)
    );
  }
});
module.exports.addbulkStudyCases = asyncHandler(async (req, res, next) => {
  let studycase = [];
  try {
    results = await conn.transaction(async t => {
      try {
        studycase = await StudyCases.bulkCreate(req.body, {transaction: t});
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({success: true, data: studycase});
  } catch (e) {
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer',HttpStatus.BAD_REQUEST)
    )
  }
});
module.exports.updateStudyCase = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const  upId = await StudyCases.update(req.body,{
    where: { id: id }
  });
  const studycase = await StudyCases.findByPk(id);
  res.status(HttpStatus.OK).json({ success: true, data: studycase });
});
module.exports.destroyStudyCase = asyncHandler(async (req, res, next) => {
  let studycase = await StudyCases.findById(req.params.id);
  if (!studycase) {
    return next(
      new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
    );
  }
  studycase.destroy();
  res.status(HttpStatus.OK).json({ success: true, data: {} });
});
