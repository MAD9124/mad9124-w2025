const { isValidObjectId } = require("mongoose");
const { BadRequestError } = require("./errors");

const validObjectId = (req, _, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw new BadRequestError("id must be valid object id");
  }
  next();
};

module.exports = {
  validObjectId,
};
