const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const Metiers = require('../Models/Edition');
const {
  addbulkEditions,
  addEdition,
  destroyEdition,
  getEditionByid,
  getEditions,
  updateEdition
} = require('../controllers/editions');
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Metiers
    ),
    getEditions
  )
  .post(addEdition)
//.put();
router
  .route("/:id")
  .get(getEditionByid)
  .put(updateEdition)
  .delete(destroyEdition);

router
  .route('/bulk/operation')
  .post(addbulkEditions);




module.exports = router;
