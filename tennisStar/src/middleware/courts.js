const { BadRequestError } = require("./errors");

const requireAllFields = (req, res, next) => {
  const { name, count } = req.body;
  if (!name || !count) {
    throw new BadRequestError("Missing required field");
  }
  next();
};

module.exports = {
  requireAllFields,
};
