const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const Metiers = require('../Models/Metier');
const {
  addbulkMetiers,
  addMetier,
  destroyMetier,
  getMetierByid,
  getMetiers,
  updateMetier

} = require('../controllers/metiers');
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Metiers
    ),
    getMetiers
  )
  .post(addMetier)
//.put();
router
  .route("/:id")
  .get(getMetierByid)
  .put(updateMetier)
  .delete(destroyMetier);

router
  .route('/bulk/operation')
  .post(addbulkMetiers);




module.exports = router;
