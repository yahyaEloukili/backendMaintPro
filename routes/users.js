const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatepassword,
  userArray
} = require("../controllers/users");

const User = require("../Models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResult");
const { protect, authorize } = require("../middlewares/auth");

// router.use(protect);
// router.use(authorize('admin'));
// router.route("/userArray").get(userArray)
router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router
  .route('/reset/password')
  .post(protect, updatepassword);
module.exports = router;
