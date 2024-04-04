const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode ? res.statusCode : 500;

  if (error.code === 11000 && error.keyValue.email) {
    statusCode = 400;
    error.message = "The User with this email already Exists";
  } else if (error.code === 11000 && error.keyValue.username) {
    statusCode = 400;
    error.message = "The User with this username already Exists";
  } else if (error.errors?.email) {
    statusCode = 400;
    error.message = error.errors.email.message;
  }

  res.status(statusCode).json({ message: error.message });
};

export default errorHandler;
