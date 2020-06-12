const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Metiers = require('../Models/Metier');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');

module.exports.getMetiers = asyncHandler(async (req, res, next) => {
  res.status(HttpStatus.OK).json(res.advancedResults);
});

module.exports.getMetierByid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const metier = await Metiers.findByPk(id);
  if (!metier) {
    return next(
      new ErrorResponse('Answers non trouvé avec id ${req.body.id}', HttpStatus.NOT_FOUND)
    )
  }
  res.status(HttpStatus.OK).json({ success: true, data: metier });
});
module.exports.addMetier = asyncHandler(async (req, res, next) => {
  const metier = await Metiers.create(req.body);
  res.status(HttpStatus.OK).json({ success: true, data: metier });
});
module.exports.addbulkMetiers = asyncHandler(async (req, res, next) => {
  let metier = [];
  try {
    results = await conn.transaction(async t => {
      try {
        metier = await Metiers.bulkCreate(req.body, { transaction: t });
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({ success: true, data: metier });
  } catch (e) {
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer', HttpStatus.BAD_REQUEST)
    )
  }
});
module.exports.updateMetier = asyncHandler(async (req, res, next) => {
  let metier = await Metiers.findById(req.params.id);
  if (!metier) {
    return next(
      new ErrorResponse(`metier non trouvé avec id ${req.params.id}`, 404)
    );
  }
  metier = await Metiers.update(req.body, {
    where: { id: req.params.id }
  });
  metier = await Metiers.findById(req.params.id);
  res.status(200).json({ success: true, data: metier });
});
module.exports.destroyMetier = asyncHandler(async (req, res, next) => {
  let metier = await Metiers.findById(req.params.id);
  if (!metier) {
    return next(
      new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
    );
  }
  metier.destroy();
  res.status(HttpStatus.OK).json({ success: true, data: {} });
});
