const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "SequelizeUniqueConstraintError") {
    const message = `Valeurs en double entrées`;
    console.log(err.errors);
    error = new ErrorResponse(message, 400);
  }
  console.log(err);
  if (err.name === "SequelizeValidationError") {
    console.log(err);
    let i;
    for (i = 0; i < err.errors.length; i++) {
      if (err.errors[i].type === "notNull Violation") {
        err.errors[
          i
        ].message = `le champs ${err.errors[i].path}  est obligatoire`;
      }
    }
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message
  });
};
module.exports = errorHandler;

// if (err.errors[i].message.split(' ')[0] === 'appareilId') {
//   err.errors[i].message = `le champs ${err.errors[i].message
//     .split(' ')[0]
//     .replace('appareilId', 'appareil')}  est obligatoire`;
// }
