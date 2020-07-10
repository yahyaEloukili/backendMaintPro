const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Editions = require('../Models/Edition');
const Questions = require('../Models/Question');
const StudyCases = require('../Models/StudyCase');
const Editions_SC = require('../Models/Editions_SC');
const Editions_Questions = require('../Models/Editions_Questions');
const Answers = require('../Models/Answer');
const Metiers = require('../Models/Metier');
const Themes = require('../Models/Theme');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');
const exec = require('child_process').exec;
const path = require("path");




module.exports.getEditions = asyncHandler(async (req, res, next) => {
  res.status(HttpStatus.OK).json(res.advancedResults);
});

module.exports.getEditionByid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const edition = await Editions.findByPk(id);
  if (!edition) {
    return next(
      new ErrorResponse('Answers non trouvé avec id ${req.body.id}', HttpStatus.NOT_FOUND)
    )
  }
  res.status(HttpStatus.OK).json({ success: true, data: edition });
});
module.exports.addEdition = asyncHandler(async (req, res, next) => {
  const edition = await Editions.create(req.body);
  res.status(HttpStatus.OK).json({ success: true, data: edition });
});
module.exports.addbulkEditions = asyncHandler(async (req, res, next) => {
  let edition = [];
  try {
    results = await conn.transaction(async t => {
      try {
        edition = await Editions.bulkCreate(req.body, { transaction: t });
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({ success: true, data: edition });
  } catch (e) {
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer', HttpStatus.BAD_REQUEST)
    )
  }
});
module.exports.updateEdition = asyncHandler(async (req, res, next) => {
  let edition = await Editions.findById(req.params.id);
  if (!edition) {
    return next(
      new ErrorResponse(`edition non trouvé avec id ${req.params.id}`, 404)
    );
  }
  edition = await Editions.update(req.body, {
    where: { id: req.params.id }
  });
  edition = await Editions.findById(req.params.id);
  res.status(200).json({ success: true, data: edition });
});
module.exports.destroyEdition = asyncHandler(async (req, res, next) => {
  let edition = await Editions.findById(req.params.id);
  if (!edition) {
    return next(
      new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
    );
  }
  edition.destroy();
  res.status(HttpStatus.OK).json({ success: true, data: {} });
});


module.exports.reporteExcel = (async (req, res, next) => {
  const {editionsId} = req.params;
  console.warn(editionsId);
  let questions = await Questions.findAll({
    where: {type: 'SIMPLE','$editionId$':editionsId},
    // limit: 200,
    include: [{
      model: Editions,
      attributes: [],
      through: 'editions_questions', /// only if exist/needed
    },Answers,{
      model: Metiers,
      include: [Themes]
    }
    ]
  },
    );
  let cases = await StudyCases.findAll({
      // limit: 200,
      where: {'$editionId$':editionsId},
      include: [
        {
          model: Editions,
          attributes: [],
          through: 'editions_sc', /// only if exist/needed
          where: {id: editionsId}
        },
        {
          model: Questions,
          include: [Answers]
        },
        {
          model: Metiers,
          include: [Themes]
        }
      ]
    },
  );
  // console.log( questions[0].get({ plain: true }));
  let reslts = {};let resltscase = {};
  if((questions && questions.length > 0) || (cases && cases.length > 0)) {
    reslts = questions.map(el => el.get({plain: true}));
    resltscase = cases.map(el => {
      el = el.get({plain: true});
      el.questions = el.questions.map(qst => {
        qst["image"]=[""];
        return qst;
      });
      return el;
    });

    console.log(reslts);
    const reportParams = `Questions=${JSON.stringify(JSON.stringify(reslts))} Studycases=${JSON.stringify(JSON.stringify(resltscase))}`;
    const pathJar = path.join(__dirname, "../reporter/com.ocpms.reporting-1.0-SNAPSHOT.jar");
    let child = exec(`java -jar ${pathJar} ${reportParams}`,
      function (error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if(error !== null) {
          console.error(`java -jar ${pathJar} ${reportParams}`);
          // console.log('exec error: ' + error);
          res.status(HttpStatus.EXPECTATION_FAILED, "cannot generate an Excel file make sure the data is complete");
        } else {
          console.error("found content");
          res.status(HttpStatus.OK).sendFile(path.join(__dirname,'../excel.xlsx'));
          // res.status(HttpStatus.OK).json({cases, questions});
        }
      });

  } else {
    res.status(HttpStatus.NOT_FOUND).json("cette édition / classification n'a pas encore de question ou de cas d'étude (this is not an error)");
  }
});
