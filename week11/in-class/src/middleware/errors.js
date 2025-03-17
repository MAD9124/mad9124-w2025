const mongoose = require('mongoose');

class ApiError extends Error {
  status = 500;

  constructor(message) {
    super(message);
  }
}

class BadRequestError extends ApiError {
  status = 400;
}

class UnauthorizedError extends ApiError {
  status = 401;
}

class ForbiddenError extends ApiError {
  status = 403;
}

class NotFoundError extends ApiError {
  status = 404;
}

const errorHandler = (error, _req, res, _next) => {
  console.error('Error!', error);

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.status).json({
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Something went wrong',
  });
};

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  errorHandler,
};
