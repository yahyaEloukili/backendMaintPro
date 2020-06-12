const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const Answers = require('../Models/Answer');
const {
    addAnswer,
    addBulkAnswers,
    destroyAnswer,
    getAnswers,
    getAnswerByid,
    updateAnswer,
} = require('../controllers/answers');
const { protect, authorize } = require("../middlewares/auth");

router
    .route("/")
    .get(
        advancedResults(Answers
        ),
        getAnswers
    )
    .post(addAnswer);
    //.put();
router
    .route("/:id")
    .get(getAnswerByid)
    .put(updateAnswer)
    .delete(destroyAnswer);

router
    .route('/bulk/operation')
    .post(addBulkAnswers);




module.exports = router;
