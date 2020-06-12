const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const Questions = require('../Models/Question');
const {
    addBulkQuestions,
    addQuestion,
    destroyQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion
} = require('../controllers/questions');
const { protect, authorize } = require("../middlewares/auth");

router
    .route("/")
    .get(
        advancedResults(Questions
        ),
        getQuestions
    )
    .post(addQuestion)
//.put();
router
    .route("/:id")
    .get(getQuestionById)
    .put(updateQuestion)
    .delete(destroyQuestion);

router
    .route('/bulk/operation')
    .post(addBulkQuestions);




module.exports = router;
