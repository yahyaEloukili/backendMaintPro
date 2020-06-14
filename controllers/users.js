const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../Models/User');
// const Zone = require('../models/Zone');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');


// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id, {

  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
exports.createUser = asyncHandler(async (req, res, next) => {
  const pass2 = Math.random()
    .toString(36)
    .slice(-8);
  req.body["password"] = pass2;
  const user = await User.create(req.body);

  const password = user.password;
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 25,
    auth: {
      user: "yahya.eloukil@gmail.com",
      pass: "asafi2020"
    }
  });
  const message = {
    from: "yahya.eloukil@gmail.com", // Sender address
    to: user.email, // List of recipients
    subject: "password", // Subject line
    text: `Voila ton password ${pass2}` // Plain text body
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User non trouvé avec id ${req.params.id}`, 404)
    );
  }
  user = await User.update(req.body, { where: { id: req.params.id } });
  user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user
  });
});


// categorie chart
// module.exports.userArray = asyncHandler(async (req, res, next) => {
//   const zones = await Zone.findAll();
//   let users = [];
//   for (let i = 0; i < zones.length; i++) {
//     const user = await User.findAll({ where: { zoneId: zones[i].id } });
//     users.push(user.length);
//   }
//   let zonesNames = zones.map(zone => zone.nom)
//   res.status(201).json({ success: true, data: { users, zonesNames } });



// });
// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User non trouvé avec id ${req.params.id}`, 404)
    );
  }
  user.destroy();
  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.updatepassword = asyncHandler(async (req, res, next) => {
  const user = req.user;
  console.log(user.id);
  const { newpassword, oldpassword } = req.body;
  const userToupdate = await User.findById(user.id);
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.compare(oldpassword, userToupdate.password);
  if (!result) {
    return next(
      new ErrorResponse('Password does not match !!', HttpStatus.BAD_REQUEST)
    );
  }
  const newHashedPass = await bcrypt.hash(newpassword, salt);
  userToupdate.password = newHashedPass;
  await userToupdate.save();
  res.status(HttpStatus.OK).json({});

});
