const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Themes = require('../Models/Theme');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');

module.exports.getThemes = asyncHandler(async (req, res, next) => {
  res.status(HttpStatus.OK).json(res.advancedResults);
});

module.exports.getThemeByid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const theme = await Themes.findByPk(id);
  if (!theme) {
    return next(
      new ErrorResponse('Answers non trouvé avec id ${req.body.id}', HttpStatus.NOT_FOUND)
    )
  }
  res.status(HttpStatus.OK).json({ success: true, data: theme });
});
module.exports.addTheme = asyncHandler(async (req, res, next) => {
  const theme = await Themes.create(req.body);
  res.status(HttpStatus.OK).json({ success: true, data: theme });
});
module.exports.addbulkThemes = asyncHandler(async (req, res, next) => {
  let theme = [];
  try {
    results = await conn.transaction(async t => {
      try {
        theme = await Themes.bulkCreate(req.body, { transaction: t });
      } catch (e) {
        throw e;
      }
    });
    res.status(HttpStatus.OK).json({ success: true, data: theme });
  } catch (e) {
    return next(
      new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer', HttpStatus.BAD_REQUEST)
    )
  }
});
// module.exports.updateTheme = asyncHandler(async (req, res, next) => {
//     const {id} = req.params;
//     const  upId = Themes.update(req.body,{
//         where: { id: id }
//     });
//     const theme = await Themes.findByPk(upId);
//     res.status(HttpStatus.OK).json({ success: true, data: theme });
// });
//@desc Update an categorie
//@route PUT /api/v1/categories/:id
//@access Private
module.exports.updateTheme = asyncHandler(async (req, res, next) => {
  let theme = await Themes.findById(req.params.id);
  if (!theme) {
    return next(
      new ErrorResponse(`theme non trouvé avec id ${req.params.id}`, 404)
    );
  }
  theme = await Themes.update(req.body, {
    where: { id: req.params.id }
  });
  theme = await Themes.findById(req.params.id);
  res.status(200).json({ success: true, data: theme });
});
module.exports.destroyTheme = asyncHandler(async (req, res, next) => {
  let theme = await Themes.findById(req.params.id);
  if (!theme) {
    return next(
      new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
    );
  }
  theme.destroy();
  res.status(HttpStatus.OK).json({ success: true, data: {} });
});
