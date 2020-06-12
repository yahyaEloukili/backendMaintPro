const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const StudyCases = require('../Models/StudyCase');
const {
  addbulkStudyCases,
  addStudyCase,
  destroyStudyCase,
  getStudyCaseByid,
  getStudyCases,
  updateStudyCase
} = require('../controllers/studyCases');
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(StudyCases
    ),
    getStudyCases
  )
  .post(addStudyCase)
//.put();
router
  .route("/:id")
  .get(getStudyCaseByid)
  .put(updateStudyCase)
  .delete(destroyStudyCase);

router
  .route('/bulk/operation')
  .post(addbulkStudyCases);




module.exports = router;
