const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Editions = require('../Models/Edition');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');



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
