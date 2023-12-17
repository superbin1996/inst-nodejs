const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = async (err, req, res, next) => {
  console.log(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Try again later",
  };

  if(err.name == 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = 400
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
  }

  if(err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
  return res.status(customError.statusCode).json(err);
};

module.exports = errorHandlerMiddleware;
