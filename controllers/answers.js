const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const Answers = require('../Models/Answer');
const HttpStatus = require('http-status-codes');
const conn = require('../config/db');
module.exports.getAnswers = asyncHandler(async (req, res, next) => {
    res.status(HttpStatus.OK).json(res.advancedResults);
});
module.exports.getAnswerByid = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const ans = await Answers.findByPk(id);
    if(!ans) {
        return next(
            new ErrorResponse('Answers non trouvé avec id ${req.body.id}',HttpStatus.NOT_FOUND)
        )
    }
    res.status(HttpStatus.OK).json({ success: true, data: ans });
});
module.exports.addAnswer = asyncHandler(async (req, res, next) => {
    const ans = await Answers.create(req.body);
    res.status(HttpStatus.OK).json({ success: true, data: ans });
});

module.exports.addBulkAnswers = asyncHandler(async (req, res, next) => {
    let ans = [];
    try {
        results = await conn.transaction(async t => {
            try {
                ans = await Answers.bulkCreate(req.body, {transaction: t});
            } catch (e) {
                throw e;
            }
        });
        res.status(HttpStatus.OK).json({success: true, data: ans});
    } catch (e) {
        return next(
            new ErrorResponse('échec de l\'insertion des enregistrements, vérifier et réessayer',HttpStatus.BAD_REQUEST)
        )
    }
});
module.exports.updateAnswer = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const  upId = await Answers.update(req.body,{
        where: { id: id }
    });
	console.log("============================>",upId);
    const ans = await Answers.findByPk(id);
    res.status(HttpStatus.OK).json({ success: true, data: ans });
	
});
module.exports.destroyAnswer = asyncHandler(async (req, res, next) => {
    let ans = await Answers.findById(req.params.id);
    if (!ans) {
        return next(
            new ErrorResponse(`Answer non trouvé avec id ${req.params.id}`, HttpStatus.NOT_FOUND)
        );
    }
    ans.destroy();
    res.status(HttpStatus.OK).json({ success: true, data: {} });
});

