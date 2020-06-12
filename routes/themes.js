const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResult");
const Themes = require('../Models/Theme');
const {
  addbulkThemes,
  addTheme,
  destroyTheme,
  getThemeByid,
  getThemes,
  updateTheme
} = require('../controllers/Themes');
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Themes
    ),
    getThemes
  )
  .post(addTheme)
//.put();
router
  .route("/:id")
  .get(getThemeByid)
  .put(updateTheme)
  .delete(destroyTheme);

router
  .route('/bulk/operation')
  .post(addbulkThemes);




module.exports = router;
