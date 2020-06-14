const User = require('../Models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');

// creating admin

//@desc Register user
//@route GET /api/v1/auth/register
//@access Public
module.exports.register = asyncHandler(async (req, res, next) => {
  const { nom, email, role, password } = req.body;
  const user = await User.create({ nom, email, role, password });
  sendTokenResponse(user, 200, res);
});
//@desc login user
//@route GET /api/v1/auth/login
//@access Public
module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Merci dentrer lemail et le password', 400));
  }
  // check for user

  const user = await User.find({
    where: { email: email }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  // if (password === user.password) {
  //   isMatch = true;
  // }
  // else {
  //   isMatch = false;
  // }
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  if ((user.to && user.from) && new Date(user.to).getTime() - new Date().getTime() <=0) {
    return next(new ErrorResponse('votre session a été terminé vous devez demander l\'accés d\'aupré un admin', 404));
  }
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send responce
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken(user);
  let expire = process.env.JWT_COOKIE_EXPIRE || 2;
  expire = expire * 24 * 60 * 60 * 1000;
  if (user.to && user.from) {
    expire = Math.floor((new Date(user.to)).getTime() / 1000) - Math.floor(Date.now() / 1000);
  }
  const options = {
    expires: new Date(
      Date.now() + expire
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, user, token, ExpiresIn: user.to?Math.floor((new Date(user.to)).getTime()):Date.now() + expire});
};


module.exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, newPassword } = req.body;
  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Merci dentrer lemail et le password", 400));
  }
  // check for user
  const user = await User.find({
    where: { email: email }
  });
  if (!user) {
    return next(new ErrorResponse("Données incorects", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Données incorects", 401));
  }
  const salt = await bcrypt.genSalt(10);
  newPassword2 = await bcrypt.hash(newPassword, salt);
  await User.update({ password: newPassword2 }, { where: { email } });
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});
