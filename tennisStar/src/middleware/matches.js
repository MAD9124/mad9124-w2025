const { BadRequestError } = require("./errors");

const requireAllFields = (req, _, next) => {
  const { court, player1, player2, sets, winner } = req.body;
  if (
    !court ||
    !player1 ||
    !player2 ||
    !sets ||
    !Array.isArray(sets) ||
    !winner
  ) {
    throw new BadRequestError("Missing required field");
  }
  next();
};

module.exports = {
  requireAllFields,
};
